import { useState, useEffect } from 'react';
import { User, InsertUser } from '@shared/schema';
import { authService } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const signIn = async (userData: InsertUser) => {
    try {
      setIsLoading(true);
      const user = await authService.signIn(userData);
      setUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    authService.signOut();
    setUser(null);
  };

  return {
    user,
    signIn,
    signOut,
    isLoading,
    isAuthenticated: !!user
  };
}
