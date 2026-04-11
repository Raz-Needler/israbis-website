"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CHAIN_LOGOS: Record<string, string> = {
  RAMI_LEVY: "/stores/rami_levy.png",
  SHUFERSAL: "/stores/shufersal.png",
  OSHER_AD: "/stores/osher_ad.png",
  VICTORY: "/stores/victory.png",
  TIV_TAAM: "/stores/tiv_taam.png",
  YOCHANANOF: "/stores/yochananof.png",
  HAZI_HINAM: "/stores/hazi_hinam.png",
  MEGA: "/stores/mega.png",
  MACHSANEI_HASHUK: "/stores/machsanei_hashuk.png",
  YEINOT_BITAN: "/stores/yeinot_bitan.png",
};

const QUICK_ITEMS: { labelHe: string; searchTerm: string }[] = [
  { labelHe: "חלב 3%", searchTerm: "חלב 3" },
  { labelHe: "חזה עוף", searchTerm: "חזה עוף" },
  { labelHe: "ביצים", searchTerm: "ביצים" },
  { labelHe: "לחם", searchTerm: "לחם אחיד" },
  { labelHe: "גבינה צהובה", searchTerm: "גבינה צהובה" },
  { labelHe: "שמן זית", searchTerm: "שמן זית" },
  { labelHe: "אורז", searchTerm: "אורז" },
  { labelHe: "בשר טחון", searchTerm: "בשר טחון" },
  { labelHe: "חמאה", searchTerm: "חמאה" },
  { labelHe: "קוטג'", searchTerm: "קוטג" },
  { labelHe: "שוקולד", searchTerm: "שוקולד" },
  { labelHe: "קפה", searchTerm: "קפה" },
];

interface ChainInfo {
  key: string;
  nameHe: string;
  color: string;
  price: number;
  product: string;
}

interface Product {
  barcode: string;
  name: string;
  image: string | null;
  minPrice: number;
  maxPrice: number;
  savings: number;
  savingsPct: number;
  chainCount: number;
  chains: ChainInfo[];
}

type View = "search" | "products" | "detail";

