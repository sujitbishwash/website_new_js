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

export function AccentToggle() {
  const { setTheme } = useTheme();
  const colorThemes = getAvailableColorThemes();
  const handleColorTheme = (name: ColorThemeName) => {
    applyColorTheme(name);
    localStorage.setItem("ap-color-theme", name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="h-px my-1 bg-border" />
        {colorThemes.map((name) => (
          <DropdownMenuItem key={name} onClick={() => handleColorTheme(name)}>
            Color: {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
