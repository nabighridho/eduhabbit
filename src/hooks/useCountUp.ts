"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 2.2) {
  const [count, setCount] = useState(0);
  const triggered = useRef(false);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = (now - start) / (duration * 1000);
            const eased = 1 - Math.pow(1 - Math.min(elapsed, 1), 3);
            setCount(Math.round(eased * target));
            if (elapsed < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, elRef };
}
