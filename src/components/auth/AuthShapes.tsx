"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./AuthShapes.module.css";

export function AuthShapes() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  const spring = { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <div className={styles.shapes}>
      <motion.div
        className={styles.circle}
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      />
      <motion.div
        className={styles.cross}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, ...spring }}
      />
      <motion.div
        className={styles.square}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 12 }}
        transition={{ delay: 0.6, ...spring }}
      />
      <motion.div
        className={styles.triangle}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ...spring }}
      />
      <motion.div
        className={styles.dot1}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, ...spring }}
      />
      <motion.div
        className={styles.dot2}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, ...spring }}
      />
      <motion.div
        className={styles.line}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.55, duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
