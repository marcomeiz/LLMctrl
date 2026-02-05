'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import ClassificationBadge from '@/components/ClassificationBadge';
import TriggerPill from '@/components/TriggerPill';
import { searchRecords, Classification, CategoryId, CATEGORY_NAMES } from '@/lib/data';

const CLASSIFICATIONS: (Classification | 'ALL')[] = ['ALL', 'CRITICAL', 'WARNING', 'OPPORTUNITY'];
const CATEGORIES: (CategoryId | 'ALL')[] = ['ALL', 1, 2, 3, 4, 5];

export default function BetfairBListPage() {
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
          <div className="flex h-12 items-center justify-between px-6">
            <h1 className="text-sm font-medium text-text">Records</h1>
            <span className="text-xs text-text-muted">{filteredRecords.length} of {stats.total}</span>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-6">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            {/* Mobile title */}
            <div className="mb-4 lg:hidden">
              <h1 className="text-lg font-semibold text-text">Records</h1>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
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

            {/* Filters - compact */}
            <div className="mb-4 space-y-2">
              {/* Classification */}
              <div className="flex flex-wrap gap-2">
                {CLASSIFICATIONS.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setClassification(cls)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      classification === cls
                        ? cls === 'CRITICAL'
                          ? 'border-critical text-critical'
                          : cls === 'WARNING'
                          ? 'border-warning text-warning'
                          : cls === 'OPPORTUNITY'
                          ? 'border-opportunity text-opportunity'
                          : 'border-text bg-text text-background'
                        : 'border-border text-text-muted hover:border-text-muted'
                    }`}
                  >
                    {cls === 'ALL' ? `All (${stats.total})` : `${cls} (${stats[cls.toLowerCase() as keyof typeof stats]})`}
                  </button>
                ))}
              </div>

              {/* Category */}
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
                    {cat === 'ALL' ? 'All' : CATEGORY_NAMES[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count on mobile */}
            <div className="mb-2 text-xs text-text-muted lg:hidden">
              {filteredRecords.length} records {(classification !== 'ALL' || category !== 'ALL' || query) && '(filtered)'}
            </div>

            {/* Records list - compact table style */}
            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="divide-y divide-border">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <Link
                      key={record.id}
                      href={`/betfair-b/detail/${record.id}`}
                      className="block px-4 py-3 transition-colors hover:bg-border/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="line-clamp-1 text-sm text-text">{record.question_text}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-text-muted">{record.category_name}</span>
                            {record.triggers_detected.length > 0 && (
                              <span className="text-xs text-text-muted">
                                · {record.triggers_detected.length} triggers
                              </span>
                            )}
                          </div>
                        </div>
                        <ClassificationBadge classification={record.classification} size="sm" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-text-muted">No records match the filters</p>
                  </div>
                )}
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
