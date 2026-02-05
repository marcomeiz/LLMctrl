'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import RecordCard from '@/components/RecordCard';
import { searchRecords, Classification, CategoryId, CATEGORY_NAMES } from '@/lib/data';

const CLASSIFICATIONS: (Classification | 'ALL')[] = ['ALL', 'CRITICAL', 'WARNING', 'OPPORTUNITY'];
const CATEGORIES: (CategoryId | 'ALL')[] = ['ALL', 1, 2, 3, 4, 5];

export default function ListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [query, setQuery] = useState('');
  const [classification, setClassification] = useState<Classification | 'ALL'>(
    (searchParams.get('classification') as Classification) || 'ALL'
  );
  const [category, setCategory] = useState<CategoryId | 'ALL'>('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Update classification from URL params
  useEffect(() => {
    const param = searchParams.get('classification') as Classification | null;
    if (param && CLASSIFICATIONS.includes(param)) {
      setClassification(param);
    }
  }, [searchParams]);

  const filteredRecords = useMemo(() => {
    return searchRecords(query, { classification, category });
  }, [query, classification, category]);

  const stats = useMemo(() => {
    const all = searchRecords('', {});
    const critical = all.filter(r => r.classification === 'CRITICAL').length;
    const warning = all.filter(r => r.classification === 'WARNING').length;
    const opportunity = all.filter(r => r.classification === 'OPPORTUNITY').length;
    return { total: all.length, critical, warning, opportunity };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Desktop navigation */}
      <div className="hidden border-b border-border bg-surface sm:block">
        <Navigation />
      </div>

      <main className="flex-1 pb-20 sm:pb-6">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {/* Page title */}
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-text sm:text-xl">Records List</h1>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by question, answer or trigger..."
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-text-muted"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mb-4 space-y-3">
            {/* Classification filters */}
            <div className="flex flex-wrap gap-2">
              {CLASSIFICATIONS.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setClassification(cls)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    classification === cls
                      ? cls === 'CRITICAL'
                        ? 'border-critical bg-critical-bg text-critical'
                        : cls === 'WARNING'
                        ? 'border-warning bg-warning-bg text-warning'
                        : cls === 'OPPORTUNITY'
                        ? 'border-opportunity bg-opportunity-bg text-opportunity'
                        : 'border-text bg-text text-background'
                      : 'border-border bg-surface text-text-muted hover:border-text-muted hover:text-text'
                  }`}
                >
                  {cls === 'ALL' ? 'All' : cls}
                  {cls === 'ALL' && <span className="ml-1">({stats.total})</span>}
                  {cls === 'CRITICAL' && <span className="ml-1">({stats.critical})</span>}
                  {cls === 'WARNING' && <span className="ml-1">({stats.warning})</span>}
                  {cls === 'OPPORTUNITY' && <span className="ml-1">({stats.opportunity})</span>}
                </button>
              ))}
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    category === cat
                      ? 'border-text bg-text text-background'
                      : 'border-border bg-surface text-text-muted hover:border-text-muted hover:text-text'
                  }`}
                >
                  {cat === 'ALL' ? 'All categories' : CATEGORY_NAMES[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4 text-xs text-text-muted">
            {filteredRecords.length} records
            {(classification !== 'ALL' || category !== 'ALL' || query) && ' (filtered)'}
          </div>

          {/* Records list */}
          <div className="space-y-3">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))
            ) : (
              <div className="rounded-lg border border-border bg-surface p-8 text-center">
                <p className="text-sm text-text-muted">
                  No records match the filters
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile navigation */}
      <div className="sm:hidden">
        <Navigation />
      </div>
    </div>
  );
}
