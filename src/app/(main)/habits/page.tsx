import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { HabitList } from "@/components/habits/habit-list";
import { PageTransition } from "@/components/dashboard/PageTransition";
import styles from "./page.module.css";

export default async function HabitsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const t = await getTranslations("habits");
  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleAccent}>{t("title")}</span>
          </h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </div>
        <HabitList />
      </div>
    </PageTransition>
  );
}
