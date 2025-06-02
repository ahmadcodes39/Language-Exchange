import React from "react";
import { useThemeStore } from "../Store/useThemeStore";
import { PaletteIcon } from "lucide-react"; // Removed Divide as it wasn't used
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* Dropdown trigger */}
      <button tabIndex={0} className="btn btn-circle btn-ghost">
        <PaletteIcon className="size-5" />
      </button>
      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-72 border border-base-content/10 max-h-72 overflow-y-auto"
      >
        <div className="space-y-1">
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                theme === themeOption.name
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-base-content/5"
              }`}
              onClick={() => setTheme(themeOption.name)}
            >
              <PaletteIcon className="size-4" />
              <span className="font-medium">{themeOption.name}</span>
              {/* Theme preview colors */}
              <div className="flex gap-1 ml-auto">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={`${themeOption.name}-color-${i}`} // More unique key
                    style={{ backgroundColor: color }}
                    className="w-3 h-3 rounded-full"
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;