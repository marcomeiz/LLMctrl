import { AuditRecord } from "@/types";
import { ClassificationBadge } from "./ClassificationBadge";
import { TriggerPill } from "./TriggerPill";
import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RecordCardProps {
    record: AuditRecord;
    compact?: boolean; // For executive view, show less
}


export const RecordCard = ({ record, compact = false }: RecordCardProps) => {
    return (
        <Link href={`/record/${record.id}`} className="block group">
            <div className="bg-card dark:bg-card/50 border rounded-xl p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <ClassificationBadge type={record.classification} />
                            <span className="text-xs text-muted-foreground font-mono">#{record.id}</span>
                            {record.category_name && (
                                <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-secondary rounded">
                                    {record.category_name}
                                </span>
                            )}
                        </div>

                        <h3 className={cn(
                            "font-semibold text-sm sm:text-base leading-tight group-hover:text-primary transition-colors",
                            record.classification === "CRITICAL" ? "line-clamp-none" : "line-clamp-2"
                        )}>
                            {record.question_text}
                        </h3>

                        {!compact && record.triggers_detail.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {record.triggers_detail.map((t, idx) => (
                                    <TriggerPill key={idx} trigger={t.trigger} type={record.classification} />
                                ))}
                            </div>
                        )}

                        {!compact && (
                            <p className={cn(
                                "text-sm text-muted-foreground mt-2 font-normal",
                                record.classification === "CRITICAL" ? "line-clamp-none" : "line-clamp-2"
                            )}>
                                {record.answer_preview}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                        {record.position !== null && (
                            <div className="text-xs font-medium text-muted-foreground">
                                Rank: <span className="text-foreground">{record.position}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
