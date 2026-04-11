"use client";

import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./CTASection.module.css";

export function CTASection({ hasSession }: { hasSession: boolean }) {
  const t = useTranslations("landing.cta");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reducedMotion = useReducedMotion();

  const spring = { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <section className={styles.ctaContainer}>
      <motion.div
        ref={ref}
        className={styles.content}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.9, rotate: -2 }}
        animate={inView && !reducedMotion ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
        transition={{ ...spring, delay: 0.1 }}
      >
        <motion.h2
          initial={reducedMotion ? false : { opacity: 0, y: -30 }}
          animate={inView && !reducedMotion ? { opacity: 1, y: 0 } : undefined}
          transition={{ ...spring, delay: 0.25 }}
        >
          {t("heading")}
        </motion.h2>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={inView && !reducedMotion ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {t("body")}
        </motion.p>

        <motion.div
          className={styles.btnWrapper}
          initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.8 }}
          animate={inView && !reducedMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.5 }}
        >
          {hasSession ? (
            <Link href="/dashboard" className={styles.primaryBtn}>
              {t("ctaDashboard")}
            </Link>
          ) : (
            <Link href="/register" className={styles.primaryBtn}>
              {t("ctaStart")}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
