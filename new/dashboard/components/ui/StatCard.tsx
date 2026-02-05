import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean; // true = good, false = bad (red)
    className?: string;
    color?: "default" | "critical" | "warning" | "opportunity";
}

export const StatCard = ({ label, value, icon: Icon, trend, trendUp, className, color = "default" }: StatCardProps) => {
    const colorStyles = {
        default: "text-muted-foreground",
        critical: "text-red-600 dark:text-red-500",
        warning: "text-amber-600 dark:text-amber-500",
        opportunity: "text-emerald-600 dark:text-emerald-500",
    };

    const bgStyles = {
        default: "bg-card",
        critical: "bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/20",
        warning: "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/20",
        opportunity: "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20",
    };

    return (
        <div className={cn("p-4 rounded-xl border shadow-sm", bgStyles[color], className)}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <Icon className={cn("h-4 w-4", colorStyles[color])} />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{value}</span>
                {trend && (
                    <span className={cn("text-xs font-medium", trendUp ? "text-emerald-600" : "text-red-600")}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
};
