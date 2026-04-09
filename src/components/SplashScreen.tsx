"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shown = sessionStorage.getItem("israbis-splash");
    if (!shown) {
      setVisible(true);
      sessionStorage.setItem("israbis-splash", "1");
      const timer = setTimeout(() => setVisible(false), 2200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Glow orbs */}
          <div className="glow" style={{ display: "block", width: 300, height: 300, top: -80, right: -80, background: "var(--accent)", opacity: 0.1 }} />
          <div className="glow" style={{ display: "block", width: 200, height: 200, bottom: -60, left: -40, background: "var(--secondary)", opacity: 0.06, animationDelay: "1.5s" }} />

          {/* Orbiting SVGs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
            className="absolute splash-orbit"
            style={{ top: "15%", left: "10%", width: 70, height: 70 }}
          >
            <Image src="/svg/composition_3.svg" alt="" width={70} height={70} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 100 }}
            className="absolute splash-orbit"
            style={{ bottom: "18%", right: "8%", width: 60, height: 60, animationDelay: "1s" }}
          >
            <Image src="/svg/composition_7.svg" alt="" width={60} height={60} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring", stiffness: 100 }}
            className="absolute splash-orbit hidden md:block"
            style={{ top: "60%", left: "75%", width: 50, height: 50, animationDelay: "2s" }}
          >
            <Image src="/svg/composition_12.svg" alt="" width={50} height={50} />
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
          >
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={140} height={56} priority />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
