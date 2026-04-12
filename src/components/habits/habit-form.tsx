"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CustomSelect } from "@/components/ui/CustomSelect";
import styles from "./habit-form.module.css";

type HabitType = "exercise" | "work" | "fun" | "other";

interface HabitFormProps {
  onSuccess: (habit: { id: string; title: string; type: HabitType; active: boolean; userId: string; createdAt: Date }) => void;
  onCancel: () => void;
}

export function HabitForm({ onSuccess, onCancel }: HabitFormProps) {
  const t = useTranslations("habits");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<HabitType | "">("");
  const [errors, setErrors] = useState<{ title?: string; type?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: { title?: string; type?: string } = {};
    if (!title.trim()) errs.title = t("form.titleRequired");
    if (!type) errs.type = t("form.typeRequired");
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), type }),
    });
    setLoading(false);
    if (res.ok) {
      const newHabit = await res.json();
      onSuccess(newHabit);
    }
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.formTitle}>{t("addHabit")}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>{t("form.title")}</label>
          <input
            className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
            type="text"
            placeholder={t("form.titlePlaceholder")}
            value={title}
            onChange={e => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: undefined })); }}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t("form.type")}</label>
          <CustomSelect
            options={[
              { value: "exercise", label: t("types.exercise") },
              { value: "work", label: t("types.work") },
              { value: "fun", label: t("types.fun") },
              { value: "other", label: t("types.other") },
            ]}
            value={type}
            onChange={(v) => { setType(v as HabitType); setErrors(prev => ({ ...prev, type: undefined })); }}
            disabled={loading}
            accentColor="#4ECDC4"
          />
          {errors.type && <span className={styles.error}>{errors.type}</span>}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            {t("form.cancel")}
          </button>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {t("form.save")}
          </button>
        </div>
      </form>
    </div>
  );
}
