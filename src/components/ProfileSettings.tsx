import { useState } from "react";
import { Save, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AvatarUpload } from "./AvatarUpload";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phone: string;
}

export function ProfileSettings() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    name: user?.displayName || "John Doe",
    email: `${user?.username || "john.doe"}@example.com`,
    avatar: user?.avatar || "/placeholder.svg",
    bio: "Software developer passionate about creating amazing user experiences.",
    phone: "+1 (555) 123-4567"
  });

  const handleSave = async () => {
    if (!user) return;

    try {
      // Update user avatar in database
      await supabase
        .from('users')
        .update({ 
          display_name: profile.name,
          avatar_url: profile.avatar
        })
        .eq('username', user.username);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setProfile(prev => ({ ...prev, avatar: avatarUrl }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <AvatarUpload
          currentAvatar={profile.avatar}
          name={profile.name}
          onAvatarChange={handleAvatarChange}
        />
        <div>
          <h3 className="text-lg font-medium text-foreground">{profile.name}</h3>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={profile.phone}
            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            className="min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button onClick={handleLogout} variant="outline" className="flex-1">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}