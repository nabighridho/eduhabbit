"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  children: ReactNode;
  index?: number;
  className?: string;
}

export function AnimatedCard({ children, index = 0, className }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 30, rotate: index % 2 === 0 ? -1 : 1 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.08,
      }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -3,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }
      }
    >
      {children}
    </motion.div>
  );
}
