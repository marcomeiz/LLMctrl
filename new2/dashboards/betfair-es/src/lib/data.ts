/**
 * Data module for Betfair ES Dashboard
 * Adapted for new JSON format with psychological_impact inline
 */

import rawData from '../data/spain/betfair_es_evaluated.json';

export type Classification = 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';

export type CategoryId = 1 | 2 | 3 | 4 | 5 | 6;

export interface TriggerDetail {
  trigger: string;
  type: 'CRITICAL' | 'WARNING';
  context: string;
  reason: string;
}

export interface Record {
  id: string;
  question_text: string;
  question_text_en: string;  // English translation of the question
  answer: string;
  answer_preview: string;
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
  psychological_impact: string;
}

// Category names in Spanish
export const CATEGORY_NAMES: { [key in CategoryId]: string } = {
  1: 'Marca',
  2: 'Comparación General',
  3: 'Por Competidor',
  4: 'Comercial',
  5: 'Transaccionales',
  6: 'Transaccionales',
};

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

// Transform raw data to expected format
function normalizeRecords(data: unknown[]): Record[] {
  return (data as Array<{
    id: number | string;
    question_text: string;
    question_text_en?: string;
    answer: string;
    category: number;
    category_name: string;
    mention: boolean;
    position: number | null;
    ranking_list: string[];
    triggers_detected: TriggerDetail[];
    citations: string[];
    classification: Classification;
    classification_reason: string;
    psychological_impact?: string;
  }>).map(r => ({
    id: String(r.id),
    question_text: r.question_text,
    question_text_en: r.question_text_en || '',  // English translation
    answer: r.answer,
    answer_preview: r.answer.substring(0, 200).replace(/\n/g, ' ') + '...',
    category: r.category as CategoryId,
    category_name: r.category_name,
    mention: r.mention,
    position: r.position,
    ranking_list: r.ranking_list || [],
    // triggers_detected as array of strings (trigger names only)
    triggers_detected: (r.triggers_detected || []).map(t => t.trigger),
    // triggers_detail with full objects
    triggers_detail: r.triggers_detected || [],
    citations: r.citations || [],
    classification: r.classification,
    classification_reason: r.classification_reason,
    psychological_impact: r.psychological_impact || '',
  }));
}

// All records
export const records: Record[] = normalizeRecords(rawData as unknown[]);

// Categories array for iteration
export const categories: { id: CategoryId; name: string }[] = [
  { id: 1, name: CATEGORY_NAMES[1] },
  { id: 2, name: CATEGORY_NAMES[2] },
  { id: 3, name: CATEGORY_NAMES[3] },
  { id: 4, name: CATEGORY_NAMES[4] },
  { id: 5, name: CATEGORY_NAMES[5] },
  { id: 6, name: CATEGORY_NAMES[6] },
];

// Get categories list
export function getCategories(): { id: CategoryId; name: string }[] {
  return categories;
}

// Get all records
export function getRecords(): Record[] {
  return records;
}

// Get records by classification
export function getRecordsByClassification(classification: Classification): Record[] {
  return records.filter(r => r.classification === classification);
}

// Get records by category
export function getRecordsByCategory(categoryId: CategoryId): Record[] {
  return records.filter(r => r.category === categoryId);
}

// Get record by ID
export function getRecordById(id: string): Record | undefined {
  return records.find(r => r.id === id);
}

// Get FULL answer by ID (not truncated)
export function getFullAnswer(id: string): string {
  const record = getRecordById(id);
  return record?.answer || '';
}

// Get analysis (psychological_impact) for a record
export function getAnalysis(recordId: string): string | undefined {
  const record = getRecordById(recordId);
  return record?.psychological_impact;
}

// Get summary statistics
export function getSummary() {
  const total = records.length;
  const critical = records.filter(r => r.classification === 'CRITICAL').length;
  const warning = records.filter(r => r.classification === 'WARNING').length;
  const opportunity = records.filter(r => r.classification === 'OPPORTUNITY').length;

  const byCategory: { [key in CategoryId]: { total: number; critical: number; warning: number; opportunity: number } } = {
    1: { total: 0, critical: 0, warning: 0, opportunity: 0 },
    2: { total: 0, critical: 0, warning: 0, opportunity: 0 },
    3: { total: 0, critical: 0, warning: 0, opportunity: 0 },
    4: { total: 0, critical: 0, warning: 0, opportunity: 0 },
    5: { total: 0, critical: 0, warning: 0, opportunity: 0 },
    6: { total: 0, critical: 0, warning: 0, opportunity: 0 },
  };

  records.forEach(r => {
    if (byCategory[r.category]) {
      byCategory[r.category].total++;
      if (r.classification === 'CRITICAL') byCategory[r.category].critical++;
      if (r.classification === 'WARNING') byCategory[r.category].warning++;
      if (r.classification === 'OPPORTUNITY') byCategory[r.category].opportunity++;
    }
  });

  const triggerCounts: { [key: string]: number } = {};
  records.forEach(r => {
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
  } = {}
): Record[] {
  let filtered = [...records];

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
      r.question_text_en.toLowerCase().includes(q) ||
      r.answer.toLowerCase().includes(q) ||
      r.triggers_detected.some(t => t.toLowerCase().includes(q))
    );
  }

  return filtered;
}
