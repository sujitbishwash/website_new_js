import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>

        <button
          onMouseDown={(e) => e.stopPropagation()}
          className="p-2 shadow-sm rounded-lg bg-background border border-divider hover:bg-foreground/20 transition-colors cursor-pointer"
          title="Refresh profile data"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] block dark:hidden" />
          <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
        </button>

      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
