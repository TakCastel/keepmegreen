'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PaywallContextType {
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  paywallConfig: {
    feature: string;
    title: string;
    description: string;
  } | null;
  setPaywallConfig: (config: {
    feature: string;
    title: string;
    description: string;
  } | null) => void;
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallConfig, setPaywallConfig] = useState<{
    feature: string;
    title: string;
    description: string;
  } | null>(null);

  return (
    <PaywallContext.Provider value={{
      showPaywall,
      setShowPaywall,
      paywallConfig,
      setPaywallConfig
    }}>
      {children}
    </PaywallContext.Provider>
  );
}

export function usePaywall() {
  const context = useContext(PaywallContext);
  if (context === undefined) {
    throw new Error('usePaywall must be used within a PaywallProvider');
  }
  return context;
}
