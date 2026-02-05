'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ClassificationBadge from '@/components/ClassificationBadge';
import { getSummary, getRecordsByClassification, CATEGORY_NAMES, CategoryId } from '@/lib/data';

export default function BetfairCDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
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

  const colors = {
    critical: theme === 'dark' ? '#EF4444' : '#DC2626',
    warning: theme === 'dark' ? '#F59E0B' : '#D97706',
    opportunity: theme === 'dark' ? '#22C55E' : '#059669',
    text: theme === 'dark' ? '#FAFAFA' : '#0A0A0A',
    textMuted: theme === 'dark' ? '#A1A1A1' : '#717171',
    border: theme === 'dark' ? '#262626' : '#E5E5E5',
    surface: theme === 'dark' ? '#141414' : '#FFFFFF',
  };

  // Calculate percentages
  const total = summary.total;
  const criticalPct = Math.round((summary.critical / total) * 100);
  const warningPct = Math.round((summary.warning / total) * 100);
  const opportunityPct = Math.round((summary.opportunity / total) * 100);

  // Donut chart data
  const donutData = [
    { name: 'Critical', value: summary.critical, color: colors.critical },
    { name: 'Warning', value: summary.warning, color: colors.warning },
    { name: 'Opportunity', value: summary.opportunity, color: colors.opportunity },
  ];

  // Simulated trend data (based on categories)
  const trendData = Object.entries(summary.byCategory).map(([catId, data]) => ({
    name: CATEGORY_NAMES[Number(catId) as CategoryId].split(' ')[0],
    critical: data.critical,
    warning: data.warning,
    opportunity: data.opportunity,
  }));

  // Health score (inverse of critical rate)
  const healthScore = 100 - criticalPct;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <Header />

      <main className="flex-1 pb-20 lg:pb-6">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-text">Analytics Overview</h1>
            <p className="text-sm text-text-muted">Brand visibility performance metrics</p>
          </div>

          {/* Health Score - Hero KPI */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-sm text-text-muted">Brand Health Score</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${healthScore >= 70 ? 'text-opportunity' : healthScore >= 50 ? 'text-warning' : 'text-critical'}`}>
                    {healthScore}
                  </span>
                  <span className="text-2xl text-text-muted">/100</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {healthScore >= 70 ? (
                    <CheckCircle size={14} className="text-opportunity" />
                  ) : healthScore >= 50 ? (
                    <AlertTriangle size={14} className="text-warning" />
                  ) : (
                    <XCircle size={14} className="text-critical" />
                  )}
                  <span className="text-xs text-text-muted">
                    {healthScore >= 70 ? 'Good standing' : healthScore >= 50 ? 'Needs attention' : 'Critical issues'}
                  </span>
                </div>
              </div>
              <div className="h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <Link
              href="/betfair-c/list?classification=CRITICAL"
              className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-critical/50"
            >
              <div className="flex items-center justify-between">
                <XCircle size={18} className="text-critical" />
                <div className="flex items-center gap-1 text-critical">
                  <TrendingUp size={12} />
                  <span className="text-xs">{criticalPct}%</span>
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-text">{summary.critical}</p>
              <p className="text-xs text-text-muted">Critical</p>
            </Link>

            <Link
              href="/betfair-c/list?classification=WARNING"
              className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-warning/50"
            >
              <div className="flex items-center justify-between">
                <AlertTriangle size={18} className="text-warning" />
                <div className="flex items-center gap-1 text-warning">
                  <TrendingDown size={12} />
                  <span className="text-xs">{warningPct}%</span>
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-text">{summary.warning}</p>
              <p className="text-xs text-text-muted">Warning</p>
            </Link>

            <Link
              href="/betfair-c/list?classification=OPPORTUNITY"
              className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-opportunity/50"
            >
              <div className="flex items-center justify-between">
                <CheckCircle size={18} className="text-opportunity" />
                <div className="flex items-center gap-1 text-opportunity">
                  <TrendingUp size={12} />
                  <span className="text-xs">{opportunityPct}%</span>
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-text">{summary.opportunity}</p>
              <p className="text-xs text-text-muted">Opportunity</p>
            </Link>
          </div>

          {/* Category Breakdown Chart */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-text">Category Distribution</h2>
              <Link href="/betfair-c/analysis" className="text-xs text-text-muted hover:text-text">
                View details →
              </Link>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: colors.textMuted, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="critical"
                    stackId="1"
                    stroke={colors.critical}
                    fill={colors.critical}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="warning"
                    stackId="1"
                    stroke={colors.warning}
                    fill={colors.warning}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="opportunity"
                    stackId="1"
                    stroke={colors.opportunity}
                    fill={colors.opportunity}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Performance Grid */}
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-medium text-text">Category Performance</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {Object.entries(summary.byCategory).map(([catId, data]) => {
                const catCriticalPct = data.total > 0 ? Math.round((data.critical / data.total) * 100) : 0;
                return (
                  <Link
                    key={catId}
                    href={`/betfair-c/list?category=${catId}`}
                    className="rounded-lg border border-border bg-surface p-3 transition-colors hover:border-text-muted/30"
                  >
                    <p className="text-xs text-text-muted">{CATEGORY_NAMES[Number(catId) as CategoryId].split(' ')[0]}</p>
                    <p className="text-lg font-semibold text-text">{data.total}</p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-critical"
                        style={{ width: `${catCriticalPct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-text-muted">{catCriticalPct}% critical</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Critical Issues */}
          <div className="rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-medium text-text">Critical Issues</h2>
              <Link
                href="/betfair-c/list?classification=CRITICAL"
                className="flex items-center gap-1 text-xs text-text-muted hover:text-text"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {criticalRecords.map((record) => (
                <Link
                  key={record.id}
                  href={`/betfair-c/detail/${record.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-border/30"
                >
                  <XCircle size={14} className="shrink-0 text-critical" />
                  <p className="line-clamp-1 flex-1 text-sm text-text">{record.question_text}</p>
                  <span className="text-xs text-text-muted">{record.category_name.split(' ')[0]}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Triggers */}
          <div className="mt-6 rounded-xl border border-border bg-surface p-4">
            <h2 className="mb-3 text-sm font-medium text-text">Top Detection Triggers</h2>
            <div className="space-y-2">
              {summary.topTriggers.slice(0, 5).map(([trigger, count], i) => {
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={trigger} className="flex items-center gap-3">
                    <span className="w-4 text-xs text-text-muted">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text">{trigger}</span>
                        <span className="text-xs text-text-muted">{count} ({pct}%)</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-text-muted"
                          style={{ width: `${pct * 3}%` }}
                        />
                      </div>
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

      {/* Mobile bottom navigation */}
      <div className="lg:hidden">
        <Navigation basePath="/betfair-c" />
      </div>
    </div>
  );
}