export default function PriceSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [view, setView] = useState<View>("search");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Step 1: Search products by name
  const searchProducts = useCallback(async (term: string) => {
    if (!term.trim() || term.length > 100) return;
    const clean = term.replace(/[<>"'`;]/g, "").trim();
    if (!clean) return;

    setLoading(true);
    setError("");
    setProducts([]);
    setSelectedProduct(null);

    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(clean)}`);
      if (!res.ok) {
        setError(res.status === 503 ? "השירות לא זמין כרגע." : "לא נמצאו תוצאות. נסו חיפוש אחר.");
        setView("search");
        return;
      }
      const data = await res.json();
      if (!data.products?.length) {
        setError("לא נמצאו מוצרים. נסו חיפוש אחר.");
        setView("search");
        return;
      }
      setProducts(data.products);
      setView("products");
    } catch {
      setError("שגיאה בחיבור. נסו שוב.");
      setView("search");
    } finally {
      setLoading(false);
    }
  }, []);

  // Step 2: Select a product to see full price breakdown
  const selectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setView("detail");
  }, []);

  const goBack = useCallback(() => {
    if (view === "detail") {
      setSelectedProduct(null);
      setView("products");
    } else {
      setProducts([]);
      setError("");
      setView("search");
    }
  }, [view]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(query);
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
            {view !== "search" && (
              <button type="button" onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                <ArrowRight size={20} style={{ color: "var(--accent)" }} />
              </button>
            )}
            <Search size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפשו מוצר... (חלב, עוף, ביצים, שוקולד)"
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

          {/* ── VIEW: Quick search pills ── */}
          {view === "search" && !loading && !error && (
            <div style={{ padding: "var(--space-4) var(--space-6) var(--space-5)" }}>
              <p className="text-caption c-muted" style={{ marginBottom: "var(--space-3)", fontWeight: 500 }}>חיפוש מהיר:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ITEMS.map((item) => (
                  <button
                    key={item.searchTerm}
                    onClick={() => { setQuery(item.labelHe); searchProducts(item.searchTerm); }}
                    className="text-caption"
                    style={{
                      padding: "6px 14px", borderRadius: "var(--radius-pill)",
                      background: "var(--accent-10)", color: "var(--accent)",
                      border: "1px solid var(--accent-20)", cursor: "pointer",
                      fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s",
                    }}
                  >
                    {item.labelHe}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div style={{ padding: "var(--space-6)", textAlign: "center" }}>
              <p className="text-body c-muted">{error}</p>
            </div>
          )}

          {/* ── VIEW: Product list (Step 1 results) ── */}
          {view === "products" && products.length > 0 && (
            <div style={{ padding: "var(--space-3) var(--space-4) var(--space-5)" }}>
              <p className="text-caption c-muted" style={{ padding: "0 var(--space-2)", marginBottom: "var(--space-3)" }}>
                {products.length} מוצרים נמצאו — בחרו מוצר לצפייה במחירים:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {products.map((p) => (
                  <button
                    key={p.barcode}
                    onClick={() => selectProduct(p)}
                    style={{
                      display: "flex", alignItems: "center", gap: "var(--space-3)",
                      padding: "var(--space-3) var(--space-4)",
                      borderRadius: "var(--radius-lg)",
                      background: "var(--card)",
                      border: "1px solid var(--glass-border)",
                      cursor: "pointer", fontFamily: "inherit",
                      textAlign: "right", direction: "rtl",
                      transition: "all 0.15s",
                      width: "100%",
                    }}
                    className="hover:-translate-y-px"
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-20)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {/* Product image */}
                    {p.image ? (
                      <img src={p.image} alt={p.name} loading="lazy" width={48} height={48} style={{ borderRadius: "var(--radius-md)", objectFit: "contain", flexShrink: 0, background: "#fff" }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Search size={16} style={{ color: "var(--text-dimmer)" }} />
                      </div>
                    )}

                    {/* Product info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="text-body-sm" style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      <p className="text-caption c-muted">{p.chainCount} רשתות</p>
                    </div>

                    {/* Price range */}
                    <div style={{ textAlign: "left", flexShrink: 0 }}>
                      <p className="text-body-sm" style={{ fontWeight: 800, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>
                        &#8362;{p.minPrice.toFixed(2)}
                      </p>
                      {p.savings > 0 && (
                        <p className="text-caption" style={{ color: "var(--accent)", fontWeight: 600 }}>
                          -{p.savingsPct.toFixed(0)}%
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: "var(--space-4)", padding: "var(--space-3)", borderRadius: "var(--radius-lg)", background: "var(--accent-10)", textAlign: "center" }}>
                <p className="text-caption" style={{ fontWeight: 600, color: "var(--accent)" }}>
                  רוצים סריקת ברקוד ו-33 רשתות? הורידו את IsraBis
                </p>
              </div>
            </div>
          )}

          {/* ── VIEW: Price detail (Step 2 — selected product) ── */}
          {view === "detail" && selectedProduct && (
            <div style={{ padding: "var(--space-4) var(--space-6) var(--space-6)" }}>
              {/* Product header */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
                {selectedProduct.image ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} loading="lazy" width={64} height={64} style={{ borderRadius: "var(--radius-lg)", objectFit: "contain", background: "#fff" }} />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: "var(--radius-lg)", background: "var(--bg-secondary)" }} />
                )}
                <div>
                  <h3 className="text-h4">{selectedProduct.name}</h3>
                  <p className="text-caption c-muted">{selectedProduct.chainCount} רשתות &middot; ברקוד {selectedProduct.barcode}</p>
                </div>
              </div>

              {/* Chain prices */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {selectedProduct.chains
                  .sort((a, b) => a.price - b.price)
                  .map((chain, i) => {
                    const isCheapest = i === 0;
                    const logo = CHAIN_LOGOS[chain.key];

                    return (
                      <div
                        key={chain.key}
                        style={{
                          display: "flex", alignItems: "center", gap: "var(--space-3)",
                          padding: "var(--space-3) var(--space-4)",
                          borderRadius: "var(--radius-lg)",
                          background: isCheapest ? "var(--accent-10)" : i % 2 === 0 ? "var(--bg-secondary)" : "transparent",
                          border: isCheapest ? "1.5px solid var(--accent-20)" : "1.5px solid transparent",
                        }}
                      >
                        {logo ? (
                          <Image src={logo} alt={chain.nameHe} width={24} height={24} style={{ borderRadius: 6, objectFit: "contain" }} />
                        ) : (
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: chain.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>{chain.nameHe[0]}</span>
                          </div>
                        )}
                        <span className="text-body-sm" style={{ fontWeight: isCheapest ? 700 : 500, flex: 1 }}>{chain.nameHe}</span>
                        <span className="text-caption c-dimmer" style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {chain.product}
                        </span>
                        <span className="text-body" style={{ fontWeight: 800, color: isCheapest ? "var(--accent)" : "var(--text)", fontVariantNumeric: "tabular-nums" }}>
                          &#8362;{chain.price.toFixed(2)}
                        </span>
                        {isCheapest && <span className="badge" style={{ fontSize: 11 }}>הכי זול</span>}
                      </div>
                    );
                  })}
              </div>

              {/* Savings */}
              {selectedProduct.savings > 0 && (
                <div style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", background: "var(--accent-10)", textAlign: "center" }}>
                  <p className="text-body" style={{ fontWeight: 700, color: "var(--accent)" }}>
                    חוסכים &#8362;{selectedProduct.savings.toFixed(2)} ({selectedProduct.savingsPct.toFixed(0)}%)
                  </p>
                  <p className="text-caption c-muted" style={{ marginTop: 2 }}>בין הזול ליקר</p>
                </div>
              )}

              {/* App CTA */}
              <div style={{ marginTop: "var(--space-5)", textAlign: "center" }}>
                <Link href="/download" onClick={onClose} className="btn btn-accent btn-sm">
                  השוו בין כל 33 הרשתות באפליקציה
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
