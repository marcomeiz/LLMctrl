'use client';

import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-2 px-4 text-xs text-text-muted sm:px-6">
        <span>Powered by</span>
        <Image
          src="/logos/interamplify.webp"
          alt="Interamplify"
          width={80}
          height={16}
          className={`h-4 w-auto ${theme === 'light' ? 'brightness-0' : ''}`}
        />
      </div>
    </footer>
  );
}
