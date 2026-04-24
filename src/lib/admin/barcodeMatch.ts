/**
 * Barcode matching + Hebrew product-name scoring.
 *
 * Ported from Worldbite's backend/src/services/locationPriceService.js and
 * backend/src/config/produceCanonical.js so the admin can tell the same
 * "this product at chain X is the same product at chain Y" story the mobile
 * app tells. No MeiliSearch dependency — we use the same scoring heuristic
 * that Worldbite uses as a DB-only fallback path.
 */

// Known product-type words in Hebrew. A product name's "core word" is the
// first word in this set (or an alias below).
const PRODUCT_TYPES = new Set<string>([
  'חלב', 'לחם', 'חלה', 'פיתה', 'חמאה', 'ביצים', 'גבינה', 'יוגורט', 'שמנת',
  'שמן', 'שמן זית', 'חומץ', 'מיונז', 'קטשופ', 'חרדל', 'טחינה', 'זעתר',
  'סוכר', 'קמח', 'מלח', 'אורז', 'פסטה', 'קוסקוס', 'פתיתים', 'אטריות',
  'עוף', 'בשר', 'דג', 'נקניק', 'סלמון', 'טונה',
  'מים', 'מיץ', 'בירה', 'יין', 'קולה', 'סודה',
  'שוקולד', 'עוגיות', 'ביסקוויט', 'חטיף', 'במבה',
  'קפה', 'תה', 'קקאו',
  'ריבה', 'דבש', 'חלבה', 'ממרח',
  'עגבניות', 'מלפפון', 'בצל', 'שום', 'גזר', 'חסה', 'פטרוזיליה',
  'תפוח', 'בננה', 'תפוז', 'לימון', 'אבוקדו',
  'סבון', 'שמפו', 'נייר',
  'קרואסון', 'באגט', 'טורטיה', 'מצה', 'קרקר',
  'גלידה', 'קונפיטורה', 'סילאן',
  'וופל', 'עוגה', 'עוגיה',
  'מרק', 'תבלין', 'פפריקה', 'כורכום', 'כמון', 'קינמון',
  'שעועית', 'עדשים', 'חומוס', 'תירס',
]);

const TYPE_ALIASES: Record<string, string> = {
  'אורזו': 'אורז', 'נודלס': 'אטריות', 'פתיתי': 'פתיתים', 'ספגטי': 'פסטה',
  'באגטון': 'לחם', 'טוסט': 'לחם',
  'עוגיה': 'עוגיות', 'ביסקויט': 'ביסקוויט',
};

const TWO_WORD_TYPES = new Set<string>([
  'שמן זית', 'תפוח אדמה', 'חלב עיזים', 'גבינה צהובה', 'גבינה לבנה',
  'לחם אחיד', 'לחם קל', 'עגבניות שרי',
]);

/**
 * Strip suffixes that don't distinguish a product ("טרי", "במשקל", ק"ג).
 * Normalize gershayim and whitespace.
 */
export function normalizeProductName(name: string | null | undefined): string {
  if (!name) return '';
  let n = name.trim().toLowerCase();
  n = n.replace(/[״''`]/g, '"');
  n = n.replace(/\s*(טרי|טריה|במשקל|ק"ג|קילו|ארוז)\s*/g, ' ');
  n = n.replace(/\s+/g, ' ').trim();
  return n;
}

/**
 * Extract the "core word" that identifies a product's type.
 * Returns null if nothing recognizable.
 */
export function extractCoreWord(productName: string): string | null {
  const norm = normalizeProductName(productName);
  if (!norm) return null;
  const words = norm.split(/\s+/).filter(w => w.length > 1 && !/^\d/.test(w));

  // 1. Two-word type match (e.g. "שמן זית")
  for (let i = 0; i < words.length - 1; i++) {
    const combo = `${words[i]} ${words[i + 1]}`;
    if (TWO_WORD_TYPES.has(combo)) return combo;
  }

  // 2. Single-word type match
  const known = words.find(w => PRODUCT_TYPES.has(w) || TYPE_ALIASES[w]);
  if (known) return TYPE_ALIASES[known] ?? known;

  // 3. First word fallback (if long enough)
  const first = words[0];
  return first && first.length >= 2 ? first : null;
}

/**
 * Size extractor: pulls a numeric quantity + unit from the name.
 * Returns { size, unit } or null.
 */
export function extractSize(name: string): { size: number; unit: string } | null {
  const m = name.match(/(\d+)\s*(גרם|גר|מ"ל|מ״ל|ליטר|ק"ג|ק״ג|יח)/);
  if (!m) return null;
  return { size: parseInt(m[1], 10), unit: m[2] };
}

/**
 * Worldbite's candidate scoring algorithm. Returns a score indicating how
 * likely `candidate` is the same product as `target`.
 *   +6: candidate starts with target's core word
 *   +1: candidate contains core word mid-string
 *   -3: core word embedded in another word (substring pollution)
 *   +2: size within ±20%; +1 if within ±50%
 *   +N: up to +2 for each additional brand/descriptor word that matches
 *   -1: candidate price > 2× reference price (likely a different product tier)
 *
 * Accept the match if score >= 2.
 */
export interface Candidate {
  productName: string;
  priceNIS: number;
  barcode?: string;
}
export interface ScoreContext {
  coreWord: string;
  targetName: string;
  targetSize: number | null;
  referencePrice?: number | null;
}

export function scoreCandidate(candidate: Candidate, ctx: ScoreContext): number {
  const cName = normalizeProductName(candidate.productName);
  const target = normalizeProductName(ctx.targetName);
  let score = 0;

  const coreWord = ctx.coreWord.toLowerCase();
  const coreStart = cName.startsWith(coreWord) || cName.startsWith(coreWord.split(' ')[0]);
  if (coreStart) score += 6;
  else if (cName.includes(' ' + coreWord)) score += 1;
  else if (cName.includes(coreWord)) score -= 3;

  if (ctx.targetSize) {
    const m = cName.match(/(\d+)/);
    if (m) {
      const ratio = parseInt(m[1], 10) / ctx.targetSize;
      if (ratio >= 0.8 && ratio <= 1.2) score += 2;
      else if (ratio >= 0.5 && ratio <= 2.0) score += 1;
    }
  }

  const origWords = target.split(/\s+/).filter(w => w.length > 2 && !/^\d/.test(w) && w !== coreWord);
  const matchingWords = origWords.filter(w => cName.includes(w));
  score += Math.min(matchingWords.length, 2);

  if (ctx.referencePrice != null && candidate.priceNIS > ctx.referencePrice * 2) {
    score -= 1;
  }

  return score;
}

export const ACCEPTANCE_THRESHOLD = 2;
