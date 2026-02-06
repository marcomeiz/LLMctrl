'use client';

import Link from 'next/link';
import { Record } from '@/lib/data';
import ClassificationBadge from './ClassificationBadge';
import TriggerPill from './TriggerPill';
import { useMemo } from 'react';

interface RecordCardProps {
  record: Record;
  showPreview?: boolean;
  basePath?: string;
}

// Helper to highlight a specific trigger in text
function highlightTrigger(text: string, trigger: string, type: 'CRITICAL' | 'WARNING') {
  const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedTrigger})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.toLowerCase() === trigger.toLowerCase()) {
      const colorClass = type === 'CRITICAL'
        ? 'bg-critical/20 text-critical font-medium px-0.5 rounded'
        : 'bg-warning/20 text-warning font-medium px-0.5 rounded';
      return (
        <mark key={i} className={colorClass}>
          {part}
        </mark>
      );
    }
    return part;
  });
}

export default function RecordCard({ record, showPreview = true, basePath = '' }: RecordCardProps) {
  // Get unique trigger contexts (first 2 for preview)
  const triggerContexts = useMemo(() => {
    if (!record.triggers_detail?.length) return [];

    // Get unique contexts (some triggers might share the same context)
    const seen = new Set<string>();
    return record.triggers_detail
      .filter(t => {
        if (seen.has(t.context)) return false;
        seen.add(t.context);
        return true;
      })
      .slice(0, 2); // Show max 2 contexts
  }, [record.triggers_detail]);

  return (
    <Link href={`${basePath}/detail/${record.id}`}>
      <div className="group cursor-pointer rounded-lg border border-border bg-surface p-4 transition-all hover:border-text-muted/30">
        {/* Header: Question + Badge */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-text group-hover:text-text">
              {record.question_text}
            </h3>
            {record.question_text_en && (
              <p className="mt-1 text-xs text-text-muted/70 italic">
                {record.question_text_en}
              </p>
            )}
          </div>
          <ClassificationBadge classification={record.classification} size="sm" />
        </div>

        {/* Category & Position */}
        <div className="mb-3 text-xs text-text-muted">
          {record.category_name}
          {record.ranking_list && record.ranking_list.length > 0 && (
            <span className="ml-2">
              · Ranking: {record.ranking_list.map((brand, i) => (
                <span key={i}>
                  {i > 0 && ' → '}
                  <span className={brand.toLowerCase() === 'betfair' ? 'font-semibold text-opportunity' : ''}>
                    {brand.charAt(0).toUpperCase() + brand.slice(1)}
                  </span>
                </span>
              ))}
            </span>
          )}
        </div>

        {/* Triggers pills */}
        {record.triggers_detected.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {record.triggers_detected.slice(0, 4).map((trigger, i) => {
              const detail = record.triggers_detail.find(d => d.trigger === trigger);
              return (
                <TriggerPill
                  key={i}
                  trigger={trigger}
                  type={detail?.type || 'WARNING'}
                />
              );
            })}
            {record.triggers_detected.length > 4 && (
              <span className="text-xs text-text-muted">
                +{record.triggers_detected.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Trigger contexts with highlighted triggers */}
        {showPreview && triggerContexts.length > 0 && (
          <div className="space-y-2">
            {triggerContexts.map((tc, i) => (
              <p key={i} className="text-xs leading-relaxed text-text-muted italic">
                &ldquo;{highlightTrigger(tc.context, tc.trigger, tc.type)}&rdquo;
              </p>
            ))}
          </div>
        )}

        {/* Fallback to answer preview if no triggers */}
        {showPreview && triggerContexts.length === 0 && record.answer_preview && (
          <p className="text-xs leading-relaxed text-text-muted">
            {record.answer_preview}
          </p>
        )}
      </div>
    </Link>
  );
}
