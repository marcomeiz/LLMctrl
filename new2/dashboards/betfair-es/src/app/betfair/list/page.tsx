'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import RecordCard from '@/components/RecordCard';
import { searchRecords, categories, Classification, CategoryId } from '@/lib/data';

const CLASSIFICATIONS: (Classification | 'ALL')[] = ['ALL', 'CRITICAL', 'WARNING', 'OPPORTUNITY'];
const CATEGORIES: (CategoryId | 'ALL')[] = ['ALL', 1, 2, 3, 4, 5, 6];

export default function BetfairListPage() {
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

  // Update classification from URL params
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
        <Navigation basePath="/betfair" />
      </div>

      <main className="flex-1 pb-20 sm:pb-6">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {/* Page title */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text sm:text-xl">Records List</h1>
              <span className="text-lg">🇪🇸</span>
            </div>
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
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                    cls === 'CRITICAL'
                      ? classification === cls
                        ? 'border-red-500 bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20'
                        : 'border-red-500/50 bg-red-500/10 text-red-400/60 hover:border-red-500/70 hover:text-red-400/80'
                      : cls === 'WARNING'
                      ? classification === cls
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-lg shadow-amber-400/20'
                        : 'border-amber-400/50 bg-amber-400/10 text-amber-300/60 hover:border-amber-400/70 hover:text-amber-300/80'
                      : cls === 'OPPORTUNITY'
                      ? classification === cls
                        ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300 shadow-lg shadow-emerald-400/20'
                        : 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300/60 hover:border-emerald-400/70 hover:text-emerald-300/80'
                      : classification === cls
                      ? 'border-sky-400 bg-sky-400/20 text-sky-300 shadow-lg shadow-sky-400/20'
                      : 'border-sky-400/50 bg-sky-400/10 text-sky-300/60 hover:border-sky-400/70 hover:text-sky-300/80'
                  }`}
                >
                  {cls === 'ALL' ? 'All' : cls}
                  {cls === 'ALL' && <span className="ml-1.5 opacity-80">({stats.total})</span>}
                  {cls === 'CRITICAL' && <span className="ml-1.5 opacity-80">({stats.critical})</span>}
                  {cls === 'WARNING' && <span className="ml-1.5 opacity-80">({stats.warning})</span>}
                  {cls === 'OPPORTUNITY' && <span className="ml-1.5 opacity-80">({stats.opportunity})</span>}
                </button>
              ))}
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                    category === cat
                      ? 'border-sky-400 bg-sky-400/20 text-sky-300 shadow-lg shadow-sky-400/20'
                      : 'border-sky-400/50 bg-sky-400/10 text-sky-300/60 hover:border-sky-400/70 hover:text-sky-300/80'
                  }`}
                >
                  {cat === 'ALL' ? 'All Categories' : categories.find(c => c.id === cat)?.name}
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
                <RecordCard key={record.id} record={record} basePath="/betfair" />
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
        <Navigation basePath="/betfair" />
      </div>
    </div>
  );
}
