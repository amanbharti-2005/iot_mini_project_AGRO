import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Load saved theme when app starts
  useEffect(() => {
    const savedTheme = localStorage.getItem("agro-theme");
    const initial = savedTheme || "light";

    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  // Toggle light/dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("agro-theme", newTheme);

    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
