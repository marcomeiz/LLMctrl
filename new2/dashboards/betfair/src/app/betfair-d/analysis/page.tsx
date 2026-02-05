'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { getSummary, getRecordsByCategory, CATEGORY_NAMES, CategoryId, records } from '@/lib/data';

export default function BetfairDAnalysisPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const summary = getSummary();

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
    surface: theme === 'dark' ? '#141414' : '#FFFFFF',
  };

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
    healthScore: data.total > 0 ? 100 - Math.round((data.critical / data.total) * 100) : 100,
  }));

  // Sort by critical rate
  const sortedCategories = [...categoryData].sort((a, b) => b.criticalRate - a.criticalRate);

  // Pie data
  const pieData = [
    { name: 'Critical', value: summary.critical, color: colors.critical },
    { name: 'Warning', value: summary.warning, color: colors.warning },
    { name: 'Opportunity', value: summary.opportunity, color: colors.opportunity },
  ];

  // Trigger stats
  const triggerData = summary.topTriggers.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 lg:pb-6">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          {/* Header */}
          <div className="mb-6">
            <Link href="/betfair-d" className="mb-2 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text">
              ← Back to Summary
            </Link>
            <h1 className="text-xl font-semibold text-text">Detailed Analysis</h1>
            <p className="text-sm text-text-muted">Category breakdown and insights</p>
          </div>

          {/* Distribution Overview */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {/* Pie Chart */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-4 text-sm font-medium text-text">Overall Distribution</h2>
              <div className="flex items-center gap-4">
                <div className="h-32 w-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-text">{item.name}</span>
                      <span className="text-sm font-medium text-text">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-4 text-sm font-medium text-text">Key Metrics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Total Analyzed</span>
                    <span className="font-medium text-text">{summary.total}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Brand Mention Rate</span>
                    <span className="font-medium text-text">
                      {Math.round((records.filter(r => r.mention).length / summary.total) * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Avg Triggers/Response</span>
                    <span className="font-medium text-text">
                      {(records.reduce((acc, r) => acc + r.triggers_detected.length, 0) / summary.total).toFixed(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Health Score</span>
                    <span className="font-medium text-opportunity">
                      {100 - Math.round((summary.critical / summary.total) * 100)}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Chart */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-medium text-text">Category Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" tick={{ fill: colors.textMuted, fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    tick={{ fill: colors.text, fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.surface,
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

          {/* Category Cards */}
          <div className="mb-6">
            <h2 className="mb-4 text-sm font-medium text-text">Category Performance</h2>
            <div className="space-y-3">
              {sortedCategories.map((cat, i) => {
                const isWorst = i === 0 && cat.criticalRate > 15;
                const isBest = i === sortedCategories.length - 1;
                return (
                  <Link
                    key={cat.categoryId}
                    href={`/betfair-d/list?category=${cat.categoryId}`}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition-colors hover:border-text-muted/30 ${
                      isWorst ? 'border-critical/30 bg-critical/5' :
                      isBest ? 'border-opportunity/30 bg-opportunity/5' :
                      'border-border bg-surface'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text">{cat.name}</span>
                        {isWorst && (
                          <span className="flex items-center gap-1 text-xs text-critical">
                            <TrendingUp size={12} /> Highest Risk
                          </span>
                        )}
                        {isBest && (
                          <span className="flex items-center gap-1 text-xs text-opportunity">
                            <TrendingDown size={12} /> Best
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted">{cat.total} records</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-critical">{cat.critical}</p>
                        <p className="text-xs text-text-muted">critical</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-warning">{cat.warning}</p>
                        <p className="text-xs text-text-muted">warning</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-opportunity">{cat.opportunity}</p>
                        <p className="text-xs text-text-muted">oppty</p>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <p className={`text-lg font-bold ${cat.criticalRate > 15 ? 'text-critical' : 'text-text'}`}>
                        {cat.criticalRate}%
                      </p>
                      <p className="text-xs text-text-muted">critical</p>
                    </div>
                    <ArrowRight size={14} className="text-text-muted" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Top Triggers */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-medium text-text">Top Detection Triggers</h2>
            <div className="space-y-3">
              {triggerData.map(([trigger, count], i) => {
                const pct = Math.round((count / summary.total) * 100);
                return (
                  <div key={trigger}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-text-muted">{i + 1}.</span>
                        <span className="text-text">{trigger}</span>
                      </div>
                      <span className="text-text-muted">{count} ({pct}%)</span>
                    </div>
                    <div className="mt-1 ml-7 h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-text-muted/50"
                        style={{ width: `${Math.min(pct * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <div className="hidden lg:block">
        <Footer />
      </div>

      <div className="lg:hidden">
        <Navigation basePath="/betfair-d" />
      </div>
    </div>
  );
}
