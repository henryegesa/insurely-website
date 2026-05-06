import { useEffect, useRef } from "react";

export function useReveal(delayMs = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => el.classList.add("visible"), delayMs);
          obs.unobserve(el);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delayMs]);

  return ref;
}
