"use client";

import { useState } from "react";
import { FileText, GitFork, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "all" | "forked" | "starred";

export function QueryTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const tabs = [
    { id: "all" as Tab, label: "All Queries", icon: FileText },
    { id: "forked" as Tab, label: "Forked", icon: GitFork },
    { id: "starred" as Tab, label: "Starred", icon: Star },
  ];

  return (
    <div className="flex items-center gap-6">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              isActive
                ? "text-destructive"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
