"use client";

import { useState } from "react";
import { AuditRecord, Classification } from "@/types";
import { RecordCard } from "@/components/ui/RecordCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DetailedListProps {
    initialRecords: AuditRecord[];
}

export default function DetailedList({ initialRecords }: DetailedListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<Classification | "ALL">("ALL");

    const filteredRecords = initialRecords.filter((record) => {
        const matchesSearch =
            record.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.answer_preview.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === "ALL" || record.classification === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search questions or answers..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as Classification | "ALL")}
                >
                    <option value="ALL">All Classifications</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="WARNING">Warning</option>
                    <option value="OPPORTUNITY">Opportunity</option>
                </select>
            </div>

            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Showing {filteredRecords.length} records</p>
                <div className="grid gap-4">
                    {filteredRecords.map((record) => (
                        <RecordCard key={record.id} record={record} />
                    ))}
                    {filteredRecords.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No records found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
