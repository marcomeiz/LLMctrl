'use client';

import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Record } from '@/lib/data';

interface ConsumerAnalysisProps {
  record: Record;
  variant?: 'default' | 'compact';
}

function getImpactLevel(classification: string): 'high' | 'medium' | 'low' {
  if (classification === 'CRITICAL') return 'high';
  if (classification === 'WARNING') return 'medium';
  return 'low';
}

export default function ConsumerAnalysis({ record, variant = 'default' }: ConsumerAnalysisProps) {
  const analysis = record.psychological_impact || '';
  const impactLevel = getImpactLevel(record.classification);

  const getImpactIcon = () => {
    switch (impactLevel) {
      case 'high':
        return <TrendingDown size={14} className="text-critical" />;
      case 'medium':
        return <Minus size={14} className="text-warning" />;
      case 'low':
        return <TrendingUp size={14} className="text-opportunity" />;
    }
  };

  const getImpactLabel = () => {
    switch (impactLevel) {
      case 'high':
        return 'High negative impact';
      case 'medium':
        return 'Moderate impact';
      case 'low':
        return 'Positive impact';
    }
  };

  const getImpactColor = () => {
    switch (impactLevel) {
      case 'high':
        return 'text-critical';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-opportunity';
    }
  };

  if (!analysis) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="rounded-lg border border-border bg-surface/50 p-4">
        <div className="flex items-start gap-3">
          <Brain size={16} className="mt-0.5 shrink-0 text-text-muted" />
          <p className="text-sm leading-relaxed text-text-muted">{analysis}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-text-muted" />
          <h2 className="text-sm font-medium text-text">Interamplify Analysis</h2>
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${getImpactColor()}`}>
          {getImpactIcon()}
          <span>{getImpactLabel()}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm leading-relaxed text-text-muted">{analysis}</p>
      </div>
    </div>
  );
}
