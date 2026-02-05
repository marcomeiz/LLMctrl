import { AuditRecord } from "@/types";
import data from "@/data/data.json";
import DashboardLayout from "@/components/DashboardLayout";
import CategoryAnalysis from "@/components/CategoryAnalysis";

// Force cast data
const records = data as unknown as AuditRecord[];

export default function AnalysisPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Category Analysis</h1>
                    <p className="text-muted-foreground">Performance breakdown by topic and sector.</p>
                </div>
                <CategoryAnalysis records={records} />
            </div>
        </DashboardLayout>
    );
}
