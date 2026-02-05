import { AuditRecord } from "@/types";
import data from "@/data/data.json";
import { StatCard } from "@/components/ui/StatCard";
import { RecordCard } from "@/components/ui/RecordCard";
import DashboardLayout from "@/components/DashboardLayout";
import { Activity, AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

// Force cast data to AuditRecord[]
const records = data as unknown as AuditRecord[];

export default function Home() {
  // Calculate Stats
  const total = records.length;
  const critical = records.filter((r) => r.classification === "CRITICAL").length;
  const warning = records.filter((r) => r.classification === "WARNING").length;
  const opportunity = records.filter((r) => r.classification === "OPPORTUNITY").length;

  // Filter for Priority View (Criticals first)
  const priorityRecords = records
    .filter((r) => r.classification === "CRITICAL")
    .slice(0, 5); // Show top 5 criticals

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Executive Overview</h1>
            <p className="text-muted-foreground">Real-time analysis of LLM brand perception.</p>
          </div>
          <div className="hidden sm:block relative w-32 h-10 opacity-80 grayscale hover:grayscale-0 transition-all">
            {/* Optional: Add a client logo here if desired, or keep it clean */}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total Audits"
            value={total}
            icon={Activity}
            color="default"
          />
          <StatCard
            label="Critical"
            value={critical}
            icon={AlertOctagon}
            color="critical"
            trend={`${((critical / total) * 100).toFixed(1)}%`}
            trendUp={false}
          />
          <StatCard
            label="Warning"
            value={warning}
            icon={AlertTriangle}
            color="warning"
            trend={`${((warning / total) * 100).toFixed(1)}%`}
            trendUp={false}
          />
          <StatCard
            label="Secure"
            value={opportunity}
            icon={CheckCircle2}
            color="opportunity"
            trend={`${((opportunity / total) * 100).toFixed(1)}%`}
            trendUp={true}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Priority Attention Required</h2>
            {critical > 5 && (
              <span className="text-xs text-muted-foreground">Showing 5 of {critical}</span>
            )}
          </div>

          {priorityRecords.length > 0 ? (
            <div className="grid gap-4">
              {priorityRecords.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground">
              No critical issues detected.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
