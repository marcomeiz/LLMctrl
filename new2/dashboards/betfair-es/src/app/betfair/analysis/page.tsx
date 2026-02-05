'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import RecordCard from '@/components/RecordCard';
import { getSummary, getRecordsByCategory, CATEGORY_NAMES, CategoryId } from '@/lib/data';

export default function BetfairAnalysisPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const summary = getSummary();
  const [expandedCategory, setExpandedCategory] = useState<CategoryId | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Short names for chart labels (Spanish)
  const SHORT_NAMES: { [key in CategoryId]: string } = {
    1: 'Marca',
    2: 'General',
    3: 'Competencia',
    4: 'Comercial',
    5: 'Transaccional',
    6: 'Transaccional+',
  };

  // Prepare chart data
  const chartData = Object.entries(summary.byCategory).map(([catId, data]) => ({
    name: CATEGORY_NAMES[Number(catId) as CategoryId],
    shortName: SHORT_NAMES[Number(catId) as CategoryId],
    total: data.total,
    critical: data.critical,
    warning: data.warning,
    opportunity: data.opportunity,
    categoryId: Number(catId) as CategoryId,
  }));

  // Get colors based on theme
  const colors = {
    critical: theme === 'dark' ? '#EF4444' : '#DC2626',
    warning: theme === 'dark' ? '#F59E0B' : '#D97706',
    opportunity: theme === 'dark' ? '#22C55E' : '#059669',
    text: theme === 'dark' ? '#FAFAFA' : '#0A0A0A',
    textMuted: theme === 'dark' ? '#A1A1A1' : '#717171',
    border: theme === 'dark' ? '#262626' : '#E5E5E5',
  };

  // Get top triggers for a category
  const getTopTriggersForCategory = (categoryId: CategoryId) => {
    const categoryRecords = getRecordsByCategory(categoryId);
    const triggerCounts: { [key: string]: number } = {};
    categoryRecords.forEach(r => {
      r.triggers_detected.forEach(t => {
        triggerCounts[t] = (triggerCounts[t] || 0) + 1;
      });
    });
    return Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

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
              <h1 className="text-lg font-semibold text-text sm:text-xl">Análisis por Categoría</h1>
              <span className="text-lg">🇪🇸</span>
            </div>
            <p className="text-sm text-text-muted">
              Distribución de clasificaciones por tipo de pregunta
            </p>
          </div>

          {/* Chart */}
          <div className="mb-6 rounded-lg border border-border bg-surface p-4 sm:p-6">
            <h2 className="mb-4 text-sm font-medium text-text">Distribución por Categoría</h2>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" tick={{ fill: colors.textMuted, fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    tick={{ fill: colors.text, fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#141414' : '#FFFFFF',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: colors.text }}
                  />
                  <Bar dataKey="critical" stackId="a" fill={colors.critical} name="Crítico" />
                  <Bar dataKey="warning" stackId="a" fill={colors.warning} name="Advertencia" />
                  <Bar dataKey="opportunity" stackId="a" fill={colors.opportunity} name="Oportunidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 flex justify-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded" style={{ backgroundColor: colors.critical }} />
                <span className="text-xs text-text-muted">Crítico</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded" style={{ backgroundColor: colors.warning }} />
                <span className="text-xs text-text-muted">Advertencia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded" style={{ backgroundColor: colors.opportunity }} />
                <span className="text-xs text-text-muted">Oportunidad</span>
              </div>
            </div>
          </div>

          {/* Category breakdown cards */}
          <div className="space-y-4">
            {chartData.map((cat) => {
              const isExpanded = expandedCategory === cat.categoryId;
              const categoryRecords = getRecordsByCategory(cat.categoryId);
              const criticalRecords = categoryRecords.filter(r => r.classification === 'CRITICAL').slice(0, 3);
              const topTriggers = getTopTriggersForCategory(cat.categoryId);

              return (
                <div
                  key={cat.categoryId}
                  className="rounded-lg border border-border bg-surface"
                >
                  {/* Category header - clickable */}
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.categoryId)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-text">{cat.name}</h3>
                      <p className="text-xs text-text-muted">{cat.total} registros</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Quick stats */}
                      <div className="hidden items-center gap-3 sm:flex">
                        <span className="text-xs">
                          <span className="text-critical">{cat.critical}</span>
                          <span className="text-text-muted"> crítico</span>
                        </span>
                        <span className="text-xs">
                          <span className="text-warning">{cat.warning}</span>
                          <span className="text-text-muted"> advertencia</span>
                        </span>
                        <span className="text-xs">
                          <span className="text-opportunity">{cat.opportunity}</span>
                          <span className="text-text-muted"> oportunidad</span>
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-text-muted" />
                      ) : (
                        <ChevronDown size={18} className="text-text-muted" />
                      )}
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-border p-4">
                      {/* Stats on mobile */}
                      <div className="mb-4 flex items-center gap-3 sm:hidden">
                        <span className="text-xs">
                          <span className="text-critical">{cat.critical}</span>
                          <span className="text-text-muted"> crítico</span>
                        </span>
                        <span className="text-xs">
                          <span className="text-warning">{cat.warning}</span>
                          <span className="text-text-muted"> advertencia</span>
                        </span>
                        <span className="text-xs">
                          <span className="text-opportunity">{cat.opportunity}</span>
                          <span className="text-text-muted"> oportunidad</span>
                        </span>
                      </div>

                      {/* Top triggers */}
                      {topTriggers.length > 0 && (
                        <div className="mb-4">
                          <span className="text-xs text-text-muted">Triggers principales: </span>
                          <span className="text-xs text-text">
                            {topTriggers.map(([t, c]) => `${t} (${c})`).join(', ')}
                          </span>
                        </div>
                      )}

                      {/* Critical records preview */}
                      {criticalRecords.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-medium text-text-muted">
                            Registros críticos:
                          </span>
                          {criticalRecords.map((record) => (
                            <RecordCard key={record.id} record={record} showPreview={false} basePath="/betfair" />
                          ))}
                        </div>
                      )}

                      {/* View all link */}
                      <Link
                        href={`/betfair/list?category=${cat.categoryId}`}
                        className="mt-3 inline-block text-xs text-text-muted hover:text-text"
                      >
                        Ver todos los registros de {cat.name} →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
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
