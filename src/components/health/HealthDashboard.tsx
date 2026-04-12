"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { MoodChecker } from "./MoodChecker";
import { SleepAnalysis } from "./SleepAnalysis";
import { NutritionAdvisor } from "./NutritionAdvisor";
import styles from "./HealthDashboard.module.css";
import type { Mood, SleepAnalysis as SleepAnalysisType, NutritionLog } from "@/db/schema";

interface HealthDashboardProps {
  initialMood: Mood | null;
  initialSleep: SleepAnalysisType | null;
  initialNutrition: NutritionLog | null;
}

type Tab = "mood" | "sleep" | "nutrition";

export function HealthDashboard({
  initialMood,
  initialSleep,
  initialNutrition,
}: HealthDashboardProps) {
  const t = useTranslations("health");
  const [activeTab, setActiveTab] = useState<Tab>("mood");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = () => {
    setToast(t("points"));
    setTimeout(() => setToast(null), 3000);
  };

  const tabs: { key: Tab; label: string; color: string }[] = [
    { key: "mood", label: t("mood.title"), color: "mood" },
    { key: "sleep", label: t("sleep.title"), color: "sleep" },
    { key: "nutrition", label: t("nutrition.title"), color: "nutrition" },
  ];

  const panelVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 22 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  };

  return (
    <div className={styles.wrapper}>
      {toast && <div className={`${styles.toast} ${styles[`toast_${activeTab}`]}`}>{toast}</div>}

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 22, delay: 0.1 }}
      >
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles[`tabActive_${tab.color}`] : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeTab === "mood" && (
                <MoodChecker initialMood={initialMood} onSuccess={showToast} />
              )}
              {activeTab === "sleep" && (
                <SleepAnalysis initialSleep={initialSleep} onSuccess={showToast} />
              )}
              {activeTab === "nutrition" && (
                <NutritionAdvisor initialNutrition={initialNutrition} onSuccess={showToast} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
