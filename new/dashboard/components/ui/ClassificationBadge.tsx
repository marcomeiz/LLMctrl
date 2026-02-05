import { Classification } from "@/types";
import { cn } from "@/lib/utils";

interface ClassificationBadgeProps {
    type: Classification;
    className?: string;
    showIcon?: boolean;
}

export const ClassificationBadge = ({ type, className, showIcon = true }: ClassificationBadgeProps) => {
    const styles = {
        CRITICAL: "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900",
        WARNING: "text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900",
        OPPORTUNITY: "text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900",
    };

    const dotStyles = {
        CRITICAL: "bg-red-600 dark:bg-red-500",
        WARNING: "bg-amber-600 dark:bg-amber-500",
        OPPORTUNITY: "bg-emerald-600 dark:bg-emerald-500",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                styles[type],
                className
            )}
        >
            {showIcon && <span className={cn("size-1.5 rounded-full", dotStyles[type])} />}
            {type}
        </span>
    );
};
