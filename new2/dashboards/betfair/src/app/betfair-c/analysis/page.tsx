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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { getSummary, getRecordsByCategory, CATEGORY_NAMES, CategoryId, records } from '@/lib/data';

export default function BetfairCAnalysisPage() {
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
    accent: theme === 'dark' ? '#3B82F6' : '#2563EB',
  };

  const SHORT_NAMES: { [key in CategoryId]: string } = {
    1: 'Brand',
    2: 'General',
    3: 'Competitor',
    4: 'Commercial',
    5: 'Transaction',
  };

  // Category data with metrics
  const categoryData = Object.entries(summary.byCategory).map(([catId, data]) => ({
    name: CATEGORY_NAMES[Number(catId) as CategoryId],
    shortName: SHORT_NAMES[Number(catId) as CategoryId],
    categoryId: Number(catId) as CategoryId,
    total: data.total,
    critical: data.critical,
    warning: data.warning,
    opportunity: data.opportunity,
    criticalRate: data.total > 0 ? Math.round((data.critical / data.total) * 100) : 0,
    healthScore: data.total > 0 ? Math.round(((data.total - data.critical) / data.total) * 100) : 100,
  }));

  // Radar data
  const radarData = categoryData.map(cat => ({
    category: cat.shortName,
    critical: cat.critical,
    warning: cat.warning,
    opportunity: cat.opportunity,
  }));

  // Pie chart for overall distribution
  const pieData = [
    { name: 'Critical', value: summary.critical, color: colors.critical },
    { name: 'Warning', value: summary.warning, color: colors.warning },
    { name: 'Opportunity', value: summary.opportunity, color: colors.opportunity },
  ];

  // Trigger analysis
  const triggerData = summary.topTriggers.slice(0, 8).map(([trigger, count]) => ({
    name: trigger.length > 12 ? trigger.slice(0, 12) + '...' : trigger,
    fullName: trigger,
    count,
    pct: Math.round((count / summary.total) * 100),
  }));

  // Get mention stats
  const mentionStats = {
    mentioned: records.filter(r => r.mention).length,
    notMentioned: records.filter(r => !r.mention).length,
  };

  // Best and worst categories
  const sortedByHealth = [...categoryData].sort((a, b) => b.healthScore - a.healthScore);
  const bestCategory = sortedByHealth[0];
  const worstCategory = sortedByHealth[sortedByHealth.length - 1];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 lg:pb-6">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-text">Deep Analysis</h1>
            <p className="text-sm text-text-muted">Advanced metrics and insights</p>
          </div>

          {/* Key insights */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-text-muted" />
                <span className="text-xs text-text-muted">Best Category</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-text">{bestCategory.shortName}</p>
              <p className="text-xs text-opportunity">{bestCategory.healthScore}% healthy</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-text-muted" />
                <span className="text-xs text-text-muted">Needs Work</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-text">{worstCategory.shortName}</p>
              <p className="text-xs text-critical">{worstCategory.criticalRate}% critical</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-text-muted" />
                <span className="text-xs text-text-muted">Brand Mentions</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-text">{mentionStats.mentioned}</p>
              <p className="text-xs text-text-muted">of {summary.total} responses</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} className="text-text-muted" />
                <span className="text-xs text-text-muted">Top Trigger</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-text">{triggerData[0]?.name || 'N/A'}</p>
              <p className="text-xs text-text-muted">{triggerData[0]?.count || 0} detections</p>
            </div>
          </div>

          {/* Charts grid */}
          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            {/* Distribution pie */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h2 className="mb-4 text-sm font-medium text-text">Overall Distribution</h2>
              <div className="flex items-center gap-4">
                <div className="h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
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
                <div className="flex-1 space-y-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-text">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-text">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category radar */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h2 className="mb-4 text-sm font-medium text-text">Category Comparison</h2>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={colors.border} />
                    <PolarAngleAxis dataKey="category" tick={{ fill: colors.textMuted, fontSize: 10 }} />
                    <Radar
                      name="Critical"
                      dataKey="critical"
                      stroke={colors.critical}
                      fill={colors.critical}
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
                        backgroundColor: colors.surface,
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

          {/* Category breakdown */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-4">
            <h2 className="mb-4 text-sm font-medium text-text">Category Breakdown</h2>
            <div className="h-56">
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

          {/* Trigger analysis */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-4">
            <h2 className="mb-4 text-sm font-medium text-text">Trigger Analysis</h2>
            <div className="space-y-3">
              {triggerData.map((trigger, i) => (
                <div key={trigger.fullName}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-xs text-text-muted">{i + 1}.</span>
                      <span className="text-text" title={trigger.fullName}>{trigger.name}</span>
                    </div>
                    <span className="text-text-muted">{trigger.count} ({trigger.pct}%)</span>
                  </div>
                  <div className="mt-1 ml-7 h-2 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-text-muted/50"
                      style={{ width: `${trigger.pct * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryData.map((cat) => {
              const categoryRecords = getRecordsByCategory(cat.categoryId);
              const topTriggers: [string, number][] = [];
              const triggerCounts: { [key: string]: number } = {};
              categoryRecords.forEach(r => {
                r.triggers_detected.forEach(t => {
                  triggerCounts[t] = (triggerCounts[t] || 0) + 1;
                });
              });
              Object.entries(triggerCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .forEach(([t, c]) => topTriggers.push([t, c]));

              return (
                <Link
                  key={cat.categoryId}
                  href={`/betfair-c/list?category=${cat.categoryId}`}
                  className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-text-muted/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">{cat.name}</p>
                      <p className="text-xs text-text-muted">{cat.total} records</p>
                    </div>
                    <span className={`text-xs font-medium ${cat.healthScore >= 70 ? 'text-opportunity' : cat.healthScore >= 50 ? 'text-warning' : 'text-critical'}`}>
                      {cat.healthScore}%
                    </span>
                  </div>
                  <div className="mt-3 flex gap-3 text-xs">
                    <span className="text-critical">{cat.critical} crit</span>
                    <span className="text-warning">{cat.warning} warn</span>
                    <span className="text-opportunity">{cat.opportunity} opp</span>
                  </div>
                  {topTriggers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {topTriggers.map(([trigger]) => (
                        <span
                          key={trigger}
                          className="rounded bg-border px-2 py-0.5 text-xs text-text-muted"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <div className="hidden lg:block">
        <Footer />
      </div>

      <div className="lg:hidden">
        <Navigation basePath="/betfair-c" />
      </div>
    </div>
  );
}
