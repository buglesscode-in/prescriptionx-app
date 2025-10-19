// src/context/ThemeProvider.tsx

import { useState, useEffect, ReactNode } from "react";
import { ThemeContext } from "./theme-definitions";

type Theme = "dark" | "light" | "system";

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) => {
  // Use localStorage to persist the user's choice
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem("vite-ui-theme") as Theme) || defaultTheme
  );

  // Function to apply the theme class to the document body
  const applyTheme = (currentTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const effectiveTheme =
      currentTheme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : currentTheme;

    root.classList.add(effectiveTheme);
  };

  useEffect(() => {
    applyTheme(theme);
    // Save the user's explicit choice
    localStorage.setItem("vite-ui-theme", theme);
  }, [theme]);

  // Also run effect on system changes if theme is "system"
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: setThemeState,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
