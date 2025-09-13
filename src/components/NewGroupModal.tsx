import { useState } from "react";
import { Users, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface NewGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts?: Contact[];
}

export function NewGroupModal({ open, onOpenChange, contacts = [] }: NewGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock contacts if none provided
  const mockContacts: Contact[] = [
    { id: "1", name: "Alice Johnson", avatar: "", isOnline: true },
    { id: "2", name: "Bob Smith", avatar: "", isOnline: false },
    { id: "3", name: "Charlie Brown", avatar: "", isOnline: true },
    { id: "4", name: "Diana Prince", avatar: "", isOnline: true },
  ];

  const availableContacts = contacts.length > 0 ? contacts : mockContacts;

  const handleMemberToggle = (contactId: string) => {
    setSelectedMembers(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedMembers.length === 0) return;

    setLoading(true);
    try {
      // Here you would typically create the group in your database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Group Created",
        description: `"${groupName}" has been created with ${selectedMembers.length} members.`,
      });
      
      // Reset form and close modal
      setGroupName("");
      setSelectedMembers([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New Group
          </DialogTitle>
          <DialogDescription>
            Create a new group chat by entering a name and selecting members.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Select Members ({selectedMembers.length} selected)</Label>
            <ScrollArea className="h-48 rounded-md border border-border/50 p-2">
              <div className="space-y-2">
                {availableContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer"
                    onClick={() => handleMemberToggle(contact.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(contact.id)}
                      onChange={() => handleMemberToggle(contact.id)}
                    />
                    
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="text-xs">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${
                        contact.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contact.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    
                    {selectedMembers.includes(contact.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </form>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !groupName.trim() || selectedMembers.length === 0}
          >
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}