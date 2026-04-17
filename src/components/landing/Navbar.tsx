"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LuMenu, LuX } from "react-icons/lu";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import styles from "./Navbar.module.css";

export function Navbar({ hasSession }: { hasSession: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const t = useTranslations("landing.nav");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const navVariants = reducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } };

  const menuVariants = reducedMotion
    ? { closed: { display: "none" }, open: { display: "flex" } }
    : {
        closed: { opacity: 0, height: 0, display: "none" },
        open: { opacity: 1, height: "auto", display: "flex" },
      };

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="EduHabit" className={styles.logoImg} />
          <span>EduHabit</span>
        </Link>

        {/* Desktop nav links */}
        <div className={styles.navLinks}>
          <button type="button" className={styles.navLink} onClick={() => scrollTo("features")}>
            {t("features")}
          </button>
          <button type="button" className={styles.navLink} onClick={() => scrollTo("how-it-works")}>
            {t("howItWorks")}
          </button>
        </div>

        {/* Desktop actions */}
        <div className={styles.actions}>
          <LocaleSwitcher />
          <ThemeToggle />
          {hasSession ? (
            <Link href="/dashboard" className={styles.primaryBtn}>
              {t("dashboard")}
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.signInLink}>
                {t("signIn")}
              </Link>
              <Link href="/register" className={styles.primaryBtn}>
                {t("getStarted")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
        >
          {menuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button type="button" className={styles.mobileLink} onClick={() => scrollTo("features")}>
              {t("features")}
            </button>
            <button type="button" className={styles.mobileLink} onClick={() => scrollTo("how-it-works")}>
              {t("howItWorks")}
            </button>
            <div className={styles.mobileDivider} />
            <div className={styles.mobileControls}>
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <div className={styles.mobileDivider} />
            {hasSession ? (
              <Link href="/dashboard" className={styles.mobileCTA}>
                {t("dashboard")}
              </Link>
            ) : (
              <>
                <Link href="/login" className={styles.mobileLink}>
                  {t("signIn")}
                </Link>
                <Link href="/register" className={styles.mobileCTA}>
                  {t("getStarted")}
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
