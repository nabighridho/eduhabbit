"use client";

import styles from "./DashboardMockup.module.css";

// Habit heatmap — 10 weeks × 7 days
const HEATMAP = Array.from({ length: 70 }, (_, i) => {
  const rand = Math.random();
  if (rand < 0.25) return 0;
  if (rand < 0.5)  return 1;
  if (rand < 0.75) return 2;
  if (rand < 0.9)  return 3;
  return 4;
});

const STATS = [
  { label: "Streak",  value: "47",   unit: "days",    color: "#f59e0b" },
  { label: "Habits",  value: "6/8",  unit: "today",   color: "#10b981" },
  { label: "Level",   value: "12",   unit: "Grandmaster", color: "#6366f1" },
  { label: "XP",      value: "18.4k",unit: "points",  color: "#3b82f6" },
];

const NAV_ITEMS = ["Dashboard", "Habits", "Health", "Finance", "Todos"];

export function DashboardMockup() {
  return (
    <div className={styles.browser} aria-hidden="true">
      {/* Browser chrome */}
      <div className={styles.chrome}>
        <div className={styles.dots}>
          <span className={styles.red}   />
          <span className={styles.amber} />
          <span className={styles.green} />
        </div>
        <div className={styles.addressBar}>
          <span className={styles.lock}>🔒</span>
          <span>eduhabit.app/dashboard</span>
        </div>
      </div>

      {/* App shell */}
      <div className={styles.app}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <span className={styles.logoIcon}>⚡</span>
          </div>
          {NAV_ITEMS.map((item, i) => (
            <div key={i} className={`${styles.navItem} ${i === 0 ? styles.active : ""}`}>
              <div className={styles.navBar} />
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          {/* Stat cards */}
          <div className={styles.statsRow}>
            {STATS.map((s, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statDot} style={{ background: s.color }} />
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className={styles.heatmapSection}>
            <div className={styles.heatmapLabel}>Habit Activity — Last 10 weeks</div>
            <div className={styles.heatmap}>
              {HEATMAP.map((level, i) => (
                <div
                  key={i}
                  className={styles.heatCell}
                  data-level={level}
                />
              ))}
            </div>
          </div>

          {/* Progress bar row */}
          <div className={styles.progressRow}>
            <div className={styles.progressCard}>
              <div className={styles.progressLabel}>Level 12 → 13</div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: "68%" }} />
              </div>
              <div className={styles.progressMeta}>18,400 / 27,000 XP</div>
            </div>
            <div className={styles.progressCard}>
              <div className={styles.progressLabel}>Savings Goal</div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: "43%", background: "#10b981" }} />
              </div>
              <div className={styles.progressMeta}>Rp 4.3M / Rp 10M</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
