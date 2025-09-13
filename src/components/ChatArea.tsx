import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  senderName?: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface ChatAreaProps {
  contact: Contact | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
  isTyping?: boolean;
  searchQuery?: string;
  onSearchMessages?: (query: string) => void;
}

export function ChatArea({ 
  contact, 
  messages, 
  onSendMessage, 
  onToggleSidebar, 
  isMobile, 
  isTyping = false, 
  searchQuery = "",
  onSearchMessages 
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTyping, setShowTyping] = useState(false);

  // Filter messages based on search query
  const filteredMessages = searchQuery 
    ? messages.filter(message => 
        message.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const handleSearchMessages = (query: string) => {
    // Pass the search query up to parent component via a callback
    if (onSearchMessages) {
      onSearchMessages(query);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!searchQuery) {
      scrollToBottom();
    }
  }, [messages, showTyping, searchQuery]);

  useEffect(() => {
    setShowTyping(isTyping);
  }, [isTyping]);

  if (!contact) {
    return (
      <div className="chat-main">
        <div className="h-16 border-b border-border/50 bg-card flex items-center justify-center">
          <p className="text-muted-foreground">Select a conversation to start chatting</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-24 h-24 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Welcome to ChetChat</h3>
            <p className="text-muted-foreground">Choose a contact from the sidebar to start a conversation</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-main">
      <ChatHeader 
        contact={contact} 
        onToggleSidebar={onToggleSidebar} 
        isMobile={isMobile}
        onSearchMessages={handleSearchMessages}
      />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        <div className="max-w-4xl mx-auto">
          {searchQuery && (
            <div className="mb-4 p-2 bg-muted rounded-lg text-sm text-muted-foreground">
              {filteredMessages.length > 0 
                ? `Found ${filteredMessages.length} message${filteredMessages.length !== 1 ? 's' : ''} containing "${searchQuery}"`
                : `No messages found containing "${searchQuery}"`
              }
            </div>
          )}
          {filteredMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {showTyping && contact && !searchQuery && (
            <TypingIndicator contact={contact} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}