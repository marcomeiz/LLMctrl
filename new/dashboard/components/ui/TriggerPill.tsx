import { Classification } from "@/types";
import { cn } from "@/lib/utils";

interface TriggerPillProps {
    trigger: string;
    type?: Classification; // Optional override, usually derived from context
    className?: string;
}

export const TriggerPill = ({ trigger, type = 'WARNING', className }: TriggerPillProps) => {
    // Styles are subtler than Badges
    const styles = {
        CRITICAL: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50",
        WARNING: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50",
        OPPORTUNITY: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50",
    };

    return (
        <span
            className={cn(
                "inline-flex px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium uppercase tracking-wide border",
                styles[type],
                className
            )}
        >
            {trigger}
        </span>
    );
};
