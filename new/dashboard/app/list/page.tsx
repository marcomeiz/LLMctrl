import { AuditRecord } from "@/types";
import data from "@/data/data.json";
import DashboardLayout from "@/components/DashboardLayout";
import DetailedList from "@/components/DetailedList";

// Force cast data
const records = data as unknown as AuditRecord[];

export default function ListPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Detailed Audit Log</h1>
                    <p className="text-muted-foreground">Explore all brand mentions and AI responses.</p>
                </div>
                <DetailedList initialRecords={records} />
            </div>
        </DashboardLayout>
    );
}
