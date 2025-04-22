"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineCommandLine } from "react-icons/hi2";
import { FaRegStar } from "react-icons/fa";
import { VscRepoForked } from "react-icons/vsc";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QueryList } from "@/components/Queries/QueryList";
import type { QueryResponse } from "@/types";

interface TabSectionProps {
  queries: QueryResponse;
  forkedQueries: QueryResponse;
  starredQueries: QueryResponse;
  defaultTab?: string;
}

export const TabsSection: React.FC<TabSectionProps> = ({
  queries,
  defaultTab,
  forkedQueries,
  starredQueries,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(defaultTab || "all");

  useEffect(() => {
    const current = searchParams?.get("tab");
    if (current !== tab) {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("tab", tab);
      router.replace(`?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [tab]);

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="flex border-b border-borderLight">
        <TabsTrigger
          value="all"
          className={`px-4 py-2 flex items-center space-x-2 ${tab === "all" ? "border-b-2 border-primary" : ""}`}
        >
          <HiOutlineCommandLine size={18} />
          <span>All Queries</span>
        </TabsTrigger>
        <TabsTrigger
          value="forked"
          className={`px-4 py-2 flex items-center space-x-2 ${tab === "forked" ? "border-b-2 border-primary" : ""}`}
        >
          <VscRepoForked size={16} />
          <span> Forked</span>
        </TabsTrigger>
        <TabsTrigger
          value="starred"
          className={`px-4 py-2 flex items-center space-x-2 ${tab === "starred" ? "border-b-2 border-primary" : ""}`}
        >
          <FaRegStar size={16} /> <span>Starred</span>
        </TabsTrigger>
      </TabsList>
      <div className="container mx-auto pt-6">
        <TabsContent value="all">
          <QueryList
            queries={queries.page_items}
            pagination={queries.pagination}
          />
        </TabsContent>
        <TabsContent value="forked">
          <QueryList
            queries={forkedQueries.page_items}
            pagination={forkedQueries.pagination}
          />
        </TabsContent>
        <TabsContent value="starred">
          <QueryList
            queries={starredQueries.page_items}
            pagination={starredQueries.pagination}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};
