'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import StatCard from '@/components/StatCard';
import RecordCard from '@/components/RecordCard';
import LLMStatus from '@/components/LLMStatus';
import { getSummary, getRecordsByClassification } from '@/lib/data';

export default function BetfairDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const summary = getSummary();
  const criticalRecords = getRecordsByClassification('CRITICAL').slice(0, 5);

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
      <Header />

      {/* Desktop navigation */}
      <div className="hidden border-b border-border bg-surface sm:block">
        <Navigation basePath="/betfair" />
      </div>

      <main className="flex-1 pb-20 sm:pb-6">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {/* Page title */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text sm:text-xl">Resumen Ejecutivo</h1>
              <span className="text-lg">🇪🇸</span>
            </div>
            <p className="text-sm text-text-muted">
              {summary.total} respuestas monitoreadas · Mercado España
            </p>
          </div>

          {/* Stats grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="CRITICAL"
              value={summary.critical}
              total={summary.total}
              classification="CRITICAL"
              href="/betfair/list?classification=CRITICAL"
              large
            />
            <StatCard
              label="WARNING"
              value={summary.warning}
              total={summary.total}
              classification="WARNING"
              href="/betfair/list?classification=WARNING"
            />
            <StatCard
              label="OPPORTUNITY"
              value={summary.opportunity}
              total={summary.total}
              classification="OPPORTUNITY"
              href="/betfair/list?classification=OPPORTUNITY"
            />
          </div>

          {/* LLM Status */}
          <div className="mb-6">
            <LLMStatus />
          </div>

          {/* Recent Critical Records */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-text">Últimos CRITICAL</h2>
              <a
                href="/betfair/list?classification=CRITICAL"
                className="text-xs text-text-muted hover:text-text"
              >
                Ver todos →
              </a>
            </div>
            <div className="space-y-3">
              {criticalRecords.map((record) => (
                <RecordCard key={record.id} record={record} basePath="/betfair" />
              ))}
              {criticalRecords.length === 0 && (
                <p className="text-sm text-text-muted py-4 text-center">
                  No se encontraron registros críticos
                </p>
              )}
            </div>
          </div>

          {/* Top Triggers */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="mb-3 text-sm font-medium text-text">Triggers Más Detectados</h3>
            <div className="flex flex-wrap gap-2">
              {summary.topTriggers.slice(0, 8).map(([trigger, count]) => (
                <span
                  key={trigger}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs"
                >
                  <span className="text-text">{trigger}</span>
                  <span className="text-text-muted">({count})</span>
                </span>
              ))}
              {summary.topTriggers.length === 0 && (
                <span className="text-sm text-text-muted">No se detectaron triggers</span>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile navigation */}
      <div className="sm:hidden">
        <Navigation basePath="/betfair" />
      </div>
    </div>
  );
}
