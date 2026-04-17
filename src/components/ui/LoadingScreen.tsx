"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LoadingScreen.module.css";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Only show once per session
    const hasLoaded = sessionStorage.getItem("eduhabit-loaded");
    if (hasLoaded) {
      setVisible(false);
      setShouldRender(false);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      // Simulate loading with easing
      const remaining = 100 - current;
      const increment = Math.max(0.5, remaining * 0.06 + Math.random() * 2);
      current = Math.min(100, current + increment);
      setProgress(Math.round(current));

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem("eduhabit-loaded", "true");
        }, 400);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setShouldRender(false), 800);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.content}>
            {/* Logo */}
            <motion.div
              className={styles.logoWrapper}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <img src="/logo.png" alt="EduHabit" className={styles.logo} />
            </motion.div>

            {/* Brand name */}
            <motion.h1
              className={styles.brandName}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Edu<span className={styles.brandAccent}>Habit</span>
            </motion.h1>

            {/* Progress section */}
            <motion.div
              className={styles.progressSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.progressTrack}>
                <motion.div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={styles.progressInfo}>
                <span className={styles.progressLabel}>Loading</span>
                <span className={styles.progressPercent}>{progress}%</span>
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className={styles.decorCircle1} />
          <div className={styles.decorCircle2} />
          <div className={styles.decorSquare} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
