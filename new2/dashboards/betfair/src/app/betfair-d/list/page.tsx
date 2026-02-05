'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ArrowRight, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ClassificationBadge from '@/components/ClassificationBadge';
import { searchRecords, Classification, CategoryId, CATEGORY_NAMES } from '@/lib/data';

const CLASSIFICATIONS: (Classification | 'ALL')[] = ['ALL', 'CRITICAL', 'WARNING', 'OPPORTUNITY'];
const CATEGORIES: (CategoryId | 'ALL')[] = ['ALL', 1, 2, 3, 4, 5];

export default function BetfairDListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [query, setQuery] = useState('');
  const [classification, setClassification] = useState<Classification | 'ALL'>(
    (searchParams.get('classification') as Classification) || 'ALL'
  );
  const [category, setCategory] = useState<CategoryId | 'ALL'>(
    searchParams.get('category') ? Number(searchParams.get('category')) as CategoryId : 'ALL'
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const classParam = searchParams.get('classification') as Classification | null;
    if (classParam && CLASSIFICATIONS.includes(classParam)) {
      setClassification(classParam);
    }
    const catParam = searchParams.get('category');
    if (catParam) {
      const catId = Number(catParam) as CategoryId;
      if (CATEGORIES.includes(catId)) {
        setCategory(catId);
      }
    }
  }, [searchParams]);

  const filteredRecords = useMemo(() => {
    return searchRecords(query, { classification, category });
  }, [query, classification, category]);

  const stats = useMemo(() => {
    const all = searchRecords('', {});
    return {
      total: all.length,
      critical: all.filter(r => r.classification === 'CRITICAL').length,
      warning: all.filter(r => r.classification === 'WARNING').length,
      opportunity: all.filter(r => r.classification === 'OPPORTUNITY').length,
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const getTitle = () => {
    if (classification === 'CRITICAL') return 'Critical Issues';
    if (classification === 'WARNING') return 'Warnings';
    if (classification === 'OPPORTUNITY') return 'Opportunities';
    if (category !== 'ALL') return CATEGORY_NAMES[category];
    return 'All Records';
  };

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
            <h1 className="text-xl font-semibold text-text">{getTitle()}</h1>
            <p className="text-sm text-text-muted">{filteredRecords.length} records</p>
          </div>

          {/* Quick filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            {CLASSIFICATIONS.map((cls) => (
              <button
                key={cls}
                onClick={() => setClassification(cls)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  classification === cls
                    ? cls === 'CRITICAL'
                      ? 'border-critical bg-critical/10 text-critical'
                      : cls === 'WARNING'
                      ? 'border-warning bg-warning/10 text-warning'
                      : cls === 'OPPORTUNITY'
                      ? 'border-opportunity bg-opportunity/10 text-opportunity'
                      : 'border-text bg-text text-background'
                    : 'border-border text-text-muted hover:border-text-muted'
                }`}
              >
                {cls === 'ALL' ? 'All' : cls.charAt(0) + cls.slice(1).toLowerCase()}
                <span className="ml-1 opacity-60">
                  ({cls === 'ALL' ? stats.total : stats[cls.toLowerCase() as keyof typeof stats]})
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-11 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-text-muted"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="shrink-0 text-xs text-text-muted">Category:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-lg border px-3 py-1 text-xs transition-colors ${
                  category === cat
                    ? 'border-text bg-text text-background'
                    : 'border-border text-text-muted hover:border-text-muted'
                }`}
              >
                {cat === 'ALL' ? 'All' : CATEGORY_NAMES[cat].split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Records */}
          <div className="space-y-2">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <Link
                  key={record.id}
                  href={`/betfair-d/detail/${record.id}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-text-muted/30"
                >
                  <div className={`h-2 w-2 shrink-0 rounded-full ${
                    record.classification === 'CRITICAL' ? 'bg-critical' :
                    record.classification === 'WARNING' ? 'bg-warning' : 'bg-opportunity'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm text-text">{record.question_text}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                      <span>{record.category_name.split(' ')[0]}</span>
                      {record.triggers_detected.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{record.triggers_detected.length} triggers</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ClassificationBadge classification={record.classification} size="sm" />
                  <ArrowRight size={14} className="shrink-0 text-text-muted" />
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-sm text-text-muted">No records match your filters</p>
                <button
                  onClick={() => {
                    setClassification('ALL');
                    setCategory('ALL');
                    setQuery('');
                  }}
                  className="mt-2 text-sm text-text hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
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
