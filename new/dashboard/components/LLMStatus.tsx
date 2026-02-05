"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LLMStatusItem {
    name: string;
    logo: string;
    status: "active" | "inactive" | "coming_soon";
}

const llms: LLMStatusItem[] = [
    { name: "ChatGPT (OpenAI)", logo: "/openai.png", status: "active" },
    { name: "Claude (Anthropic)", logo: "/claude-color.png", status: "coming_soon" },
    { name: "Gemini (Google)", logo: "/gemini-color.png", status: "coming_soon" },
    { name: "Perplexity", logo: "/perplexity-color.png", status: "coming_soon" },
];

export function LLMStatus() {
    return (
        <div className="p-4 border-t space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Monitoring Engines
            </h3>
            <div className="space-y-2">
                {llms.map((llm) => (
                    <div
                        key={llm.name}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-lg text-sm transition-colors",
                            llm.status === "active"
                                ? "bg-secondary text-secondary-foreground"
                                : "opacity-60 grayscale"
                        )}
                    >
                        <div className="relative w-6 h-6 shrink-0 bg-white rounded-full p-0.5 overflow-hidden">
                            <Image
                                src={llm.logo}
                                alt={llm.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{llm.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">
                                {llm.status === "active" ? "● Online" : "Coming Soon"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
