import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const FIXED_USERS = [
  { username: 'rutuja', displayName: 'Rutuja', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rutuja' },
  { username: 'chetana', displayName: 'Chetana', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chetana' },
  { username: 'jay', displayName: 'Jay', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jay' },
  { username: 'raj', displayName: 'Raj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj' },
];

interface LoginScreenProps {
  onLogin: (user: { id: string; username: string; displayName: string; avatar: string }) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!selectedUser) {
      toast({
        title: "Please select a user",
        description: "Choose one of the available usernames to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get user data from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', selectedUser)
        .single();

      if (userError) {
        throw userError;
      }

      // Update user's online status
      await supabase
        .from('users')
        .update({ is_online: true, last_seen: new Date().toISOString() })
        .eq('username', selectedUser);

      onLogin({
        id: userData.id,
        username: userData.username,
        displayName: userData.display_name,
        avatar: userData.avatar_url
      });

      toast({
        title: "Welcome back!",
        description: `Logged in as ${userData.display_name}`,
      });

    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Chat App</CardTitle>
          <CardDescription>
            Select your username to start chatting
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Users className="h-4 w-4" />
              <span>Choose your identity</span>
            </div>
            
            {FIXED_USERS.map((user) => (
              <button
                key={user.username}
                onClick={() => setSelectedUser(user.username)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 hover:bg-accent/50 ${
                  selectedUser === user.username 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-card'
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback>
                    {user.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{user.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
                
                {selectedUser === user.username && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={!selectedUser || isLoading}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Start Chatting'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}