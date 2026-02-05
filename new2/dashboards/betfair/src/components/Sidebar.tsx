'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, List, BarChart3, ArrowLeft, X, Menu } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

interface SidebarProps {
  basePath: string;
}

export default function Sidebar({ basePath }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: basePath, label: 'Dashboard', icon: Home },
    { href: `${basePath}/list`, label: 'Records', icon: List },
    { href: `${basePath}/analysis`, label: 'Analysis', icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === basePath) {
      return pathname === basePath;
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo section */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logos/betfair-seeklogo.png"
            alt="Betfair"
            width={100}
            height={25}
            className={`h-6 w-auto ${theme === 'dark' ? 'invert' : ''}`}
          />
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded p-1 text-text-muted hover:bg-border hover:text-text lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(href)
                ? 'bg-text text-background'
                : 'text-text-muted hover:bg-border hover:text-text'
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Back to versions */}
      <div className="border-t border-border p-3">
        <Link
          href="/home"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-border hover:text-text"
        >
          <ArrowLeft size={16} />
          <span>Back to Versions</span>
        </Link>
      </div>

      {/* Footer with Interamplify logo */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-center">
          <Image
            src="/logos/interamplify.webp"
            alt="Interamplify"
            width={80}
            height={20}
            className={`h-4 w-auto opacity-60 ${theme === 'light' ? 'brightness-0' : ''}`}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-border bg-surface p-2 text-text shadow-lg lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
