"use client";

import { useTranslations } from "next-intl";
import styles from "./SkipNav.module.css";

export function SkipNav() {
  const t = useTranslations("landing");

  return (
    <a href="#main-content" className={styles.skipNav}>
      {t("skipNav")}
    </a>
  );
}
