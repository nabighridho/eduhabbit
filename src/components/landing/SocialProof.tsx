"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCountUp } from "@/hooks/useCountUp";
import styles from "./SocialProof.module.css";

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const reducedMotion = useReducedMotion();
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const { count, elRef } = useCountUp(numericValue, 2);
  const suffix = value.replace(/[0-9]/g, "");

  const fadeUp = reducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      ref={elRef as any}
      className={styles.stat}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.value}>
        {count}
        {suffix}
      </div>
      <div className={styles.label}>{label}</div>
    </motion.div>
  );
}

export function SocialProof() {
  const t = useTranslations("landing.stats");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {[0, 1, 2, 3].map((i) => (
          <StatCard
            key={i}
            value={t(`items.${i}.value`)}
            label={t(`items.${i}.label`)}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
