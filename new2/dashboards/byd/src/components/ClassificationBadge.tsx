import { Classification } from '@/lib/data';

interface ClassificationBadgeProps {
  classification: Classification;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const dotSizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export default function ClassificationBadge({
  classification,
  size = 'md',
}: ClassificationBadgeProps) {
  const colors = {
    CRITICAL: {
      bg: 'bg-critical-bg',
      text: 'text-critical',
      dot: 'bg-critical',
      border: 'border-critical/20',
    },
    WARNING: {
      bg: 'bg-warning-bg',
      text: 'text-warning',
      dot: 'bg-warning',
      border: 'border-warning/20',
    },
    OPPORTUNITY: {
      bg: 'bg-opportunity-bg',
      text: 'text-opportunity',
      dot: 'bg-opportunity',
      border: 'border-opportunity/20',
    },
  };

  const color = colors[classification];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size]} ${color.bg} ${color.text} ${color.border}`}
    >
      <span className={`rounded-full ${dotSizeClasses[size]} ${color.dot}`} />
      {classification}
    </span>
  );
}
