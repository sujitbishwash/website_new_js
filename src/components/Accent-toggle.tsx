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
import { useState } from "react";

export function AccentToggle() {
  const colorThemes = getAvailableColorThemes();
  const [themeName, setThemeName] = useState<ColorThemeName>(
    (localStorage.getItem("ap-color-theme") as ColorThemeName) || "slate"
  );
  const handleColorTheme = (name: ColorThemeName) => {
    applyColorTheme(name);
    localStorage.setItem("ap-color-theme", name);
    setThemeName(name);
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
          <div
            className="rounded-full w-4 h-4"
            style={{
              backgroundColor:
                palettes[themeName]?.buttonGradientFrom ||
                palettes.slate.buttonGradientFrom,
            }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {colorThemes.map((name) => (
          <DropdownMenuItem key={name} onClick={() => handleColorTheme(name)}>
            <div className="flex items-center justify-between w-full">
              <span>{name}</span>
              <div
                className="rounded-full w-4 h-4"
                style={{
                  backgroundColor:
                    palettes[name]?.buttonGradientFrom ||
                    palettes.slate.buttonGradientFrom,
                }}
              />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
