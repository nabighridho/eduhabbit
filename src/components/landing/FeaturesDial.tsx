"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";
import { LuCalendarDays, LuListTodo, LuHeartHandshake, LuWallet, LuArrowRight } from "react-icons/lu";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./FeaturesDial.module.css";

const FEATURES = [
  { icon: LuCalendarDays, accent: "#C4B5FD", number: "01" },
  { icon: LuListTodo, accent: "#4ECDC4", number: "02" },
  { icon: LuHeartHandshake, accent: "#FF6B6B", number: "03" },
  { icon: LuWallet, accent: "#FFD93D", number: "04" },
];

export function FeaturesDial() {
  const t = useTranslations("landing.features");
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 72px", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      // Divide 0-1 into 4 segments. Adding a tiny offset to prevent jitter at boundary
      const index = Math.min(3, Math.max(0, Math.floor(latest * 4)));
      setActiveIndex(index);
    });
  }, [scrollYProgress]);

  // Rotate the entire dial wrapper from 40deg down to -50deg 
  // Let the 4 items be distributed evenly over a roughly 90 degree arc on the circle.
  // We'll place item 0 at -45 deg, item 1 at -15, item 2 at 15, item 3 at 45.
  // To bring item 0 (at -45) to center left (180 on a standard CSS circle), 
  // actually, since center left is just horizontal, let's treat "0 rotation" as pointing straight left.
  // Wait, `x = cos, y = sin`. 180 degrees is exactly left.
  // If we map:
  // Item 0 -> 180 - 45 = 135 deg
  // Item 1 -> 180 - 15 = 165 deg
  // Item 2 -> 180 + 15 = 195 deg
  // Item 3 -> 180 + 45 = 225 deg
  
  // To rotate the active item to exactly 180 deg (straight left):
  // When activeIndex=0, rotation should be 45 deg
  // When activeIndex=1, rotation should be 15 deg
  // When activeIndex=2, rotation should be -15 deg
  // When activeIndex=3, rotation should be -45 deg
  
  // Discrete rotation based on the active index
  // Rotation goes from 0, 30, 60, 90
  const currentRotation = activeIndex * 30;
  
  return (
    <section className={styles.dialSection} ref={containerRef} id="features">
      {/* Desktop Sticky View */}
      <div className={styles.stickyContainer}>
        <div className={styles.container}>
          {/* Left Panel */}
          <div className={styles.contentPanel}>
            <div className={styles.header}>
              <span className={styles.badge}>{t("badge")}</span>
              <h2 className={styles.heading}>{t("heading")}</h2>
              <p className={styles.subtitle}>{t("subtitle")}</p>
            </div>

            <div className={styles.activeContentContainer}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className={styles.activeContent}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className={styles.featureAccent} 
                    style={{ color: FEATURES[activeIndex].accent }}
                  >
                    {FEATURES[activeIndex].number}
                  </div>
                  <h3 className={styles.featureTitle}>
                    {t(`items.${activeIndex}.title`)}
                  </h3>
                  <p className={styles.featureBody}>
                    {t(`items.${activeIndex}.body`)}
                  </p>
                  <button 
                    className={styles.ctaButton} 
                    style={{ 
                      background: `${FEATURES[activeIndex].accent}15`, 
                      color: FEATURES[activeIndex].accent 
                    }}
                  >
                    Explore Feature <LuArrowRight />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel (Dial) */}
          <div className={styles.dialPanel}>
            <motion.div 
              className={styles.dialWrapper} 
              animate={{ rotate: reducedMotion ? 0 : currentRotation }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div className={styles.ring1} />
              <div className={styles.ring2} />
              <div className={styles.ring3} />

              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                const isActive = activeIndex === i;
                
                // Base angles: 180, 150, 120, 90
                // This queues items at the bottom so they come UP to center (180deg) as we scroll down
                const angleDeg = 180 - (i * 30);
                const angleRad = (angleDeg * Math.PI) / 180;
                
                // Ring radius where icons sit. Wrapper is 800x800 -> Radius 400.
                const radius = 300; 
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                return (
                  <motion.div 
                    key={i}
                    className={`${styles.node} ${isActive ? styles.active : ''}`}
                    style={{ x, y }}
                    animate={{
                      rotate: reducedMotion ? 0 : -currentRotation,
                      scale: isActive ? 1.5 : 1,
                      backgroundColor: isActive ? feature.accent : undefined,
                      borderColor: isActive ? feature.accent : undefined,
                      boxShadow: isActive ? `0 0 30px ${feature.accent}80` : undefined,
                      opacity: isActive ? 1 : 0.6
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <Icon size={isActive ? 24 : 20} />
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Fallback View (Scrollable List) */}
      <div className={styles.mobileFallback}>
        <div className={styles.header}>
          <span className={styles.badge}>{t("badge")}</span>
          <h2 className={styles.heading}>{t("heading")}</h2>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </div>
        
        <div className={styles.mobileGrid}>
          {FEATURES.map((f, i) => {
             const Icon = f.icon;
             return (
               <motion.div 
                 key={i} 
                 className={styles.mobileCard}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
               >
                 <div className={styles.mobileIcon} style={{ background: `${f.accent}20`, color: f.accent }}>
                   <Icon size={24} />
                 </div>
                 <h3 className={styles.mobileTitle}>{t(`items.${i}.title`)}</h3>
                 <p className={styles.mobileBody}>{t(`items.${i}.body`)}</p>
               </motion.div>
             )
          })}
        </div>
      </div>
    </section>
  );
}
