import { useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

interface ChatSidebarProps {
  contacts: Contact[];
  activeContactId: string;
  onContactSelect: (contactId: string) => void;
}

export function ChatSidebar({ contacts, activeContactId, onContactSelect }: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebar-container flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-input border-border/50 focus:border-primary"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-item ${contact.id === activeContactId ? 'active' : ''}`}
            onClick={() => onContactSelect(contact.id)}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {/* Online Status */}
              <div className={`absolute -bottom-0.5 -right-0.5 ${contact.isOnline ? 'status-dot-online' : 'status-dot-offline'}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
                <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
            </div>
            
            {contact.unreadCount > 0 && (
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">{contact.unreadCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}