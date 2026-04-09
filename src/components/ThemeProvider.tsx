"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type ThemeName = "snow" | "midnight" | "autumn" | "dusk";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "snow",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export const THEMES: Record<ThemeName, { label: string; accent: string; bg: string }> = {
  snow:     { label: "שלג",        accent: "#34C759", bg: "#FFFFFF" },
  midnight: { label: "לילה כחול",  accent: "#06B6D4", bg: "#080E1C" },
  autumn:   { label: "סתווי",      accent: "#E8773A", bg: "#FFF8F0" },
  dusk:     { label: "דמדומים",    accent: "#E8587A", bg: "#1A1423" },
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeName>("snow");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("israbis-theme") as ThemeName | null;
    if (saved && ["snow", "midnight", "autumn", "dusk"].includes(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("israbis-theme", newTheme);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
