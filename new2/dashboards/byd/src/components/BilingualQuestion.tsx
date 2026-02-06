'use client';

interface BilingualQuestionProps {
  spanish: string;
  english: string;
  className?: string;
  spanishClassName?: string;
  englishClassName?: string;
  truncate?: boolean;
}

export default function BilingualQuestion({
  spanish,
  english,
  className = '',
  spanishClassName = 'text-text',
  englishClassName = 'text-text-muted italic',
  truncate = false,
}: BilingualQuestionProps) {
  const truncateClass = truncate ? 'line-clamp-2' : '';

  return (
    <div className={className}>
      {/* Original Spanish */}
      <p className={`${spanishClassName} ${truncateClass}`}>
        {spanish}
      </p>
      {/* English translation */}
      {english && (
        <p className={`mt-1 text-xs ${englishClassName} ${truncateClass}`}>
          {english}
        </p>
      )}
    </div>
  );
}
