interface TriggerPillProps {
  trigger: string;
  type?: 'CRITICAL' | 'WARNING';
}

export default function TriggerPill({ trigger, type = 'WARNING' }: TriggerPillProps) {
  const colors = {
    CRITICAL: 'border-critical/30 text-critical bg-critical-bg/50',
    WARNING: 'border-warning/30 text-warning bg-warning-bg/50',
  };

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${colors[type]}`}
    >
      {trigger}
    </span>
  );
}
