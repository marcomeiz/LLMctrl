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
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import ClassificationBadge from '@/components/ClassificationBadge';
import { getSummary, getRecordsByClassification, CATEGORY_NAMES, CategoryId } from '@/lib/data';

export default function BetfairBDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const summary = getSummary();
  const criticalRecords = getRecordsByClassification('CRITICAL').slice(0, 3);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Colors for charts
  const colors = {
    critical: theme === 'dark' ? '#EF4444' : '#DC2626',
    warning: theme === 'dark' ? '#F59E0B' : '#D97706',
    opportunity: theme === 'dark' ? '#22C55E' : '#059669',
    text: theme === 'dark' ? '#FAFAFA' : '#0A0A0A',
    textMuted: theme === 'dark' ? '#A1A1A1' : '#717171',
    border: theme === 'dark' ? '#262626' : '#E5E5E5',
  };

  // Pie chart data
  const pieData = [
    { name: 'Critical', value: summary.critical, color: colors.critical },
    { name: 'Warning', value: summary.warning, color: colors.warning },
    { name: 'Opportunity', value: summary.opportunity, color: colors.opportunity },
  ];

  // Short names for chart labels
  const SHORT_NAMES: { [key in CategoryId]: string } = {
    1: 'Brand',
    2: 'General',
    3: 'Competitor',
    4: 'Commercial',
    5: 'Transaction',
  };

  // Category bar chart data
  const categoryData = Object.entries(summary.byCategory).map(([catId, data]) => ({
    name: SHORT_NAMES[Number(catId) as CategoryId],
    critical: data.critical,
    warning: data.warning,
    opportunity: data.opportunity,
  }));

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

        {/* Desktop header - minimal since sidebar has nav */}
        <header className="hidden border-b border-border bg-surface lg:block">
          <div className="flex h-12 items-center px-6">
            <h1 className="text-sm font-medium text-text">Dashboard Pro</h1>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-6">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            {/* Stats row - clickable, compact */}
            <div className="mb-4 grid grid-cols-3 gap-3">
              {/* Critical - clickable */}
              <Link
                href="/betfair-b/list?classification=CRITICAL"
                className="rounded-lg border border-border bg-surface p-3 text-center transition-colors hover:border-text-muted/30"
              >
                <p className="text-2xl font-bold text-critical sm:text-3xl">{summary.critical}</p>
                <p className="text-xs text-text-muted">Critical</p>
              </Link>

              {/* Warning - clickable */}
              <Link
                href="/betfair-b/list?classification=WARNING"
                className="rounded-lg border border-border bg-surface p-3 text-center transition-colors hover:border-text-muted/30"
              >
                <p className="text-2xl font-bold text-warning sm:text-3xl">{summary.warning}</p>
                <p className="text-xs text-text-muted">Warning</p>
              </Link>

              {/* Opportunity - clickable */}
              <Link
                href="/betfair-b/list?classification=OPPORTUNITY"
                className="rounded-lg border border-border bg-surface p-3 text-center transition-colors hover:border-text-muted/30"
              >
                <p className="text-2xl font-bold text-opportunity sm:text-3xl">{summary.opportunity}</p>
                <p className="text-xs text-text-muted">Opportunity</p>
              </Link>
            </div>

            {/* Charts row - side by side on desktop, stacked on mobile */}
            <div className="mb-4 grid gap-4 lg:grid-cols-2">
              {/* Pie chart */}
              <div className="rounded-lg border border-border bg-surface p-4">
                <h2 className="mb-2 text-xs font-medium text-text-muted">Distribution</h2>
                <div className="h-40 sm:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#141414' : '#FFFFFF',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category bar chart */}
              <div className="rounded-lg border border-border bg-surface p-4">
                <h2 className="mb-2 text-xs font-medium text-text-muted">By Category</h2>
                <div className="h-40 sm:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                      <XAxis type="number" tick={{ fill: colors.textMuted, fontSize: 10 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: colors.text, fontSize: 10 }}
                        width={70}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#141414' : '#FFFFFF',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="critical" stackId="a" fill={colors.critical} />
                      <Bar dataKey="warning" stackId="a" fill={colors.warning} />
                      <Bar dataKey="opportunity" stackId="a" fill={colors.opportunity} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Critical records - compact list */}
            <div className="mb-4 rounded-lg border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-xs font-medium text-text-muted">Latest Critical</h2>
                <Link
                  href="/betfair-b/list?classification=CRITICAL"
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-text"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {criticalRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/betfair-b/detail/${record.id}`}
                    className="block px-4 py-3 transition-colors hover:bg-border/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 flex-1 text-sm text-text">
                        {record.question_text}
                      </p>
                      <ClassificationBadge classification={record.classification} size="sm" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top triggers - compact */}
            <div className="rounded-lg border border-border bg-surface p-4">
              <h2 className="mb-3 text-xs font-medium text-text-muted">Top Triggers</h2>
              <div className="flex flex-wrap gap-2">
                {summary.topTriggers.slice(0, 6).map(([trigger, count]) => (
                  <span
                    key={trigger}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs"
                  >
                    <span className="text-text">{trigger}</span>
                    <span className="text-text-muted">({count})</span>
                  </span>
                ))}
              </div>
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
