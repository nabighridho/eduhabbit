"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  children: ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const containerNoMotion = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 250,
      damping: 22,
    },
  },
};

const itemNoMotion = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

export function DashboardShell({ children }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={reducedMotion ? containerNoMotion : containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function DashboardSection({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div variants={reducedMotion ? itemNoMotion : itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
