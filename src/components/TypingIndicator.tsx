import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  contact: {
    name: string;
    avatar: string;
  };
}

export function TypingIndicator({ contact }: TypingIndicatorProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-2 animate-fade-in">
      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
        <AvatarImage src={contact.avatar} alt={contact.name} />
        <AvatarFallback className="text-xs bg-secondary">
          {contact.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3 shadow-lg">
        <span className="text-sm text-muted-foreground font-medium">{contact.name} is typing</span>
        <div className="typing-dots">
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  );
}