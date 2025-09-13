import { Phone, Video, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface ChatHeaderProps {
  contact: Contact | null;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
  onSearchMessages?: (query: string) => void;
}

export function ChatHeader({ contact, onToggleSidebar, isMobile, onSearchMessages }: ChatHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  if (!contact) {
    return (
      <div className="h-16 border-b border-border/50 bg-card flex items-center justify-center">
        <p className="text-muted-foreground">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-16 border-b border-border/50 bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {isMobile && onToggleSidebar && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-2">
            <Menu className="h-4 w-4" />
          </Button>
        )}
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${contact.isOnline ? 'bg-chat-online' : 'bg-chat-offline'}`} />
        </div>
        
        <div>
          <h3 className="font-semibold text-foreground">{contact.name}</h3>
          <p className="text-sm text-muted-foreground">
            {contact.isOnline ? 'Active now' : 'Last seen recently'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isSearching ? (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearchMessages?.(e.target.value);
              }}
              className="w-48"
              autoFocus
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setIsSearching(false);
                setSearchQuery("");
                onSearchMessages?.("");
              }}
            >
              ✕
            </Button>
          </div>
        ) : (
          <>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <Video className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-accent"
              onClick={() => setIsSearching(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}