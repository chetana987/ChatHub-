import { useState } from "react";
import { UserPlus, Upload } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

interface NewContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewContactModal({ open, onOpenChange }: NewContactModalProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      // Here you would typically add the contact to your database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Contact Added",
        description: `${name} has been added to your contacts.`,
      });
      
      // Reset form and close modal
      setName("");
      setAvatar("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAvatar = () => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setAvatar(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${randomColor.slice(3, -3)}&color=fff&size=128`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Contact
          </DialogTitle>
          <DialogDescription>
            Create a new contact by entering their name and choosing an avatar.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-lg">
                {name.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateAvatar}
              disabled={!name.trim()}
            >
              <Upload className="h-3 w-3 mr-1" />
              Generate Avatar
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact-name">Contact Name</Label>
            <Input
              id="contact-name"
              placeholder="Enter contact name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar-url">Avatar URL (optional)</Label>
            <Input
              id="avatar-url"
              placeholder="https://example.com/avatar.jpg"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
        </form>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? "Adding..." : "Add Contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}