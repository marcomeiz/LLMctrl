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

export default function BydListPage() {
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
        <Navigation basePath="/byd" />
      </div>

      <main className="flex-1 pb-20 sm:pb-6">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {/* Page title */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text sm:text-xl">Records List</h1>
              <span className="text-lg">🇬🇧</span>
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
          <div className="mb-6 space-y-3">
            {/* Classification filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Status:</span>
              {CLASSIFICATIONS.map((cls) => {
                const isActive = classification === cls;
                const count = cls === 'ALL' ? stats.total
                  : cls === 'CRITICAL' ? stats.critical
                  : cls === 'WARNING' ? stats.warning
                  : stats.opportunity;

                return (
                  <button
                    key={cls}
                    onClick={() => setClassification(cls)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      isActive
                        ? cls === 'CRITICAL' ? 'bg-critical/15 text-critical'
                          : cls === 'WARNING' ? 'bg-warning/15 text-warning'
                          : cls === 'OPPORTUNITY' ? 'bg-opportunity/15 text-opportunity'
                          : 'bg-text text-background'
                        : 'bg-surface text-text-muted hover:bg-border hover:text-text'
                    }`}
                  >
                    {cls !== 'ALL' && (
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        cls === 'CRITICAL' ? 'bg-critical'
                        : cls === 'WARNING' ? 'bg-warning'
                        : 'bg-opportunity'
                      }`} />
                    )}
                    <span>{cls === 'ALL' ? 'All' : cls.charAt(0) + cls.slice(1).toLowerCase()}</span>
                    <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-text-muted">Category:</span>
              {CATEGORIES.map((cat) => {
                const isActive = category === cat;
                const label = cat === 'ALL' ? 'All' : categories.find(c => c.id === cat)?.name;

                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-text text-background'
                        : 'bg-surface text-text-muted hover:bg-border hover:text-text'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
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
                <RecordCard key={record.id} record={record} basePath="/byd" />
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
        <Navigation basePath="/byd" />
      </div>
    </div>
  );
}
