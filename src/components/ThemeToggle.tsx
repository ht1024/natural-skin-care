import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Dark is the default for every visitor (set before first paint by the script
// in index.html). A returning visitor who explicitly picked light mode gets
// the light palette. Adding/removing the "dark" class on <html> swaps every
// CSS variable in src/index.css.
export default function ThemeToggle({ onSolidBackground }: { onSolidBackground: boolean }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Colors follow the navbar's scroll state so the button stays consistent
  // with the links and logo around it in both themes.
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`p-2 rounded-full border transition-all duration-300 hover:scale-105 ${
        onSolidBackground
          ? "border-charcoal/20 text-charcoal hover:bg-charcoal/5"
          : "border-white/50 text-white hover:bg-white/10"
      }`}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
