import type { ReactNode } from "react";
import Link from "next/link";
import { AuthShapes } from "@/components/auth/AuthShapes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import styles from "./layout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <AuthShapes />
      <Link href="/" className={styles.backLink}>
        ← Back
      </Link>
      <div className={styles.themeBtn}>
        <ThemeToggle />
      </div>
      <div className={styles.card}>{children}</div>
    </div>
  );
}
