'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, AlertCircle, TrendingUp, Shield, Eye, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { getSummary, getRecordsByClassification, CATEGORY_NAMES, CategoryId, records } from '@/lib/data';

export default function BetfairDDashboard() {
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

  // Calculate key metrics
  const total = summary.total;
  const criticalPct = Math.round((summary.critical / total) * 100);
  const healthScore = 100 - criticalPct;
  const mentionRate = Math.round((records.filter(r => r.mention).length / total) * 100);

  // Find worst category
  const categoryStats = Object.entries(summary.byCategory).map(([catId, data]) => ({
    name: CATEGORY_NAMES[Number(catId) as CategoryId],
    shortName: CATEGORY_NAMES[Number(catId) as CategoryId].split(' ')[0],
    criticalRate: data.total > 0 ? Math.round((data.critical / data.total) * 100) : 0,
    total: data.total,
    critical: data.critical,
  }));
  const worstCategory = categoryStats.sort((a, b) => b.criticalRate - a.criticalRate)[0];
  const bestCategory = categoryStats.sort((a, b) => a.criticalRate - b.criticalRate)[0];

  // Status determination
  const status = healthScore >= 80 ? 'GOOD' : healthScore >= 60 ? 'MODERATE' : 'ATTENTION';
  const statusColor = status === 'GOOD' ? 'text-opportunity' : status === 'MODERATE' ? 'text-warning' : 'text-critical';
  const statusBg = status === 'GOOD' ? 'bg-opportunity/10' : status === 'MODERATE' ? 'bg-warning/10' : 'bg-critical/10';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 lg:pb-6">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          {/* Executive Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <Image
                src="/logos/betfair-seeklogo.png"
                alt="Betfair"
                width={120}
                height={30}
                className={`h-8 w-auto ${theme === 'dark' ? 'invert' : ''}`}
              />
            </div>
            <h1 className="text-2xl font-semibold text-text">Brand Visibility Report</h1>
            <p className="mt-1 text-sm text-text-muted">Executive Summary · {total} LLM responses analyzed</p>
          </div>

          {/* Status Card - Hero */}
          <div className={`mb-6 rounded-2xl border border-border ${statusBg} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Overall Status</p>
                <p className={`text-3xl font-bold ${statusColor}`}>{status}</p>
                <p className="mt-1 text-sm text-text-muted">
                  Health Score: {healthScore}/100
                </p>
              </div>
              <div className={`flex h-20 w-20 items-center justify-center rounded-full ${statusBg} border-4 ${status === 'GOOD' ? 'border-opportunity' : status === 'MODERATE' ? 'border-warning' : 'border-critical'}`}>
                <span className={`text-3xl font-bold ${statusColor}`}>{healthScore}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-text-muted">
                <AlertCircle size={16} />
                <span className="text-xs">Critical Issues</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-critical">{summary.critical}</p>
              <p className="text-xs text-text-muted">{criticalPct}% of total</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-text-muted">
                <Eye size={16} />
                <span className="text-xs">Brand Mentions</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-text">{mentionRate}%</p>
              <p className="text-xs text-text-muted">mention rate</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-text-muted">
                <TrendingUp size={16} />
                <span className="text-xs">Opportunities</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-opportunity">{summary.opportunity}</p>
              <p className="text-xs text-text-muted">positive responses</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-text-muted">
                <Shield size={16} />
                <span className="text-xs">Warnings</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-warning">{summary.warning}</p>
              <p className="text-xs text-text-muted">need monitoring</p>
            </div>
          </div>

          {/* Key Insights */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-text">
              <Target size={16} />
              Key Insights
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-critical/5 p-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-critical" />
                <div>
                  <p className="text-sm font-medium text-text">Highest Risk Area</p>
                  <p className="text-sm text-text-muted">
                    <span className="font-medium">{worstCategory.shortName}</span> category has {worstCategory.criticalRate}% critical rate ({worstCategory.critical} issues)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-opportunity/5 p-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-opportunity" />
                <div>
                  <p className="text-sm font-medium text-text">Best Performing</p>
                  <p className="text-sm text-text-muted">
                    <span className="font-medium">{bestCategory.shortName}</span> category performing well with only {bestCategory.criticalRate}% critical
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-border/50 p-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text">Top Detection Trigger</p>
                  <p className="text-sm text-text-muted">
                    &quot;{summary.topTriggers[0]?.[0]}&quot; detected {summary.topTriggers[0]?.[1]} times across responses
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Actions */}
          <div className="mb-6 rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-medium text-text">Priority Actions</h2>
              <Link
                href="/betfair-d/list?classification=CRITICAL"
                className="flex items-center gap-1 text-xs text-text-muted hover:text-text"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {criticalRecords.map((record, i) => (
                <Link
                  key={record.id}
                  href={`/betfair-d/detail/${record.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-border/30"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-critical/10 text-xs font-medium text-critical">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm text-text">{record.question_text}</p>
                    <p className="text-xs text-text-muted">{record.category_name}</p>
                  </div>
                  <ArrowRight size={14} className="shrink-0 text-text-muted" />
                </Link>
              ))}
            </div>
          </div>

          {/* Category Overview */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-text">Category Overview</h2>
              <Link
                href="/betfair-d/analysis"
                className="text-xs text-text-muted hover:text-text"
              >
                Full analysis →
              </Link>
            </div>
            <div className="space-y-3">
              {categoryStats.sort((a, b) => b.criticalRate - a.criticalRate).map((cat) => (
                <Link
                  key={cat.name}
                  href={`/betfair-d/list?category=${Object.entries(CATEGORY_NAMES).find(([, v]) => v === cat.name)?.[0]}`}
                  className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-border/30"
                >
                  <div className="w-24 text-sm text-text">{cat.shortName}</div>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-critical"
                        style={{ width: `${cat.criticalRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-medium text-text">{cat.criticalRate}%</span>
                    <span className="text-xs text-text-muted"> critical</span>
                  </div>
                </Link>
              ))}
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
