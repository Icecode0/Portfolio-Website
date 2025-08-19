'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  avatar?: string;
  roles: string[];  // Add this line
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user: User | null;
  login: () => void;
  logout: () => Promise<void>; // Add logout to interface
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthLoading: true,
  user: null,
  login: () => {},
  logout: async () => {} // Add default logout
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    isAuthLoading: true,
    user: null,
    login: () => {
      const params = new URLSearchParams({
        client_id: '1307836138123432047',
        redirect_uri: 'https://primalheaven.com/api/auth/callback/discord',
        // redirect_uri: 'http://localhost:3000/api/auth/callback/discord',
        response_type: 'code',
        scope: 'identify guilds guilds.members.read'
      });
      window.location.href = `https://discord.com/oauth2/authorize?${params}`;
    },
    logout: async () => {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setAuthState(prevState => ({
            ...prevState,
            isAuthenticated: false,
            user: null
          }));
          window.location.href = '/'; // Redirect to home page
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  });

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log('🔄 Starting auth check...');

        const response = await fetch('/api/auth/check', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        console.log('📥 Response status:', response.status);
        if (!mounted) return;

        const data = await response.json();

        // Check if data.user exists before trying to access its properties
        if (!data.user) {
          console.log('⚠️ No user data in response');
          throw new Error('No user data in response');
        }

        setAuthState(prevState => ({
          ...prevState,
          isAuthenticated: response.ok && data.authenticated,
          isAuthLoading: false,
          user: response.ok && data.authenticated && data.user ? {
            id: data.user.id,
            username: data.user.global_name || data.user.username,
            avatar: data.user.avatar,
            roles: data.user.roles || []
          } : null
        }));


      } catch (error) {
        console.error('💥 Auth check error:', error);
        if (mounted) {
          setAuthState(prevState => ({
            ...prevState,
            isAuthenticated: false,
            isAuthLoading: false,
            user: null
          }));
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);



  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {

  const context = useContext(AuthContext);
  
  return context;
};


