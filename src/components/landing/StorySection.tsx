"use client";

import { motion, Variants, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./StorySection.module.css";

const ACCENT_COLORS = ["#FF6B6B", "#FFD93D", "#4ECDC4"];
const STATEMENTS_COUNT = 3;

function StatementCard({ index, heading, body }: { index: number; heading: string; body: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();
  const isReversed = index % 2 !== 0;

  return (
    <div
      ref={ref}
      className={`${styles.statement} ${isReversed ? styles.reversed : ""}`}
    >
      <motion.div
        className={styles.numberBlock}
        style={{ background: ACCENT_COLORS[index] }}
        initial={reducedMotion ? false : { scale: 0, rotate: isReversed ? 8 : -8 }}
        animate={inView && !reducedMotion ? { scale: 1, rotate: 0 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
        aria-hidden="true"
      >
        <span className={styles.stepNumber}>0{index + 1}</span>
      </motion.div>

      <div className={styles.textBlock}>
        <motion.h2
          initial={reducedMotion ? false : { opacity: 0, x: isReversed ? 40 : -40 }}
          animate={inView && !reducedMotion ? { opacity: 1, x: 0 } : undefined}
          transition={{ type: "spring", stiffness: 250, damping: 22, delay: 0.2 }}
        >
          {heading}
        </motion.h2>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 15 }}
          animate={inView && !reducedMotion ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {body}
        </motion.p>
      </div>
    </div>
  );
}

export function StorySection() {
  const t = useTranslations("landing.story");

  return (
    <section className={styles.storyContainer} id="how-it-works">
      <div className={styles.statementsWrapper}>
        {Array.from({ length: STATEMENTS_COUNT }, (_, i) => (
          <StatementCard
            key={i}
            index={i}
            heading={t(`items.${i}.heading`)}
            body={t(`items.${i}.body`)}
          />
        ))}
      </div>
    </section>
  );
}
