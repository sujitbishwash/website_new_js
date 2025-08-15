import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  applyColorTheme,
  ColorThemeName,
  getAvailableColorThemes,
} from "@/styles/theme";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const colorThemes = getAvailableColorThemes();
  const handleColorTheme = (name: ColorThemeName) => {
    applyColorTheme(name);
    localStorage.setItem("ap-color-theme", name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>

        <button
          onMouseDown={(e) => e.stopPropagation()}
          className="px-2 py-2 shadow-sm rounded-lg bg-background border border-divider hover:bg-foreground/20 transition-colors cursor-pointer"
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
