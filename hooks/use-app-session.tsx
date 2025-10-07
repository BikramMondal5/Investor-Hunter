"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Profile {
  firstName: string;
  lastName:string;
  email: string;
  company: string;
  profilePhoto?: string;
  notifications: {
    investorInterest: boolean;
    messages: boolean;
    communityFeedback: boolean;
  };
}

interface AppSession {
  user: User | null;
  profile: Profile | null;
}

interface SessionContextType {
  session: AppSession | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function AppSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AppSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useAppSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useAppSession must be used within an AppSessionProvider');
  }
  return context;
}
