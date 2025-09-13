import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AIMessage {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      text: "Hi! I'm your AI assistant. How can I help you today?",
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      text: input,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `ai-${Date.now()}`,
        text: "I understand your message. This is a simulated AI response. In a real implementation, this would connect to an AI service like OpenAI or Google's AI.",
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* AI Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-card">
        <Avatar className="h-10 w-10 bg-primary">
          <AvatarFallback>
            <Bot className="h-5 w-5 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-foreground">chetanaMahajan</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Assistant
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isAI ? 'justify-start' : 'justify-end'}`}
          >
            {message.isAI && (
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                message.isAI
                  ? 'bg-card border border-border/50'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 bg-primary">
              <AvatarFallback>
                <Bot className="h-4 w-4 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border/50 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}