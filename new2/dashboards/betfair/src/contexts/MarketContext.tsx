'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MarketId, MarketConfig, MARKETS } from '@/lib/data';

interface MarketContextType {
  market: MarketId;
  marketConfig: MarketConfig;
  setMarket: (market: MarketId) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [market, setMarketState] = useState<MarketId>('uk');

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('llmctrl-market');
    if (saved && (saved === 'uk' || saved === 'spain')) {
      setMarketState(saved);
    }
  }, []);

  const setMarket = (newMarket: MarketId) => {
    setMarketState(newMarket);
    localStorage.setItem('llmctrl-market', newMarket);
  };

  return (
    <MarketContext.Provider
      value={{
        market,
        marketConfig: MARKETS[market],
        setMarket,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
