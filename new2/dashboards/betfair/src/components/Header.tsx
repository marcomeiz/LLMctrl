'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMarket } from '@/contexts/MarketContext';
import { MARKETS, MarketId } from '@/lib/data';

export default function Header() {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const { market, setMarket, marketConfig } = useMarket();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand logos */}
        <div className="flex items-center gap-4">
          <Link href="/betfair" className="flex items-center gap-3">
            <Image
              src="/logos/betfair-seeklogo.png"
              alt="Betfair"
              width={100}
              height={24}
              className={`h-6 w-auto ${theme === 'dark' ? 'invert' : ''}`}
            />
            <span className="hidden text-xs text-text-muted sm:inline">×</span>
            <span className="hidden text-sm font-medium text-text sm:inline">LLMCtrl</span>
          </Link>
        </div>

        {/* Right: Market Selector + Interamplify + Controls */}
        <div className="flex items-center gap-3">
          {/* Market Selector */}
          <div className="relative">
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value as MarketId)}
              className="appearance-none rounded-md border border-border bg-surface px-3 py-1.5 pr-8 text-sm text-text-muted transition-colors hover:text-text focus:outline-none focus:ring-1 focus:ring-border cursor-pointer"
            >
              {Object.values(MARKETS).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.flag} {m.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>

          {/* Interamplify logo */}
          <Image
            src="/logos/interamplify.webp"
            alt="Interamplify"
            width={80}
            height={20}
            className={`hidden h-5 w-auto sm:block ${theme === 'light' ? 'brightness-0' : ''}`}
          />

          <button
            onClick={logout}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:bg-surface hover:text-text"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
