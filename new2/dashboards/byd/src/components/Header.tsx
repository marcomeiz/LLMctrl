'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { theme } = useTheme();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand logos */}
        <div className="flex items-center gap-4">
          <Link href="/byd" className="flex items-center gap-3">
            <Image
              src="/logos/BYD-Logo.png"
              alt="BYD"
              width={60}
              height={24}
              className={`h-6 w-auto ${theme === 'light' ? '' : 'brightness-0 invert'}`}
            />
            <span className="hidden text-xs text-text-muted sm:inline">×</span>
            <span className="hidden text-sm font-medium text-text sm:inline">LLMCtrl</span>
          </Link>
        </div>

        {/* Right: Market badge + Interamplify + Controls */}
        <div className="flex items-center gap-3">
          {/* Market badge - UK */}
          <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted">
            🇬🇧 UK
          </span>

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
