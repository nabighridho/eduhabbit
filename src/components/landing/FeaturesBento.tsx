"use client";

import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { LuListTodo, LuHeartHandshake, LuWallet, LuCalendarDays } from "react-icons/lu";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./FeaturesBento.module.css";

const FEATURES = [
  { icon: LuCalendarDays, iconClass: "purpleIcon", cardClass: "largeCard" },
  { icon: LuListTodo, iconClass: "blueIcon", cardClass: undefined },
  { icon: LuHeartHandshake, iconClass: "greenIcon", cardClass: undefined },
  { icon: LuWallet, iconClass: "yellowIcon", cardClass: "wideCard" },
];

const ROTATIONS = [-1.5, 1, -0.8, 1.2];

function FeatureCard({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();
  const t = useTranslations("landing.features");

  const feature = FEATURES[index];
  const Icon = feature.icon;

  const cardClassName = [
    styles.card,
    feature.cardClass ? styles[feature.cardClass] : "",
  ]
    .filter(Boolean)
    .join(" ");
  const iconClassName = [
    styles.iconWrapper,
    feature.iconClass ? styles[feature.iconClass] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const spring = { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <motion.div
      ref={ref}
      className={cardClassName}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.85, rotate: ROTATIONS[index] * 2 }}
      animate={
        inView && !reducedMotion
          ? { opacity: 1, scale: 1, rotate: 0 }
          : undefined
      }
      transition={{ ...spring, delay: index * 0.1 }}
      role="listitem"
      tabIndex={0}
    >
      <div className={styles.cardHeader}>
        <motion.div
          className={iconClassName}
          aria-hidden="true"
          initial={reducedMotion ? false : { scale: 0, rotate: -90 }}
          animate={inView && !reducedMotion ? { scale: 1, rotate: 0 } : undefined}
          transition={{ ...spring, delay: index * 0.1 + 0.15 }}
        >
          <Icon size={24} />
        </motion.div>
        <motion.h3
          initial={reducedMotion ? false : { opacity: 0, x: -20 }}
          animate={inView && !reducedMotion ? { opacity: 1, x: 0 } : undefined}
          transition={{ ...spring, delay: index * 0.1 + 0.2 }}
        >
          {t(`items.${index}.title`)}
        </motion.h3>
      </div>
      <motion.p
        className={styles.cardBody}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={inView && !reducedMotion ? { opacity: 1 } : undefined}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
      >
        {t(`items.${index}.body`)}
      </motion.p>
    </motion.div>
  );
}

export function FeaturesBento() {
  const t = useTranslations("landing.features");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reducedMotion = useReducedMotion();

  return (
    <section className={styles.bentoSection} id="features">
      <div className={styles.container}>
        <div className={styles.header} ref={ref}>
          <motion.span
            className={styles.badge}
            initial={reducedMotion ? false : { opacity: 0, y: -20, rotate: -3 }}
            animate={inView && !reducedMotion ? { opacity: 1, y: 0, rotate: 0 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            {t("badge")}
          </motion.span>
          <motion.h2
            initial={reducedMotion ? false : { opacity: 0, x: -40 }}
            animate={inView && !reducedMotion ? { opacity: 1, x: 0 } : undefined}
            transition={{ type: "spring", stiffness: 250, damping: 22, delay: 0.1 }}
          >
            {t("heading")}
          </motion.h2>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            animate={inView && !reducedMotion ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className={styles.grid} role="list">
          {FEATURES.map((_, i) => (
            <FeatureCard key={i} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
