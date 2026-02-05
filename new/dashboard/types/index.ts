export type Classification = 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';

export interface TriggerDetail {
  trigger: string;
  type: Classification;
  context: string;
  reason: string;
}

export interface AuditRecord {
  id: string;
  question_text: string;
  category: number;
  category_name: string;
  mention: boolean;
  position: number | null;
  triggers_detected: string[];
  triggers_detail: TriggerDetail[];
  citations: string[];
  classification: Classification;
  classification_reason: string;
  original_critical: string; // "0" or "1"
  answer_preview: string;
}

export interface DashboardStats {
  total: number;
  critical: number;
  warning: number;
  opportunity: number;
  byCategory: Record<string, number>;
}
