import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const checkUser = () => {
      const storedUser = localStorage.getItem('chatUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = (authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem('chatUser', JSON.stringify(authUser));
  };

  const logout = async () => {
    if (user) {
      // Update user's online status
      await supabase
        .from('users')
        .update({ is_online: false, last_seen: new Date().toISOString() })
        .eq('username', user.username);
    }

    setUser(null);
    localStorage.removeItem('chatUser');
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}