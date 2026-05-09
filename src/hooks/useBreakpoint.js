import { useState, useEffect } from "react";

export function useBreakpoint() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    isSmall:  width < 480,   // small phones, watches
    isMobile: width < 768,   // phones
    isTablet: width < 1024,  // tablets
  };
}
