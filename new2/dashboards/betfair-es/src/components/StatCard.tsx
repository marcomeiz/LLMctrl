import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Classification } from '@/lib/data';

interface StatCardProps {
  label: string;
  value: number;
  total?: number;
  classification?: Classification;
  href?: string;
  large?: boolean;
}

export default function StatCard({
  label,
  value,
  total,
  classification,
  href,
  large = false,
}: StatCardProps) {
  const colors = {
    CRITICAL: {
      text: 'text-critical',
      bg: 'bg-critical-bg',
      border: 'border-critical/20',
      dot: 'bg-critical',
      arrow: 'text-critical/60 group-hover:text-critical',
    },
    WARNING: {
      text: 'text-warning',
      bg: 'bg-warning-bg',
      border: 'border-warning/20',
      dot: 'bg-warning',
      arrow: 'text-warning/60 group-hover:text-warning',
    },
    OPPORTUNITY: {
      text: 'text-opportunity',
      bg: 'bg-opportunity-bg',
      border: 'border-opportunity/20',
      dot: 'bg-opportunity',
      arrow: 'text-opportunity/60 group-hover:text-opportunity',
    },
  };

  const color = classification ? colors[classification] : null;
  const percentage = total ? ((value / total) * 100).toFixed(1) : null;

  const content = (
    <div
      className={`group relative rounded-lg border p-4 transition-all ${
        color ? `${color.bg} ${color.border}` : 'border-border bg-surface'
      } ${href ? 'cursor-pointer hover:border-text-muted/30' : ''} ${
        large ? 'p-6' : 'p-4'
      }`}
    >
      {/* Clickable indicator arrow */}
      {href && (
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all group-hover:translate-x-1 ${color?.arrow || 'text-text-muted/50 group-hover:text-text-muted'}`}>
          <ChevronRight size={large ? 32 : 24} strokeWidth={2.5} />
        </div>
      )}

      <div className="flex items-center gap-2 mb-1">
        {color && <span className={`w-2 h-2 rounded-full ${color.dot}`} />}
        <span className={`text-xs font-medium ${color?.text || 'text-text-muted'}`}>
          {label}
        </span>
      </div>
      <div className={`font-semibold ${color?.text || 'text-text'} ${large ? 'text-4xl' : 'text-2xl'}`}>
        {value}
      </div>
      {percentage && (
        <div className="text-xs text-text-muted mt-1">{percentage}% of total</div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
