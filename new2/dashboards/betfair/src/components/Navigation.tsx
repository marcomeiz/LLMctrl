'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, BarChart3, ArrowLeft } from 'lucide-react';

interface NavigationProps {
  basePath?: string;
}

export default function Navigation({ basePath = '' }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: `${basePath}`, label: 'Home', icon: Home },
    { href: `${basePath}/list`, label: 'List', icon: List },
    { href: `${basePath}/analysis`, label: 'Analysis', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-sm sm:relative sm:border-t-0 sm:bg-transparent sm:backdrop-blur-none">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-around px-4 sm:h-10 sm:justify-start sm:gap-1 sm:px-6">
        {/* Back to clients - desktop only */}
        {basePath && (
          <Link
            href="/home"
            className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-xs text-text-muted transition-colors hover:text-text sm:flex"
          >
            <ArrowLeft size={14} />
            <span>Clients</span>
          </Link>
        )}

        {basePath && <div className="hidden h-4 w-px bg-border sm:block" />}

        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href ||
            (label === 'Home' && pathname === basePath) ||
            (label !== 'Home' && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors sm:flex-row sm:gap-2 sm:rounded-md sm:px-3 sm:py-1.5 sm:text-sm ${
                isActive
                  ? 'text-text'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Icon size={20} className="sm:hidden" />
              <Icon size={16} className="hidden sm:block" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
