"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./register.module.css";

export default function RegisterPage() {
  const t = useTranslations("auth.register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("errorPasswordMismatch"));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError(t("errorEmailTaken"));
        } else {
          setError(data.error ?? t("errorGeneric"));
        }
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("errorGeneric"));
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  }

  const spring = { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ ...spring, delay: 0.1 }}
      >
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...spring, delay: 0.2 }}
      >
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            {t("nameLabel")}
          </label>
          <input
            id="name"
            type="text"
            className={styles.input}
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            {t("emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            {t("passwordLabel")}
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            {t("confirmPasswordLabel")}
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={styles.input}
            placeholder={t("confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            disabled={isLoading}
            required
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? t("loadingButton") : t("submitButton")}
        </button>
      </motion.form>

      <motion.p
        className={styles.footer}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        {t("hasAccount")}
        <Link href="/login" className={styles.link}>
          {t("loginLink")}
        </Link>
      </motion.p>
    </>
  );
}
