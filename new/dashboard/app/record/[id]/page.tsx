import { AuditRecord } from "@/types";
import data from "@/data/data.json";
import DashboardLayout from "@/components/DashboardLayout";
import { ClassificationBadge } from "@/components/ui/ClassificationBadge";
import { ArrowLeft, ExternalLink, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

// Force cast data
const records = data as unknown as AuditRecord[];

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

// In Next.js 15+, params is a Promise
export default async function RecordPage({ params }: PageProps) {
    const { id } = await params;
    const record = records.find((r) => r.id === id);

    if (!record) {
        return notFound();
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Link
                    href="/list"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to List
                </Link>

                {/* Header */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <ClassificationBadge type={record.classification} />
                        <span className="text-sm text-muted-foreground font-mono">#{record.id}</span>
                        {record.category_name && (
                            <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                                {record.category_name}
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                        {record.question_text}
                    </h1>
                </div>

                {/* Critical Information Grid */}
                <div className="grid gap-6 md:grid-cols-2">

                    {/* Triggers Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Detected Triggers
                        </h2>
                        {record.triggers_detail.length > 0 ? (
                            <div className="grid gap-3">
                                {record.triggers_detail.map((detail, idx) => (
                                    <div key={idx} className="p-4 rounded-lg bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-sm text-red-700 dark:text-red-400 uppercase tracking-wide">
                                                {detail.trigger}
                                            </span>
                                            <span className="text-xs text-red-600/70 dark:text-red-400/60 font-mono">
                                                {detail.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-red-900/80 dark:text-red-200/80 mb-2">
                                            {detail.reason}
                                        </p>
                                        {detail.context && (
                                            <div className="text-xs bg-white/50 dark:bg-black/20 p-2 rounded">
                                                <span className="font-semibold">Context: </span>
                                                {detail.context}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 rounded-lg bg-secondary text-muted-foreground text-sm">
                                No specific negative triggers detected.
                            </div>
                        )}
                    </div>

                    {/* Metadata & Stats */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-500" />
                            Analysis Metadata
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg border bg-card">
                                <span className="text-sm text-muted-foreground block mb-1">Brand Mentioned</span>
                                <span className={cn("text-lg font-bold", record.mention ? "text-emerald-600" : "text-red-600")}>
                                    {record.mention ? "Yes" : "No"}
                                </span>
                            </div>
                            <div className="p-4 rounded-lg border bg-card">
                                <span className="text-sm text-muted-foreground block mb-1">Rank Position</span>
                                <span className="text-lg font-bold">
                                    {record.position !== null ? `#${record.position}` : "N/A"}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border bg-card">
                            <span className="text-sm text-muted-foreground block mb-2">Classification Logic</span>
                            <p className="text-sm">{record.classification_reason}</p>
                        </div>
                    </div>
                </div>

                {/* Chat Interface Section */}
                <div className="space-y-4 pt-4 border-t">
                    <h2 className="text-lg font-semibold">AI Conversation</h2>

                    <div className="flex flex-col gap-6 max-w-3xl mx-auto">

                        {/* User Message */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">YO</span>
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="font-semibold text-sm">You</div>
                                <div className="text-base text-foreground leading-relaxed">
                                    {record.question_text}
                                </div>
                            </div>
                        </div>

                        {/* AI Response */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#74aa9c] flex items-center justify-center shrink-0 overflow-hidden">
                                {/* Using OpenAI logo or a fallback generic AI icon if desired */}
                                <img src="/openai.png" alt="ChatGPT" className="w-full h-full object-contain p-1" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="font-semibold text-sm">ChatGPT</div>
                                <div className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                                    {record.answer_preview}
                                </div>
                                <div className="pt-2 flex gap-2">
                                    {/* Fake action buttons for look & feel */}
                                    {["Copy", "Regenerate"].map(action => (
                                        <button key={action} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Citations */}
                    {record.citations.length > 0 && (
                        <div className="mt-8 pt-4 border-t max-w-3xl mx-auto w-full">
                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Sources Cited</h3>
                            <div className="flex flex-wrap gap-2">
                                {record.citations.map((cite, idx) => (
                                    <a
                                        key={idx}
                                        href={cite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-xs font-medium text-secondary-foreground transition-colors max-w-full truncate"
                                    >
                                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate max-w-[200px]">{cite}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
