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
  palettes,
} from "@/styles/theme";

export function AccentToggle() {
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
          <span className="">{localStorage.getItem("ap-color-theme")}</span>
          <div className={``} style={{
                    backgroundColor:"salmon",
                  }}>sdd</div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {colorThemes.map((name) => (
          <DropdownMenuItem key={name} onClick={() => handleColorTheme(name)}>
           {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
