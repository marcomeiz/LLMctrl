import ukData from '../data/uk/betfair_enriched.json';
import spainData from '../data/spain/betfair_es_enriched.json';
import analysesData from '../data/interamplify_analyses.json';

export type Classification = 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';

export type CategoryId = 1 | 2 | 3 | 4 | 5;

export type MarketId = 'uk' | 'spain';

export interface TriggerDetail {
  trigger: string;
  type: 'CRITICAL' | 'WARNING';
  context: string;
  reason: string;
}

export interface Record {
  id: string;
  question_text: string;
  answer: string;
  category: CategoryId;
  category_name: string;
  mention: boolean;
  position: number | null;
  ranking_list: string[];
  triggers_detected: string[];
  triggers_detail: TriggerDetail[];
  citations: string[];
  classification: Classification;
  classification_reason: string;
  original_critical: string;
  answer_preview: string;
  is_false_positive?: boolean;
  review_reasoning?: string;
  original_classification?: Classification;
}

export interface MarketConfig {
  id: MarketId;
  name: string;
  flag: string;
  language: string;
}

export const MARKETS: { [key in MarketId]: MarketConfig } = {
  uk: {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    language: 'en',
  },
  spain: {
    id: 'spain',
    name: 'España',
    flag: '🇪🇸',
    language: 'es',
  },
};

export const CATEGORY_NAMES_BY_LANG: { [lang: string]: { [key in CategoryId]: string } } = {
  en: {
    1: 'Brand',
    2: 'General Comparison',
    3: 'By Competitor',
    4: 'Commercial',
    5: 'Transactional',
  },
  es: {
    1: 'Marca',
    2: 'Comparación General',
    3: 'Por Competidor',
    4: 'Comercial',
    5: 'Transaccional',
  },
};

// Backward compatible export (English by default)
export const CATEGORY_NAMES: { [key in CategoryId]: string } = CATEGORY_NAMES_BY_LANG.en;

export const CLASSIFICATION_COLORS: { [key in Classification]: { text: string; bg: string; dot: string } } = {
  CRITICAL: {
    text: 'text-critical',
    bg: 'bg-critical-bg',
    dot: 'bg-critical',
  },
  WARNING: {
    text: 'text-warning',
    bg: 'bg-warning-bg',
    dot: 'bg-warning',
  },
  OPPORTUNITY: {
    text: 'text-opportunity',
    bg: 'bg-opportunity-bg',
    dot: 'bg-opportunity',
  },
};

// Normalize data (convert id to string)
function normalizeRecords(data: unknown[]): Record[] {
  return (data as Array<Record & { id: number | string }>).map(r => ({
    ...r,
    id: String(r.id),
  })) as Record[];
}

// Store normalized records by market
const recordsByMarket: { [key in MarketId]: Record[] } = {
  uk: normalizeRecords(ukData as unknown[]),
  spain: normalizeRecords(spainData as unknown[]),
};

// Interamplify analyses
export const analyses: { [key: string]: string } = analysesData as { [key: string]: string };

// Get records for a market
export function getRecords(market: MarketId = 'uk'): Record[] {
  return recordsByMarket[market];
}

// For backward compatibility - default to UK
export const records: Record[] = recordsByMarket.uk;

// Categories array for iteration
export function getCategories(language: string = 'en'): { id: CategoryId; name: string }[] {
  const names = CATEGORY_NAMES_BY_LANG[language] || CATEGORY_NAMES_BY_LANG.en;
  return [
    { id: 1, name: names[1] },
    { id: 2, name: names[2] },
    { id: 3, name: names[3] },
    { id: 4, name: names[4] },
    { id: 5, name: names[5] },
  ];
}

export const categories = getCategories('en');

// Get records by classification
export function getRecordsByClassification(classification: Classification, market: MarketId = 'uk'): Record[] {
  return getRecords(market).filter(r => r.classification === classification);
}

// Get records by category
export function getRecordsByCategory(categoryId: CategoryId, market: MarketId = 'uk'): Record[] {
  return getRecords(market).filter(r => r.category === categoryId);
}

// Get record by ID
export function getRecordById(id: string, market: MarketId = 'uk'): Record | undefined {
  return getRecords(market).find(r => r.id === id);
}

// Get FULL answer by ID (not truncated)
export function getFullAnswer(id: string, market: MarketId = 'uk'): string {
  const record = getRecordById(id, market);
  return record?.answer || '';
}

// Get analysis for a record
export function getAnalysis(recordId: string): string | undefined {
  return analyses[recordId];
}

// Get summary statistics
export function getSummary(market: MarketId = 'uk') {
  const marketRecords = getRecords(market);
  const total = marketRecords.length;
  const critical = marketRecords.filter(r => r.classification === 'CRITICAL').length;
  const warning = marketRecords.filter(r => r.classification === 'WARNING').length;
  const opportunity = marketRecords.filter(r => r.classification === 'OPPORTUNITY').length;

  const byCategory: { [key in CategoryId]: { total: number; critical: number; warning: number; opportunity: number } } = {
    1: { total: 0, critical: 0, warning: 0, opportunity: 0 },
    2: { total: 0, critical: 0, warning: 0, opportunity: 0 },
    3: { total: 0, critical: 0, warning: 0, opportunity: 0 },
    4: { total: 0, critical: 0, warning: 0, opportunity: 0 },
    5: { total: 0, critical: 0, warning: 0, opportunity: 0 },
  };

  marketRecords.forEach(r => {
    byCategory[r.category].total++;
    if (r.classification === 'CRITICAL') byCategory[r.category].critical++;
    if (r.classification === 'WARNING') byCategory[r.category].warning++;
    if (r.classification === 'OPPORTUNITY') byCategory[r.category].opportunity++;
  });

  const triggerCounts: { [key: string]: number } = {};
  marketRecords.forEach(r => {
    r.triggers_detected.forEach(t => {
      triggerCounts[t] = (triggerCounts[t] || 0) + 1;
    });
  });

  const topTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    total,
    critical,
    warning,
    opportunity,
    byCategory,
    topTriggers,
  };
}

// Search records
export function searchRecords(
  query: string,
  filters: {
    classification?: Classification | 'ALL';
    category?: CategoryId | 'ALL';
  } = {},
  market: MarketId = 'uk'
): Record[] {
  let filtered = [...getRecords(market)];

  if (filters.classification && filters.classification !== 'ALL') {
    filtered = filtered.filter(r => r.classification === filters.classification);
  }

  if (filters.category && filters.category !== 'ALL') {
    filtered = filtered.filter(r => r.category === filters.category);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(r =>
      r.question_text.toLowerCase().includes(q) ||
      r.answer.toLowerCase().includes(q) ||
      r.triggers_detected.some(t => t.toLowerCase().includes(q))
    );
  }

  return filtered;
}
