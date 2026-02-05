'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import ClassificationBadge from '@/components/ClassificationBadge';
import { getSummary, getRecordsByCategory, CATEGORY_NAMES, CategoryId } from '@/lib/data';

export default function BetfairBAnalysisPage() {
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

  const colors = {
    critical: theme === 'dark' ? '#EF4444' : '#DC2626',
    warning: theme === 'dark' ? '#F59E0B' : '#D97706',
    opportunity: theme === 'dark' ? '#22C55E' : '#059669',
    text: theme === 'dark' ? '#FAFAFA' : '#0A0A0A',
    textMuted: theme === 'dark' ? '#A1A1A1' : '#717171',
    border: theme === 'dark' ? '#262626' : '#E5E5E5',
  };

  // Short names for chart labels
  const SHORT_NAMES: { [key in CategoryId]: string } = {
    1: 'Brand',
    2: 'General',
    3: 'Competitor',
    4: 'Commercial',
    5: 'Transaction',
  };

  // Category data
  const categoryData = Object.entries(summary.byCategory).map(([catId, data]) => ({
    name: CATEGORY_NAMES[Number(catId) as CategoryId],
    shortName: SHORT_NAMES[Number(catId) as CategoryId],
    categoryId: Number(catId) as CategoryId,
    total: data.total,
    critical: data.critical,
    warning: data.warning,
    opportunity: data.opportunity,
    criticalRate: data.total > 0 ? Math.round((data.critical / data.total) * 100) : 0,
  }));

  // Radar data
  const radarData = categoryData.map(cat => ({
    category: cat.shortName,
    critical: cat.critical,
    warning: cat.warning,
    opportunity: cat.opportunity,
  }));

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

  // Sort categories by critical rate
  const sortedByRisk = [...categoryData].sort((a, b) => b.criticalRate - a.criticalRate);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar basePath="/betfair-b" />
      </div>

      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="lg:hidden">
          <Header />
        </div>

        {/* Desktop header */}
        <header className="hidden border-b border-border bg-surface lg:block">
          <div className="flex h-12 items-center px-6">
            <h1 className="text-sm font-medium text-text">Analysis</h1>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-6">
          {/* Mobile title */}
          <div className="border-b border-border px-4 py-3 lg:hidden">
            <h1 className="text-lg font-semibold text-text">Analysis</h1>
            <p className="text-xs text-text-muted">Category performance</p>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          {/* Summary cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            {categoryData.map((cat) => (
              <div
                key={cat.categoryId}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <p className="mb-1 text-xs text-text-muted">{cat.shortName}</p>
                <p className="text-2xl font-bold text-text">{cat.total}</p>
                <div className="mt-2 flex items-center gap-1">
                  {cat.criticalRate > 15 ? (
                    <TrendingUp size={12} className="text-critical" />
                  ) : (
                    <TrendingDown size={12} className="text-opportunity" />
                  )}
                  <span className={`text-xs ${cat.criticalRate > 15 ? 'text-critical' : 'text-opportunity'}`}>
                    {cat.criticalRate}% critical
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            {/* Stacked bar chart - horizontal layout */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h2 className="mb-4 text-sm font-medium text-text">Classification by Category</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis type="number" tick={{ fill: colors.textMuted, fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="shortName"
                      tick={{ fill: colors.text, fontSize: 12 }}
                      width={90}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#141414' : '#FFFFFF',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="critical" stackId="a" fill={colors.critical} name="Critical" />
                    <Bar dataKey="warning" stackId="a" fill={colors.warning} name="Warning" />
                    <Bar dataKey="opportunity" stackId="a" fill={colors.opportunity} name="Opportunity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar chart */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h2 className="mb-4 text-sm font-medium text-text">Category Comparison</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={colors.border} />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fill: colors.textMuted, fontSize: 10 }}
                    />
                    <Radar
                      name="Critical"
                      dataKey="critical"
                      stroke={colors.critical}
                      fill={colors.critical}
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Warning"
                      dataKey="warning"
                      stroke={colors.warning}
                      fill={colors.warning}
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Opportunity"
                      dataKey="opportunity"
                      stroke={colors.opportunity}
                      fill={colors.opportunity}
                      fillOpacity={0.3}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#141414' : '#FFFFFF',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Risk ranking */}
          <div className="mb-6 rounded-xl border border-border bg-surface">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-medium text-text">Risk Ranking by Category</h2>
              <p className="text-xs text-text-muted">Sorted by critical rate</p>
            </div>
            <div className="divide-y divide-border">
              {sortedByRisk.map((cat, i) => (
                <div key={cat.categoryId} className="flex items-center gap-4 p-4">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    i === 0 ? 'bg-critical/10 text-critical' :
                    i === 1 ? 'bg-warning/10 text-warning' :
                    'bg-border text-text-muted'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">{cat.name}</p>
                    <p className="text-xs text-text-muted">{cat.total} records</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-critical">{cat.critical}</p>
                      <p className="text-xs text-text-muted">critical</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-warning">{cat.warning}</p>
                      <p className="text-xs text-text-muted">warning</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-opportunity">{cat.opportunity}</p>
                      <p className="text-xs text-text-muted">oppty</p>
                    </div>
                    <div className="w-32">
                      <div className="h-2 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-critical"
                          style={{ width: `${cat.criticalRate}%` }}
                        />
                      </div>
                      <p className="mt-1 text-right text-xs text-text-muted">{cat.criticalRate}% critical</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category detail cards */}
          <div className="grid gap-4 lg:grid-cols-2">
            {categoryData.map((cat) => {
              const isExpanded = expandedCategory === cat.categoryId;
              const topTriggers = getTopTriggersForCategory(cat.categoryId);
              const categoryRecords = getRecordsByCategory(cat.categoryId);
              const criticalRecords = categoryRecords.filter(r => r.classification === 'CRITICAL').slice(0, 3);

              return (
                <div
                  key={cat.categoryId}
                  className="rounded-xl border border-border bg-surface"
                >
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.categoryId)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-text">{cat.name}</h3>
                      <p className="text-xs text-text-muted">{cat.total} records</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-3">
                        <span className="text-xs">
                          <span className="font-medium text-critical">{cat.critical}</span>
                          <span className="text-text-muted"> crit</span>
                        </span>
                        <span className="text-xs">
                          <span className="font-medium text-warning">{cat.warning}</span>
                          <span className="text-text-muted"> warn</span>
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-text-muted" />
                      ) : (
                        <ChevronDown size={16} className="text-text-muted" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border p-4">
                      {/* Top triggers */}
                      {topTriggers.length > 0 && (
                        <div className="mb-4">
                          <p className="mb-2 text-xs font-medium text-text-muted">Top Triggers</p>
                          <div className="flex flex-wrap gap-2">
                            {topTriggers.map(([trigger, count]) => (
                              <span
                                key={trigger}
                                className="rounded-full border border-border px-2 py-1 text-xs text-text-muted"
                              >
                                {trigger} ({count})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Critical records */}
                      {criticalRecords.length > 0 && (
                        <div className="mb-4">
                          <p className="mb-2 text-xs font-medium text-text-muted">Critical Records</p>
                          <div className="space-y-2">
                            {criticalRecords.map((record) => (
                              <Link
                                key={record.id}
                                href={`/betfair-b/detail/${record.id}`}
                                className="block rounded-lg border border-border p-3 transition-colors hover:bg-border/30"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="line-clamp-1 text-sm text-text">{record.question_text}</p>
                                  <ClassificationBadge classification={record.classification} size="sm" />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/betfair-b/list?category=${cat.categoryId}`}
                        className="text-xs text-text-muted hover:text-text"
                      >
                        View all {cat.name} records →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </main>

        <div className="hidden lg:block">
          <Footer />
        </div>

        {/* Mobile bottom navigation */}
        <div className="lg:hidden">
          <Navigation basePath="/betfair-b" />
        </div>
      </div>
    </div>
  );
}
