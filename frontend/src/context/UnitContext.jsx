import { createContext, useContext, useEffect, useState } from "react";

const UnitContext = createContext(null);

export function UnitProvider({ children }) {
  const [unit, setUnit] = useState(() => localStorage.getItem("skyline-unit") || "C");

  useEffect(() => {
    localStorage.setItem("skyline-unit", unit);
  }, [unit]);

  const toggleUnit = () => setUnit((u) => (u === "C" ? "F" : "C"));

  // Convert a Celsius value into the currently selected unit and round it.
  const convert = (celsius) => {
    if (celsius == null || Number.isNaN(celsius)) return "--";
    const value = unit === "C" ? celsius : celsius * (9 / 5) + 32;
    return Math.round(value);
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit, convert }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error("useUnit must be used within a UnitProvider");
  return ctx;
}
