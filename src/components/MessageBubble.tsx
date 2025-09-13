import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  senderName?: string;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(message.timestamp, { addSuffix: true });

  return (
    <div className={`flex mb-4 animate-message-slide-in ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className="flex flex-col max-w-xs lg:max-w-md">
        {!message.isOwn && message.senderName && (
          <span className="text-xs text-muted-foreground mb-1 ml-3 font-medium">
            {message.senderName}
          </span>
        )}
        <div className={message.isOwn ? 'message-bubble-sent' : 'message-bubble-received'}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        
        <div className={`flex items-center gap-1 mt-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          
          {message.isOwn && (
            <div className="ml-1">
              {message.status === 'sent' && <Check className="h-3 w-3 text-muted-foreground" />}
              {message.status === 'delivered' && <CheckCheck className="h-3 w-3 text-muted-foreground" />}
              {message.status === 'read' && <CheckCheck className="h-3 w-3 text-primary" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}