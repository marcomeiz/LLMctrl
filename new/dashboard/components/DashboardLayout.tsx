import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, List, PieChart } from "lucide-react";
import { LLMStatus } from "./LLMStatus";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-[#0a0a0a] pb-20 sm:pb-0 sm:pl-64 transition-all">
            {/* Mobile Header */}
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 sm:hidden">
                <div className="relative w-8 h-8">
                    <Image src="/betfair-seeklogo.png" alt="Betfair" fill className="object-contain" />
                </div>
                <div className="font-bold text-lg tracking-tight">LLM<span className="text-primary">Ctrl</span></div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background/95 backdrop-blur sm:flex">
                <div className="flex h-14 items-center gap-2 border-b px-6">
                    <div className="relative w-8 h-8">
                        <Image src="/betfair-seeklogo.png" alt="Betfair" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">LLM<span className="text-primary">Ctrl</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                        <LayoutDashboard className="h-4 w-4" />
                        Executive Overview
                    </Link>
                    <Link href="/list" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                        <List className="h-4 w-4" />
                        Audit Logs
                    </Link>
                    <Link href="/analysis" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                        <PieChart className="h-4 w-4" />
                        Category Analysis
                    </Link>
                </nav>

                <LLMStatus />
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur sm:hidden">
                <Link href="/" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-muted-foreground hover:text-foreground">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Overview</span>
                </Link>
                <Link href="/list" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-muted-foreground hover:text-foreground">
                    <List className="h-5 w-5" />
                    <span>Logs</span>
                </Link>
                <Link href="/analysis" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-muted-foreground hover:text-foreground">
                    <PieChart className="h-5 w-5" />
                    <span>Analysis</span>
                </Link>
            </nav>

            <main className="p-4 sm:p-8">
                <div className="mx-auto max-w-5xl space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
