import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  currentAvatar: string;
  name: string;
  onAvatarChange: (avatarUrl: string) => void;
  size?: number;
}

export function AvatarUpload({ currentAvatar, name, onAvatarChange, size = 80 }: AvatarUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Convert to data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onAvatarChange(dataUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`h-${size/4} w-${size/4}`} style={{ height: size, width: size }}>
        <AvatarImage src={currentAvatar} alt={name} />
        <AvatarFallback className="text-lg">
          {name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <Button
        size="icon"
        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
        onClick={triggerFileSelect}
      >
        <Camera className="h-4 w-4" />
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}