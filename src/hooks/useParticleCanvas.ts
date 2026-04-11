"use client";

import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";

interface Particle {
  angle: number;
  maxR: number;
  speed: number;
  size: number;
  opacity: number;
}

const COUNT = 520;

export function useParticleCanvas(scrollProgress: MotionValue<number>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>(0);
  const mouse = useRef({ nx: 0.5, ny: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      buildParticles(w, h);
    };

    const buildParticles = (w: number, h: number) => {
      const diag = Math.hypot(w, h);
      particles.current = Array.from({ length: COUNT }, (_, i) => ({
        angle: (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.6,
        maxR: (0.35 + Math.random() * 0.68) * diag * 0.55,
        speed: 0.55 + Math.random() * 0.9,
        size: 0.3 + Math.random() * 1.3,
        opacity: 0.3 + Math.random() * 0.65,
      }));
    };

    const onMouse = (e: MouseEvent) => {
      mouse.current.nx = e.clientX / window.innerWidth;
      mouse.current.ny = e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouse, { passive: true });

    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);
    setSize();

    let t = 0;

    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      t += 0.012;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const p = scrollProgress.get();

      // Subtle mouse parallax on the origin
      const ox = (mouse.current.nx - 0.5) * w * 0.06;
      const oy = (mouse.current.ny - 0.5) * h * 0.06;
      const cx = w * 0.5 + ox;
      const cy = h * 0.5 + oy;

      // Clear to pure black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      for (const pt of particles.current) {
        // Ambient wobble + scroll-driven warp
        const ambient = 0.018 + Math.sin(t * 0.45 + pt.angle * 2.1) * 0.009;
        const r = (ambient + p * pt.speed) * pt.maxR;
        if (r < 0.5) continue;

        const streakLen = (p * 55 + 1.5) * pt.speed;
        const inner = Math.max(0, r - streakLen);

        const cosA = Math.cos(pt.angle);
        const sinA = Math.sin(pt.angle);

        const x2 = cx + cosA * r;
        const y2 = cy + sinA * r;
        const x1 = cx + cosA * inner;
        const y1 = cy + sinA * inner;

        // Hue shifts blue→indigo as particles travel outward
        const ratio = r / pt.maxR;
        const hue = 215 + ratio * 48;
        const lum = 75 + (1 - ratio) * 20;
        const alpha = Math.min(1, pt.opacity * ratio * 2.2);

        if (alpha < 0.02) continue;

        // Streak gradient: transparent → colored tip
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `hsla(${hue},70%,${lum}%,0)`);
        grad.addColorStop(1, `hsla(${hue},70%,${lum}%,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = pt.size;
        ctx.stroke();

        // Bright dot at tip
        ctx.beginPath();
        ctx.arc(x2, y2, pt.size * 0.75, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},80%,${lum + 18}%,${alpha})`;
        ctx.fill();
      }
    };

    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMouse);
      ro.disconnect();
    };
  }, [scrollProgress]);

  return canvasRef;
}
