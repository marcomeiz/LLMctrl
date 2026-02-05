'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Filter, XCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ClassificationBadge from '@/components/ClassificationBadge';
import { searchRecords, Classification, CategoryId, CATEGORY_NAMES } from '@/lib/data';

const CLASSIFICATIONS: (Classification | 'ALL')[] = ['ALL', 'CRITICAL', 'WARNING', 'OPPORTUNITY'];
const CATEGORIES: (CategoryId | 'ALL')[] = ['ALL', 1, 2, 3, 4, 5];

export default function BetfairCListPage() {
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
  const [showFilters, setShowFilters] = useState(false);

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

  // Group records by classification for analytics view
  const groupedRecords = useMemo(() => {
    const groups: { [key: string]: typeof filteredRecords } = {
      CRITICAL: [],
      WARNING: [],
      OPPORTUNITY: [],
    };
    filteredRecords.forEach(r => {
      groups[r.classification].push(r);
    });
    return groups;
  }, [filteredRecords]);

  if (!isAuthenticated) {
    return null;
  }

  const getClassificationIcon = (cls: Classification) => {
    switch (cls) {
      case 'CRITICAL':
        return <XCircle size={14} className="text-critical" />;
      case 'WARNING':
        return <AlertTriangle size={14} className="text-warning" />;
      case 'OPPORTUNITY':
        return <CheckCircle size={14} className="text-opportunity" />;
    }
  };

  const hasActiveFilters = classification !== 'ALL' || category !== 'ALL' || query !== '';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 lg:pb-6">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          {/* Page header with stats */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-text">Records</h1>
              <p className="text-sm text-text-muted">
                {filteredRecords.length} of {stats.total} records
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                hasActiveFilters
                  ? 'border-text bg-text text-background'
                  : 'border-border text-text-muted hover:border-text-muted'
              }`}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Search and filters */}
          <div className={`mb-4 space-y-3 ${showFilters ? '' : 'hidden sm:block'}`}>
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-9 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-text-muted"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
              {CLASSIFICATIONS.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setClassification(cls)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    classification === cls
                      ? 'border-text bg-text text-background'
                      : 'border-border text-text-muted hover:border-text-muted'
                  }`}
                >
                  {cls !== 'ALL' && getClassificationIcon(cls as Classification)}
                  {cls === 'ALL' ? `All (${stats.total})` : `${cls.charAt(0)}${cls.slice(1).toLowerCase()} (${stats[cls.toLowerCase() as keyof typeof stats]})`}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    category === cat
                      ? 'border-text bg-text text-background'
                      : 'border-border text-text-muted hover:border-text-muted'
                  }`}
                >
                  {cat === 'ALL' ? 'All Categories' : CATEGORY_NAMES[cat].split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Classification summary - always visible */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
              <XCircle size={14} className="text-critical" />
              <span className="text-sm font-medium text-text">{groupedRecords.CRITICAL.length}</span>
              <span className="hidden text-xs text-text-muted sm:inline">critical</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
              <AlertTriangle size={14} className="text-warning" />
              <span className="text-sm font-medium text-text">{groupedRecords.WARNING.length}</span>
              <span className="hidden text-xs text-text-muted sm:inline">warning</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
              <CheckCircle size={14} className="text-opportunity" />
              <span className="text-sm font-medium text-text">{groupedRecords.OPPORTUNITY.length}</span>
              <span className="hidden text-xs text-text-muted sm:inline">opportunity</span>
            </div>
          </div>

          {/* Records list */}
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {filteredRecords.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/betfair-c/detail/${record.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-border/30"
                  >
                    {getClassificationIcon(record.classification)}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm text-text">{record.question_text}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted">{record.category_name.split(' ')[0]}</span>
                        {record.triggers_detected.length > 0 && (
                          <span className="text-xs text-text-muted">
                            · {record.triggers_detected.length} triggers
                          </span>
                        )}
                      </div>
                    </div>
                    <ClassificationBadge classification={record.classification} size="sm" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-text-muted">No records match the filters</p>
                <button
                  onClick={() => {
                    setClassification('ALL');
                    setCategory('ALL');
                    setQuery('');
                  }}
                  className="mt-2 text-sm text-text hover:underline"
                >
                  Clear filters
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
        <Navigation basePath="/betfair-c" />
      </div>
    </div>
  );
}
