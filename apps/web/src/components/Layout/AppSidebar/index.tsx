"use client";

import { GiBackwardTime } from "react-icons/gi";
import {
  SquareTerminal,
  BookText,
  Database,
  Settings,
  Bug,
  Keyboard,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CommandMenu } from "@/components/Console/CommandModal";
import { Dialog } from "@/components/ui/dialog";

type ViewType =
  | "dataExplorer"
  | "queryExplorer"
  | "ChangeLog"
  | "wormbot"
  | "settingsPanel";

interface AppSidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const AppSidebar = ({
  currentView,
  setCurrentView,
}: AppSidebarProps) => {
  const [isCommandMenuOpen, setCommandMenuOpen] = useState(false);

  const viewOptions = [
    { id: "dataExplorer" as const, label: "Data Explorer", icon: Database },
    {
      id: "queryExplorer" as const,
      label: "Saved Queries",
      icon: SquareTerminal,
    },
    { id: "ChangeLog" as const, label: "ChangeLog", icon: GiBackwardTime },
  ];

  const bottomNavLinks = [
    {
      to: "https://docs.google.com/forms/d/e/1FAIpQLSeX0V7N3sk5LMx4BtP8IXtL11aaJm_LIODQTYqiDr-kD1OXLw/viewform?usp=sharing&ouid=116485828440881365016",
      label: "Submit Feedback",
      icon: Bug,
      isNewWindow: true,
    },
    {
      to: "https://docs.sandwormlabs.xyz/",
      label: "Documentation",
      icon: BookText,
      isNewWindow: true,
    },
  ];

  return (
    <>
      <TooltipProvider>
        <div className="h-full w-16 bg-muted border-r flex flex-col items-center py-4 space-y-4  pt-12">
          <ScrollArea className="flex-grow ">
            {viewOptions.map(item => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors w-full mb-5 ${
                      currentView === item.id
                        ? " border-l-4 border-orange-600 rounded-none"
                        : "hover:bg-white/15"
                    }`}
                    onClick={() => setCurrentView(item.id)}
                  >
                    <item.icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span className="text-sm">{item.label}</span>
                </TooltipContent>
              </Tooltip>
            ))}
          </ScrollArea>

          <div className="space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full"
                  onClick={() => setCommandMenuOpen(true)}
                >
                  <Keyboard className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span className="text-sm">Shortcuts</span>
              </TooltipContent>
            </Tooltip>

            {bottomNavLinks.map(item => (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.to}
                    target={item.isNewWindow ? "_blank" : "_self"}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full"
                      aria-label={item.label}
                    >
                      <item.icon className="h-6 w-6" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span className="text-sm">{item.label}</span>
                </TooltipContent>
              </Tooltip>
            ))}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    currentView === "settingsPanel" ? "secondary" : "ghost"
                  }
                  size="icon"
                  className="w-full"
                  onClick={() => setCurrentView("settingsPanel")}
                >
                  <Settings className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span className="text-sm">Settings</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      <Dialog open={isCommandMenuOpen} onOpenChange={setCommandMenuOpen}>
        <CommandMenu />
      </Dialog>
    </>
  );
};
