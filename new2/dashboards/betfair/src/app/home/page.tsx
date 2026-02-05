'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface VersionCard {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  stats?: {
    total: number;
    critical: number;
  };
  active: boolean;
  href: string;
}

const versions: VersionCard[] = [
  {
    id: 'version-a',
    name: 'Version A',
    subtitle: 'Minimalista',
    description: 'Estilo Linear/Vercel con diseño limpio y funcional',
    stats: {
      total: 258,
      critical: 35,
    },
    active: true,
    href: '/betfair',
  },
  {
    id: 'version-b',
    name: 'Version B',
    subtitle: 'Dashboard Pro',
    description: 'Sidebar lateral, más widgets, gráficos avanzados y tabla de datos',
    stats: {
      total: 258,
      critical: 35,
    },
    active: true,
    href: '/betfair-b',
  },
  {
    id: 'version-c',
    name: 'Version C',
    subtitle: 'Analytics Focus',
    description: 'KPIs prominentes, health score, indicadores de tendencia y visualizaciones avanzadas',
    stats: {
      total: 258,
      critical: 35,
    },
    active: true,
    href: '/betfair-c',
  },
  {
    id: 'version-d',
    name: 'Version D',
    subtitle: 'Executive View',
    description: 'Resumen ejecutivo, insights clave, status de salud y acciones prioritarias',
    stats: {
      total: 258,
      critical: 35,
    },
    active: true,
    href: '/betfair-d',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-text">LLMCtrl</span>
            <span className="text-xs text-text-muted">Brand Visibility Monitor</span>
          </div>
          <Image
            src="/logos/interamplify.webp"
            alt="Interamplify"
            width={80}
            height={20}
            className={`h-5 w-auto ${theme === 'light' ? 'brightness-0' : ''}`}
          />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Betfair Logo */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/logos/betfair-seeklogo.png"
              alt="Betfair"
              width={160}
              height={40}
              className={`h-10 w-auto ${theme === 'dark' ? 'invert' : ''}`}
            />
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-text sm:text-3xl">Select Dashboard Version</h1>
            <p className="mt-2 text-sm text-text-muted">
              Choose a visualization style for the LLM visibility analysis
            </p>
          </div>

          {/* Version cards grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {versions.map((version) => (
              <div key={version.id}>
                {version.active ? (
                  <Link
                    href={version.href}
                    className="group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-all hover:border-text-muted/50 hover:shadow-lg"
                  >
                    {/* Version name */}
                    <div className="mb-2">
                      <span className="text-xl font-semibold text-text">{version.name}</span>
                      <span className="ml-2 text-sm text-text-muted">{version.subtitle}</span>
                    </div>

                    {/* Description */}
                    <p className="mb-4 text-sm text-text-muted">{version.description}</p>

                    {/* Stats */}
                    {version.stats && (
                      <div className="mb-4 flex gap-4">
                        <div>
                          <span className="text-2xl font-semibold text-text">{version.stats.total}</span>
                          <span className="ml-1 text-xs text-text-muted">responses</span>
                        </div>
                        <div>
                          <span className="text-2xl font-semibold text-critical">{version.stats.critical}</span>
                          <span className="ml-1 text-xs text-text-muted">critical</span>
                        </div>
                      </div>
                    )}

                    {/* Action */}
                    <div className="mt-auto flex items-center gap-2 text-sm font-medium text-text group-hover:text-opportunity">
                      <span>View Dashboard</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ) : (
                  <div className="flex h-full flex-col rounded-lg border border-border bg-surface/50 p-6 opacity-60">
                    {/* Version name */}
                    <div className="mb-2">
                      <span className="text-xl font-semibold text-text">{version.name}</span>
                      <span className="ml-2 text-sm text-text-muted">{version.subtitle}</span>
                    </div>

                    {/* Description */}
                    <p className="mb-4 text-sm text-text-muted">{version.description}</p>

                    {/* Coming soon badge */}
                    <div className="mt-auto">
                      <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-text-muted">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-text-muted sm:px-6">
          Powered by Interamplify
        </div>
      </footer>
    </div>
  );
}
