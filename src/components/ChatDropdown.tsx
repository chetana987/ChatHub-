import { MoreVertical, UserMinus, Trash2, Archive, Info, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ChatDropdownProps {
  contactName?: string;
}

export function ChatDropdown({ contactName }: ChatDropdownProps) {
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleAction = (action: string) => {
    toast({
      title: `${action} ${contactName}`,
      description: `This would ${action.toLowerCase()} the conversation with ${contactName}.`,
    });
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-accent">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border border-border/50">
        {/* Current User Section */}
        {user && (
          <>
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback>
                  {user.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.displayName}</span>
                <span className="text-xs text-muted-foreground">@{user.username}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Contact Actions (only show if contact is selected) */}
        {contactName && (
          <>
            <DropdownMenuItem onClick={() => handleAction("View Info")}>
              <Info className="h-4 w-4 mr-2" />
              View Info
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("Archive")}>
              <Archive className="h-4 w-4 mr-2" />
              Archive Chat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleAction("Block")}
              className="text-destructive focus:text-destructive"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleAction("Delete")}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Chat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* Logout Action */}
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}