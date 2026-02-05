"use client";

import { AuditRecord } from "@/types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface CategoryAnalysisProps {
    records: AuditRecord[];
}

export default function CategoryAnalysis({ records }: CategoryAnalysisProps) {
    // Aggregate data by category
    const categories = Array.from(new Set(records.map((r) => r.category_name)));

    const categoryData = categories.map((catString) => {
        const catRecords = records.filter((r) => r.category_name === catString);
        const critical = catRecords.filter((r) => r.classification === "CRITICAL").length;
        const warning = catRecords.filter((r) => r.classification === "WARNING").length;
        const opportunity = catRecords.filter((r) => r.classification === "OPPORTUNITY").length;
        const total = catRecords.length;
        const criticalPercentage = (critical / total) * 100;

        // Average rank position (ignore nulls)
        const rankedRecords = catRecords.filter(r => r.position !== null);
        const avgPosition = rankedRecords.length > 0
            ? rankedRecords.reduce((acc, curr) => acc + (curr.position || 0), 0) / rankedRecords.length
            : 0;

        return {
            name: catString,
            originalName: catString,
            CRITICAL: critical,
            WARNING: warning,
            OPPORTUNITY: opportunity,
            total,
            criticalPercentage,
            avgPosition: avgPosition.toFixed(1)
        };
    }).sort((a, b) => b.CRITICAL - a.CRITICAL); // Sort by most criticals

    const COLORS = {
        CRITICAL: "#ef4444", // red-500
        WARNING: "#f59e0b", // amber-500
        OPPORTUNITY: "#10b981", // emerald-500
    };

    return (
        <div className="space-y-8">

            {/* Chart Section */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Classification Distribution by Category</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={categoryData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Legend />
                            <Bar dataKey="CRITICAL" stackId="a" fill={COLORS.CRITICAL} />
                            <Bar dataKey="WARNING" stackId="a" fill={COLORS.WARNING} />
                            <Bar dataKey="OPPORTUNITY" stackId="a" fill={COLORS.OPPORTUNITY} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryData.map((cat) => (
                    <div key={cat.name} className="p-4 border rounded-xl bg-card hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm line-clamp-1" title={cat.name}>{cat.name}</h4>
                            <span className="text-xs font-mono text-muted-foreground">{cat.total} questions</span>
                        </div>

                        <div className="space-y-3 mt-4">
                            {/* Critical Score Bar */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Criticality Score</span>
                                    <span className={cat.criticalPercentage > 50 ? "text-red-600 font-bold" : "text-muted-foreground"}>
                                        {cat.criticalPercentage.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500"
                                        style={{ width: `${cat.criticalPercentage}%` }}
                                    />
                                </div>
                            </div>

                            {/* Detail Counts */}
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="bg-red-50 dark:bg-red-950/20 rounded p-1">
                                    <span className="block font-bold text-red-600">{cat.CRITICAL}</span>
                                    <span className="text-red-600/70">Crit</span>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-950/20 rounded p-1">
                                    <span className="block font-bold text-amber-600">{cat.WARNING}</span>
                                    <span className="text-amber-600/70">Warn</span>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded p-1">
                                    <span className="block font-bold text-emerald-600">{cat.OPPORTUNITY}</span>
                                    <span className="text-emerald-600/70">Opp</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
