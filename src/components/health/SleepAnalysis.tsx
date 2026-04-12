"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { SleepAnalysis as SleepAnalysisType } from "@/db/schema";
import styles from "./SleepAnalysis.module.css";

interface SleepAnalysisProps {
  initialSleep: SleepAnalysisType | null;
  onSuccess: () => void;
}

function buildDatetimes(bedtime: string, wakeTime: string) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [bedH] = bedtime.split(":").map(Number);
  const [wakeH] = wakeTime.split(":").map(Number);

  const bedDate = bedH >= 12 ? yesterday : today;

  const sleepStart = new Date(bedDate);
  const [bH, bM] = bedtime.split(":").map(Number);
  sleepStart.setHours(bH, bM, 0, 0);

  const sleepEnd = new Date(today);
  const [wH, wM] = wakeTime.split(":").map(Number);
  sleepEnd.setHours(wH, wM, 0, 0);

  if (sleepEnd <= sleepStart) {
    sleepEnd.setDate(sleepEnd.getDate() + 1);
  }

  return {
    sleepStart: sleepStart.toISOString(),
    sleepEnd: sleepEnd.toISOString(),
    hours: ((sleepEnd.getTime() - sleepStart.getTime()) / (1000 * 60 * 60)).toFixed(1),
  };
}

export function SleepAnalysis({ initialSleep, onSuccess }: SleepAnalysisProps) {
  const t = useTranslations("health.sleep");
  const tErr = useTranslations("health.errors");
  const locale = useLocale();

  const [result, setResult] = useState<SleepAnalysisType | null>(initialSleep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bedtime, setBedtime] = useState("22:00");
  const [wakeTime, setWakeTime] = useState("07:00");

  const preview = buildDatetimes(bedtime, wakeTime);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { sleepStart, sleepEnd } = buildDatetimes(bedtime, wakeTime);

    try {
      const res = await fetch("/api/health/sleep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sleepStart, sleepEnd, locale }),
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
        <p className={styles.advice}>{result.analysis}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.timeRow}>
        <div className={styles.field}>
          <label className={styles.label}>{t("sleepStart")}</label>
          <input
            type="time"
            className={styles.input}
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            required
            disabled={loading}
          />
          <span className={styles.hint}>{t("lastNight")}</span>
        </div>

        <div className={styles.timeDivider}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{t("sleepEnd")}</label>
          <input
            type="time"
            className={styles.input}
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            required
            disabled={loading}
          />
          <span className={styles.hint}>{t("thisMorning")}</span>
        </div>
      </div>

      <div className={styles.durationBadge}>
        {preview.hours} {t("hours")}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : null}
        {t("submit")}
      </button>
    </form>
  );
}
