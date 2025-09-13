import { useState, useCallback, useEffect } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import { AIChat } from "@/components/AIChat";
import { LoginScreen } from "@/components/LoginScreen";
import { TopBar } from "@/components/TopBar";
import { NewContactModal } from "@/components/NewContactModal";
import { NewGroupModal } from "@/components/NewGroupModal";
import { MoodType } from "@/components/MoodSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
  lastMessageTime?: Date;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  contactId: string;
  senderName?: string;
}

const Index = () => {
  const { user, loading, login } = useAuth();
  const [activeContactId, setActiveContactId] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messagesByContact, setMessagesByContact] = useState<Record<string, Message[]>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'ai'>('chat');
  const [currentMood, setCurrentMood] = useState<MoodType>('happy');
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Handle search messages
  const handleSearchMessages = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // All hooks must be declared before any conditional returns
  const handleContactSelect = useCallback((contactId: string) => {
    setActiveContactId(contactId);
    
    // Close sidebar on mobile when selecting a contact
    if (isMobile) {
      setSidebarOpen(false);
    }
    
    // Mark messages as read when selecting a contact
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, unreadCount: 0 }
        : contact
    ));
  }, [isMobile]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!activeContactId || !user) return;

    // Stop typing indicator when sending message
    setIsTyping(false);

    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageText,
      timestamp: new Date(),
      isOwn: true,
      status: 'sent',
      contactId: activeContactId,
      senderName: user.displayName,
    };

    // Optimistically update UI
    setMessagesByContact(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage],
    }));

    // Update contact's last message and timestamp - also reorder contacts
    const currentTime = new Date();
    setContacts(prev => {
      const updatedContacts = prev.map(contact => 
        contact.id === activeContactId 
          ? { 
              ...contact, 
              lastMessage: messageText, 
              timestamp: 'now',
              lastMessageTime: currentTime,
            }
          : contact
      );
      // Sort by most recent message
      return updatedContacts.sort((a, b) => {
        const aTime = a.lastMessageTime || new Date(0);
        const bTime = b.lastMessageTime || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });
    });

    try {
      // Save message to database
      const { data: savedMessage, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: activeContactId,
          content: messageText,
          message_type: 'text',
          status: 'sent'
        })
        .select()
        .single();

      if (error) throw error;

      // Update the message with the real ID
      setMessagesByContact(prev => ({
        ...prev,
        [activeContactId]: prev[activeContactId]?.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, id: savedMessage.id, status: 'delivered' }
            : msg
        ) || [],
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the message from UI if it failed to send
      setMessagesByContact(prev => ({
        ...prev,
        [activeContactId]: prev[activeContactId]?.filter(msg => msg.id !== newMessage.id) || [],
      }));
    }
  }, [activeContactId, user]);

  // Load contacts and messages when user logs in
  useEffect(() => {
    if (!user) return;

    const loadContacts = async () => {
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .neq('username', user.username);

        if (error) throw error;

        // Get latest message for each user to determine order
        const contactsWithMessages = await Promise.all(
          users.map(async (u) => {
            const { data: latestMessage } = await supabase
              .from('messages')
              .select('created_at, content')
              .or(`and(sender_id.eq.${user.id},recipient_id.eq.${u.id}),and(sender_id.eq.${u.id},recipient_id.eq.${user.id})`)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            return {
              id: u.id,
              name: u.display_name,
              avatar: u.avatar_url || `/api/placeholder/40/40`,
              lastMessage: latestMessage?.content || 'Say hello!',
              timestamp: latestMessage ? new Date(latestMessage.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : 'now',
              lastMessageTime: latestMessage ? new Date(latestMessage.created_at) : new Date(0),
              isOnline: u.is_online,
              unreadCount: 0,
            };
          })
        );

        // Sort by most recent message
        const sortedContacts = contactsWithMessages.sort((a, b) => {
          const aTime = a.lastMessageTime || new Date(0);
          const bTime = b.lastMessageTime || new Date(0);
          return bTime.getTime() - aTime.getTime();
        });

        setContacts(sortedContacts);

        // Set first contact as active if no contact is selected
        if (sortedContacts.length > 0 && !activeContactId) {
          setActiveContactId(sortedContacts[0].id);
        }
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    };

    loadContacts();
  }, [user, activeContactId]);

  // Load messages for active contact and set up real-time subscription
  useEffect(() => {
    if (!user || !activeContactId) return;

    const loadMessages = async () => {
      try {
        const { data: messages, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:users!sender_id(display_name)
          `)
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${activeContactId}),and(sender_id.eq.${activeContactId},recipient_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const formattedMessages: Message[] = messages.map(msg => ({
          id: msg.id,
          text: msg.content,
          timestamp: new Date(msg.created_at),
          isOwn: msg.sender_id === user.id,
          status: msg.status as 'sent' | 'delivered' | 'read',
          contactId: activeContactId,
          senderName: msg.sender?.display_name || 'Unknown',
        }));

        setMessagesByContact(prev => ({
          ...prev,
          [activeContactId]: formattedMessages,
        }));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${user.id},recipient_id.eq.${activeContactId}),and(sender_id.eq.${activeContactId},recipient_id.eq.${user.id}))`,
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Get sender details for the new message
          const { data: senderData } = await supabase
            .from('users')
            .select('display_name')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage: Message = {
            id: payload.new.id,
            text: payload.new.content,
            timestamp: new Date(payload.new.created_at),
            isOwn: payload.new.sender_id === user.id,
            status: payload.new.status as 'sent' | 'delivered' | 'read',
            contactId: activeContactId,
            senderName: senderData?.display_name || 'Unknown',
          };

          setMessagesByContact(prev => ({
            ...prev,
            [activeContactId]: [...(prev[activeContactId] || []), newMessage],
          }));

          // Update contact's last message and reorder contacts
          const messageTime = new Date(payload.new.created_at);
          setContacts(prev => {
            const senderId = payload.new.sender_id;
            const recipientId = payload.new.recipient_id;
            const contactId = senderId === user.id ? recipientId : senderId;
            
            const updatedContacts = prev.map(contact => 
              contact.id === contactId
                ? { 
                    ...contact, 
                    lastMessage: payload.new.content, 
                    timestamp: messageTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }),
                    lastMessageTime: messageTime,
                  }
                : contact
            );
            
            // Sort by most recent message
            return updatedContacts.sort((a, b) => {
              const aTime = a.lastMessageTime || new Date(0);
              const bTime = b.lastMessageTime || new Date(0);
              return bTime.getTime() - aTime.getTime();
            });
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeContactId]);

  // Apply mood theme to document
  useEffect(() => {
    document.documentElement.className = `mood-${currentMood}`;
  }, [currentMood]);

  const activeContact = contacts.find(c => c.id === activeContactId) || null;
  const activeMessages = messagesByContact[activeContactId] || [];

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <TopBar 
        currentMood={currentMood}
        onMoodChange={setCurrentMood}
        onNewContact={() => setShowNewContactModal(true)}
        onNewGroup={() => setShowNewGroupModal(true)}
      />
      
      {/* Main Chat Container */}
      <div className="chat-container flex-1">
        <div className={`sidebar-container ${isMobile && !sidebarOpen ? 'hidden' : ''}`}>
          <div className="flex flex-col h-full">
            {/* Tab Header */}
            <div className="flex border-b border-border/50 bg-card">
              <Button
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('chat')}
                className="flex-1 rounded-none"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button
                variant={activeTab === 'ai' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('ai')}
                className="flex-1 rounded-none"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI
              </Button>
            </div>

            {/* Tab Content */}
            {activeTab === 'chat' ? (
              <ChatSidebar 
                contacts={contacts}
                activeContactId={activeContactId}
                onContactSelect={handleContactSelect}
              />
            ) : (
              <div className="flex-1 overflow-hidden">
                <AIChat />
              </div>
            )}
          </div>
        </div>
        <div className={`chat-main ${isMobile && sidebarOpen ? 'sidebar-open' : ''}`}>
          {activeTab === 'chat' ? (
            <ChatArea 
              contact={activeContact}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              isMobile={isMobile}
              isTyping={isTyping}
              searchQuery={searchQuery}
              onSearchMessages={handleSearchMessages}
            />
          ) : (
            <div className="flex-1 overflow-hidden">
              <AIChat />
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <NewContactModal 
        open={showNewContactModal}
        onOpenChange={setShowNewContactModal}
      />
      <NewGroupModal 
        open={showNewGroupModal}
        onOpenChange={setShowNewGroupModal}
        contacts={contacts}
      />
    </div>
  );
};

export default Index;