"use client";

import Link from "next/link";
import { LuLoader } from "react-icons/lu";
import styles from "./CTAButton.module.css";

interface CTAButtonProps {
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
  loading?: boolean;
}

export function CTAButton({ href, variant, children, loading = false }: CTAButtonProps) {
  const className = `${styles.btn} ${variant === "primary" ? styles.primary : styles.secondary}`;

  return (
    <Link
      href={href}
      className={className}
      aria-disabled={loading}
      style={{ pointerEvents: loading ? "none" : "auto" }}
    >
      {loading ? (
        <>
          <LuLoader className={styles.spinner} size={20} />
          <span className={styles.loadingText}>Loading...</span>
        </>
      ) : (
        children
      )}
    </Link>
  );
}
