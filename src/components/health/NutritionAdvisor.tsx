"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { NutritionLog } from "@/db/schema";
import { CustomSelect } from "@/components/ui/CustomSelect";
import styles from "./NutritionAdvisor.module.css";

interface NutritionAdvisorProps {
  initialNutrition: NutritionLog | null;
  onSuccess: () => void;
}

export function NutritionAdvisor({ initialNutrition, onSuccess }: NutritionAdvisorProps) {
  const t = useTranslations("health.nutrition");
  const tErr = useTranslations("health.errors");
  const locale = useLocale();

  const [result, setResult] = useState<NutritionLog | null>(initialNutrition);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dietType, setDietType] = useState("normal");
  const [activityLevel, setActivityLevel] = useState("moderate");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/health/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietType, activityLevel, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(tErr("busy"));
        } else if (res.status === 503) {
          setError(tErr("unavailable"));
        } else {
          setError(data.error ?? tErr("failed"));
        }
        return;
      }

      setResult(data);
      onSuccess();
    } catch {
      setError(tErr("failed"));
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className={styles.resultCard}>
        <div className={styles.alreadyDone}>{t("alreadyDone")}</div>
        <h3 className={styles.resultTitle}>{t("result")}</h3>
        <p className={styles.advice}>{result.advice}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>{t("dietType")}</label>
        <CustomSelect
          options={["fasting", "diet", "normal"].map((opt) => ({
            value: opt,
            label: t(`dietOptions.${opt}`),
          }))}
          value={dietType}
          onChange={setDietType}
          disabled={loading}
          accentColor="#7CFF6B"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t("activityLevel")}</label>
        <CustomSelect
          options={["sedentary", "light", "moderate", "active", "very_active"].map((opt) => ({
            value: opt,
            label: t(`activityOptions.${opt}`),
          }))}
          value={activityLevel}
          onChange={setActivityLevel}
          disabled={loading}
          accentColor="#7CFF6B"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : null}
        {t("submit")}
      </button>
    </form>
  );
}
