"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface FormalContextType {
  isFormal: boolean;
  setIsFormal: (value: boolean) => void;
}

const FormalContext = createContext<FormalContextType | undefined>(undefined);

export function FormalProvider({ children }: { children: ReactNode }) {
  const [isFormal, setIsFormal] = useState(true);

  return (
    <FormalContext.Provider value={{ isFormal, setIsFormal }}>
      {children}
    </FormalContext.Provider>
  );
}

export function useFormal() {
  const context = useContext(FormalContext);
  if (context === undefined) {
    throw new Error('useFormal must be used within a FormalProvider');
  }
  return context;
}