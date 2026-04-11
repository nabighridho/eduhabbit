"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { LuChevronDown } from "react-icons/lu";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CTAButton } from "./CTAButton";
import styles from "./HeroSection.module.css";

export function HeroSection({ hasSession }: { hasSession: boolean }) {
  const t = useTranslations("landing.hero");
  const reducedMotion = useReducedMotion();

  const noMotion = { hidden: { opacity: 1 }, visible: { opacity: 1 } };

  const slamDown = reducedMotion
    ? noMotion
    : {
        hidden: { opacity: 0, y: -40, rotate: -3 },
        visible: { opacity: 1, y: 0, rotate: 0 },
      };

  const slideRight = reducedMotion
    ? noMotion
    : {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 },
      };

  const fadeUp = reducedMotion
    ? noMotion
    : {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      };

  const popIn = reducedMotion
    ? noMotion
    : {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      };

  const springTransition = { type: "spring" as const, stiffness: 300, damping: 20 };

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Each shape moves/rotates differently as you scroll
  const circleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const circleRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  const crossY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const crossRotate = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const squareY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const squareRotate = useTransform(scrollYProgress, [0, 1], [12, 200]);
  const squareScale = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  const triangleY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const triangleX = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section className={styles.hero} ref={heroRef} style={{ position: "relative" }}>
      {!reducedMotion && (
        <div className={styles.shapes}>
          <motion.div
            className={styles.shapeCircle}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            style={{ y: circleY, rotate: circleRotate, scale: circleScale }}
          />
          <motion.div
            className={styles.shapeCross}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.0, ...springTransition }}
            style={{ y: crossY, rotate: crossRotate }}
          />
          <motion.div
            className={styles.shapeSquare}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, ...springTransition }}
            style={{ y: squareY, rotate: squareRotate, scale: squareScale }}
          />
          <motion.div
            className={styles.shapeTriangle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, ...springTransition }}
            style={{ y: triangleY, x: triangleX }}
          />
        </div>
      )}

      <motion.div className={styles.content}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slamDown}
          transition={{ delay: 0.1, ...springTransition }}
          className={styles.badge}
        >
          {t("badge")}
        </motion.div>

        <motion.h1
          className={styles.title}
          initial="hidden"
          animate="visible"
          variants={slideRight}
          transition={{ delay: 0.25, ...springTransition }}
        >
          {t("title")}{" "}
          <motion.span
            className={styles.highlight}
            initial={reducedMotion ? undefined : { opacity: 0, scale: 0.5, rotate: -2 }}
            animate={reducedMotion ? undefined : { opacity: 1, scale: 1, rotate: -1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 15 }}
          >
            {t("titleHighlight")}
          </motion.span>
          .
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className={styles.ctaGroup}
          initial="hidden"
          animate="visible"
          variants={popIn}
          transition={{ delay: 0.55, ...springTransition }}
        >
          {hasSession ? (
            <CTAButton href="/dashboard" variant="primary">
              {t("ctaDashboard")}
            </CTAButton>
          ) : (
            <>
              <CTAButton href="/register" variant="primary">
                {t("ctaStart")}
              </CTAButton>
              <CTAButton href="/login" variant="secondary">
                {t("ctaSignIn")}
              </CTAButton>
            </>
          )}
        </motion.div>

        <motion.div
          className={styles.scrollHint}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>{t("scrollHint")}</span>
          <LuChevronDown size={20} className={styles.chevron} />
        </motion.div>
      </motion.div>
    </section>
  );
}
