"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./PageTransition.module.css";

interface Props {
  children: ReactNode;
}

export function PageTransition({ children }: Props) {
  const reducedMotion = useReducedMotion();
  const [done, setDone] = useState(reducedMotion);

  if (reducedMotion) return <>{children}</>;

  return (
    <div className={styles.wrapper}>
      <AnimatePresence>
        {!done && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className={styles.curtainTop}
              initial={{ y: 0 }}
              animate={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
            />
            <motion.div
              className={styles.curtainBottom}
              initial={{ y: 0 }}
              animate={{ y: "100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
              onAnimationComplete={() => setDone(true)}
            />

            <motion.div
              className={styles.brandMark}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35, ease: "easeIn", delay: 0.05 }}
            >
              <div className={styles.logoCircle} />
              <span className={styles.logoText}>EduHabit</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={done ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
