"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CHAIN_META: Record<string, { nameHe: string; logo: string }> = {
  RAMI_LEVY: { nameHe: "רמי לוי", logo: "/stores/rami_levy.png" },
  SHUFERSAL: { nameHe: "שופרסל", logo: "/stores/shufersal.png" },
  OSHER_AD: { nameHe: "אושר עד", logo: "/stores/osher_ad.png" },
  VICTORY: { nameHe: "ויקטורי", logo: "/stores/victory.png" },
  TIV_TAAM: { nameHe: "טיב טעם", logo: "/stores/tiv_taam.png" },
  YOCHANANOF: { nameHe: "יוחננוף", logo: "/stores/yochananof.png" },
};

const QUICK_ITEMS = [
  "chicken", "milk", "eggs", "bread", "cheese", "tomato", "rice", "olive oil",
  "butter", "onion", "potato", "ground beef",
];

const QUICK_ITEMS_HE: Record<string, string> = {
  chicken: "עוף", milk: "חלב", eggs: "ביצים", bread: "לחם",
  cheese: "גבינה", tomato: "עגבניות", rice: "אורז", "olive oil": "שמן זית",
  butter: "חמאה", onion: "בצל", potato: "תפוח אדמה", "ground beef": "בשר טחון",
};

interface StoreResult {
  chain: string;
  price: number;
  product: string | null;
  estimated: boolean;
}

interface PriceResult {
  name: string;
  basePrice: number;
  unit: string;
  stores: StoreResult[];
}

export default function PriceSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<PriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const search = useCallback(async (term: string) => {
    if (!term.trim() || term.length > 100) return;

    // Basic sanitization
    const clean = term.replace(/[<>"'`;]/g, "").trim();
    if (!clean) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/prices/ingredient?name=${encodeURIComponent(clean)}`);
      if (!res.ok) {
        setError(res.status === 404 ? "המוצר לא נמצא. נסו שם אחר." : "שגיאה בטעינת המחירים.");
        return;
      }
      const data: PriceResult = await res.json();
      setResult(data);
    } catch {
      setError("שגיאה בחיבור. נסו שוב.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[60]"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
        className="w-1120"
        style={{ marginTop: 70, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
      >
        <div style={{
          background: "var(--bg)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
          border: "1px solid var(--glass-border)",
          overflow: "hidden",
        }}>
          {/* Search bar */}
          <form onSubmit={handleSubmit} style={{
            display: "flex", alignItems: "center", gap: "var(--space-3)",
            padding: "var(--space-5) var(--space-6)",
            borderBottom: "1px solid var(--glass-border)",
          }}>
            <Search size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפשו מוצר... (חלב, עוף, ביצים, שמן זית)"
              maxLength={100}
              className="text-body"
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "var(--text)", fontFamily: "inherit", direction: "rtl",
              }}
            />
            {loading && <Loader2 size={18} className="animate-spin" style={{ color: "var(--accent)" }} />}
            <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <X size={20} style={{ color: "var(--text-muted)" }} />
            </button>
          </form>

          {/* Quick search pills */}
          {!result && !loading && !error && (
            <div style={{ padding: "var(--space-4) var(--space-6)" }}>
              <p className="text-caption c-muted" style={{ marginBottom: "var(--space-3)", fontWeight: 500 }}>חיפוש מהיר:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ITEMS.map((item) => (
                  <button
                    key={item}
                    onClick={() => { setQuery(item); search(item); }}
                    className="text-caption"
                    style={{
                      padding: "6px 14px", borderRadius: "var(--radius-pill)",
                      background: "var(--accent-10)", color: "var(--accent)",
                      border: "1px solid var(--accent-20)", cursor: "pointer",
                      fontFamily: "inherit", fontWeight: 600,
                      transition: "all 0.15s",
                    }}
                  >
                    {QUICK_ITEMS_HE[item] || item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ padding: "var(--space-6)", textAlign: "center" }}>
              <p className="text-body c-muted">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={{ padding: "var(--space-5) var(--space-6) var(--space-6)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                <h3 className="text-h3">{result.name}</h3>
                <span className="text-caption c-muted">({result.unit})</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {result.stores.map((store, i) => {
                  const meta = CHAIN_META[store.chain];
                  if (!meta) return null;
                  const isCheapest = i === 0;

                  return (
                    <div
                      key={store.chain}
                      style={{
                        display: "flex", alignItems: "center", gap: "var(--space-3)",
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-lg)",
                        background: isCheapest ? "var(--accent-10)" : i % 2 === 0 ? "var(--bg-secondary)" : "transparent",
                        border: isCheapest ? "1.5px solid var(--accent-20)" : "1.5px solid transparent",
                      }}
                    >
                      <Image src={meta.logo} alt={meta.nameHe} width={24} height={24} style={{ borderRadius: 6, objectFit: "contain" }} />
                      <span className="text-body-sm" style={{ flex: 1, fontWeight: isCheapest ? 700 : 500 }}>{meta.nameHe}</span>
                      {store.product && !store.estimated && (
                        <span className="text-caption c-dimmer" style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {store.product}
                        </span>
                      )}
                      <span className="text-body" style={{ fontWeight: 800, color: isCheapest ? "var(--accent)" : "var(--text)", fontVariantNumeric: "tabular-nums" }}>
                        &#8362;{store.price.toFixed(2)}
                      </span>
                      {isCheapest && <span className="badge" style={{ fontSize: 11 }}>הכי זול</span>}
                    </div>
                  );
                })}
              </div>

              {/* App CTA */}
              <div style={{ marginTop: "var(--space-5)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", background: "var(--accent-10)", textAlign: "center" }}>
                <p className="text-caption" style={{ fontWeight: 600, color: "var(--accent)", marginBottom: "var(--space-2)" }}>
                  רוצים להשוות בין כל 33 הרשתות? עם סריקת ברקוד?
                </p>
                <Link href="/download" onClick={onClose} className="btn btn-accent btn-sm">
                  הורידו את IsraBis
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
