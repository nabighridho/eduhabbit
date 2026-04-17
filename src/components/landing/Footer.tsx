"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  const t = useTranslations("landing.footer");
  return (
    <footer className={styles.footer} aria-label={t("ariaLabel")}>
      <div className={styles.container}>
        <div className={styles.top}>
          {/* Brand column */}
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <img src="/logo.png" alt="EduHabit" className={styles.logoImg} />
              <span>EduHabit</span>
            </div>
            <p className={styles.tagline}>{t("tagline")}</p>
          </div>

          {/* Product column — only Features */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>{t("product")}</h4>
            <Link href="#features" className={styles.link}>
              {t("features")}
            </Link>
          </div>

          {/* Get Started column */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>{t("getStarted")}</h4>
            <Link href="/login" className={styles.link}>
              {t("signIn")}
            </Link>
            <Link href="/register" className={styles.link}>
              {t("getStarted")}
            </Link>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>{t("copyright")}</p>
          <div className={styles.legalLinks}>
            <Link href="#" className={styles.legalLink}>
              {t("privacy")}
            </Link>
            <span className={styles.sep}>·</span>
            <Link href="#" className={styles.legalLink}>
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
