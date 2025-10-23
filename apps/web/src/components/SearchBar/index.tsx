"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, FileText, LayoutDashboard, User, Network } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@sandworm/ui/components/command";

import { Input } from "@sandworm/ui/components/input";
import { searchData, SearchResult } from "./DummySearchData";
import { Badge } from "@sandworm/ui/components/badge";

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "queries" | "dashboards" | "users" | "networks"
  >("all");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filterResults = (results: SearchResult[]) => {
    if (activeFilter === "all") return results;

    const typeMap: Record<string, string> = {
      queries: "query",
      dashboards: "dashboard",
      users: "user",
      networks: "network",
    };

    return results.filter(item => item.type === typeMap[activeFilter]);
  };

  const searchResults = (results: SearchResult[]) => {
    if (!search) return results;
    return results.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredQueries = searchResults(filterResults(searchData.queries));
  const filteredDashboards = searchResults(
    filterResults(searchData.dashboards)
  );
  const filteredUsers = searchResults(filterResults(searchData.users));
  const filteredNetworks = searchResults(filterResults(searchData.networks));

  const getIcon = (type: string) => {
    switch (type) {
      case "query":
        return <FileText className="h-4 w-4" />;
      case "dashboard":
        return <LayoutDashboard className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "network":
        return <Network className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // const router = useRouter();
  // const searchParams = useSearchParams();

  // const currentSearch = searchParams.get("search") ?? "";
  // const [query, setQuery] = useState(currentSearch);
  // const [cachedQueries, setCachedQueries] = useState<string[]>([]);
  // const [isActive, setIsActive] = useState(false);
  // const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  // const searchContainerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   setQuery(currentSearch);
  // }, [currentSearch]);

  // const addToCache = (q: string) => {
  //   setCachedQueries(prev => {
  //     const filtered = prev.filter(item => item !== q);
  //     return [q, ...filtered].slice(0, 5);
  //   });
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "ArrowDown") {
  //     e.preventDefault();
  //     setIsActive(true);
  //     setHighlightIndex(prev => (prev + 1) % cachedQueries.length);
  //   } else if (e.key === "ArrowUp") {
  //     e.preventDefault();
  //     setIsActive(true);
  //     setHighlightIndex(prev =>
  //       prev <= 0 ? cachedQueries.length - 1 : prev - 1
  //     );
  //   } else if (e.key === "Enter") {
  //     e.preventDefault();
  //     const finalQuery =
  //       highlightIndex >= 0 ? cachedQueries[highlightIndex] : query.trim();

  //     if (finalQuery !== "") {
  //       addToCache(finalQuery);
  //     }
  //     setQuery(finalQuery);
  //     setIsActive(false);
  //     setHighlightIndex(-1);

  //     const tab = searchParams.get("tab") || "all";
  //     const page = "1";

  //     const baseUrl = `workspace/explore?tab=${tab}&page=${page}`;
  //     const searchUrl = finalQuery
  //       ? `${baseUrl}&search=${encodeURIComponent(finalQuery)}`
  //       : baseUrl;
  //     router.push(searchUrl);
  //   } else if (e.key === "Escape") {
  //     e.preventDefault();
  //     setIsActive(false);
  //     setHighlightIndex(-1);
  //   }
  // };

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       searchContainerRef.current &&
  //       !searchContainerRef.current.contains(event.target as Node)
  //     ) {
  //       setIsActive(false);
  //       setHighlightIndex(-1);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex-1 max-w-2xl group"
      >
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <div className="w-full pl-9 pr-24 h-10 rounded-md border border-input bg-muted/50 text-sm text-muted-foreground flex items-center hover:bg-muted/70 transition-colors">
            Search Queries, Dashboards, users etc
          </div>
          <div className="absolute right-3 flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px]">
              Press
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px]">
              Enter
            </kbd>
          </div>
        </div>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} className="max-w-2xl">
        <CommandInput placeholder="Start typing..." className="h-11 mb-3" />

        <div className="flex items-center gap-2 px-4 pb-3 border-b">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-red-500 text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("queries")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeFilter === "queries"
                ? "bg-red-500 text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Queries
          </button>
          <button
            onClick={() => setActiveFilter("dashboards")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeFilter === "dashboards"
                ? "bg-red-500 text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Dashboards
          </button>
          <button
            onClick={() => setActiveFilter("users")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeFilter === "users"
                ? "bg-red-500 text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveFilter("networks")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeFilter === "networks"
                ? "bg-red-500 text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Networks
          </button>
        </div>

        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {filteredQueries.length > 0 && (
            <>
              <CommandGroup heading="Queries" className="px-4 py-2">
                {filteredQueries.map(item => (
                  <CommandItem
                    key={item.id}
                    className="flex items-center gap-2 px-2 py-2"
                  >
                    {getIcon(item.type)}
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={`${
                          item.badge === "Linea Checker"
                            ? "bg-cyan-500 text-white hover:bg-cyan-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {filteredDashboards.length > 0 && (
            <>
              <CommandGroup heading="Dashboards" className="px-4 py-2">
                {filteredDashboards.map(item => (
                  <CommandItem
                    key={item.id}
                    className="flex items-center gap-2 px-2 py-2"
                  >
                    {getIcon(item.type)}
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {filteredUsers.length > 0 && (
            <>
              <CommandGroup heading="Users" className="px-4 py-2">
                {filteredUsers.map(item => (
                  <CommandItem
                    key={item.id}
                    className="flex items-center gap-2 px-2 py-2"
                  >
                    {getIcon(item.type)}
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {filteredNetworks.length > 0 && (
            <>
              <CommandGroup heading="Networks" className="px-4 py-2">
                {filteredNetworks.map(item => (
                  <CommandItem
                    key={item.id}
                    className="flex items-center gap-2 px-2 py-2"
                  >
                    {getIcon(item.type)}
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      {item.title}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>

        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">
                ↓
              </kbd>
              <span className="ml-1">to navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">
                ↵
              </kbd>
              <span className="ml-1">to select</span>
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">
              esc
            </kbd>
            <span className="ml-1">to close</span>
          </span>
        </div>
      </CommandDialog>
    </>
  );
};

// <div
//   className="relative w-full max-w-md min-w-[26rem] mx-auto"
//   ref={searchContainerRef}
// >
//   <Search
//     size={16}
//     className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-text-gray"
//   />
//   <div className="relative">
//     <Input
//       type="text"
//       placeholder="Search Queries, Dahboards, Users"
//       value={query}
//       onChange={e => {
//         setQuery(e.target.value);
//         setHighlightIndex(-1);
//       }}
//       onKeyDown={handleKeyDown}
//       onFocus={() => setIsActive(true)}
//       className="w-full pl-10 pr-16 py-1 rounded-md dark:bg-[#1A1A1A] border dark:border-[#ffffff60] border-[#DEE2E6] dark:text-white placeholder-[#455768]  focus:outline-none focus:ring focus:ring-gray-300 transition text-xs md:text-sm bg-[#F1F3F4]"
//     />
//     <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-gray select-none font-medium">
//       Press{" "}
//       <kbd className="dark:bg-black/90 bg-[#E0EAF1] px-1 rounded">
//         Enter
//       </kbd>
//     </div>
//   </div>

//   {isActive && cachedQueries.length > 0 && (
//     <ul className="absolute z-10 top-full mt-1 w-full dark:bg-black border border-[#30363d] rounded-md shadow-md max-h-48 overflow-y-auto">
//       {cachedQueries.map((item, i) => (
//         // eslint-disable-next-line react/no-array-index-key
//         <li key={i} className="w-full">
//           <button
//             type="button"
//             className={`px-4 py-2 cursor-pointer text-sm w-full text-left ${
//               highlightIndex === i
//                 ? "bg-white/10 text-white"
//                 : "text-text-gray hover:bg-white/10 hover:text-white"
//             }`}
//             onMouseEnter={() => setHighlightIndex(i)}
//             onClick={() => {
//               addToCache(item);
//               setQuery(item);
//               setIsActive(false);
//               setHighlightIndex(-1);

//               const tab = searchParams.get("tab") || "all";
//               const page = "1";

//               router.push(
//                 `workspace/explore?tab=${tab}&page=${page}&search=${encodeURIComponent(item)}`
//               );
//             }}
//           >
//             {item}
//           </button>
//         </li>
//       ))}
//     </ul>
//   )}
// </div>
