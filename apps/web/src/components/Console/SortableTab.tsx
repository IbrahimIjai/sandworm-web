import { CSS } from "@dnd-kit/utilities";
import { X, Home, Terminal, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { useHotkeys } from "react-hotkeys-hook";

import { TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSandwormStore } from "@/store";

interface Tab {
  id: string;
  title: string;
  type: "sql" | "home";
  content: string | { database?: string; table?: string };
}

interface SortableTabProps {
  tab: Tab;
  isActive: boolean;
}

export const SortableTab = ({ tab, isActive }: SortableTabProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tab.id,
    disabled: tab.type === "home",
  });

  const { isExecuting, closeTab } = useSandwormStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: tab.type === "home" ? "100px" : "150px",
  };

  const handleMiddleClick = (e: React.MouseEvent) => {
    if (e.button === 1 && tab.id !== "home") {
      e.preventDefault();
      closeTab(tab.id);
    }
  };

  useHotkeys(
    "ctrl+alt+w",
    (e) => {
      if (tab.id !== "home" && isActive) {
        e.preventDefault();
        closeTab(tab.id);
      }
    },
    [isActive, tab.id],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Delete" && tab.id !== "home") {
      closeTab(tab.id);
    }
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />;
      case "sql":
        return <Terminal className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center group relative ",
        isDragging ? "opacity-50" : "",
        isActive ? "z-10" : "z-0",
      )}
      onClick={handleMiddleClick}
      onAuxClick={handleMiddleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={(e) => e.preventDefault()}
    >
      {tab.type === "sql" && (
        <div
          className="absolute left-0 top-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing z-50"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...attributes}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...listeners}
        >
          <GripVertical className="h-4 w-4 mt-2 ml-1 text-secondary" />
        </div>
      )}
      <TabsTrigger
        disabled={isExecuting}
        value={tab.id}
        className={cn(
          "flex h-8 items-center rounded-none px-3 relative w-full border-r border-[#ffffff20] ",
          "data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-b border-b-primary",
          "transition-colors duration-200",
          "hover:bg-black/20",
          tab.id === "home" ? "cursor-default" : "cursor-pointer",
          tab.type === "sql" ? "pl-7" : "pl-3",
          isExecuting ? "pointer-events-none opacity-50" : "",
        )}
      >
        <div className="flex items-center space-x-2 overflow-hidden w-full">
          <div className="flex-shrink-0">{getTabIcon(tab.type)}</div>
          <span className="truncate text-xs">{tab.title}</span>
          {tab.type === "sql" && (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <span
              className="cursor-pointer hover:bg-red-500/10 p-1 rounded transition-colors  flex items-center space-x-1 text-xs text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  closeTab(tab.id);
                }
              }}
              aria-label="Close tab"
            >
              <X className="h-4 w-4 text-white/90 hover:text-red-500 transition-colors" />
            </span>
          )}
        </div>
      </TabsTrigger>
    </div>
  );
};
