'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserContextType {
  displayName: string | null;
  updateDisplayName: (newName: string | null) => void;
  refreshDisplayName: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(user?.displayName || null);

  // Synchroniser avec l'utilisateur Firebase Auth
  useEffect(() => {
    setDisplayName(user?.displayName || null);
  }, [user?.displayName]);

  const updateDisplayName = (newName: string | null) => {
    setDisplayName(newName);
  };

  const refreshDisplayName = () => {
    setDisplayName(user?.displayName || null);
  };

  return (
    <UserContext.Provider value={{
      displayName,
      updateDisplayName,
      refreshDisplayName
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
