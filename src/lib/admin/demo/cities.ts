/**
 * Real Israeli cities with accurate lat/lng centroids and demographic weighting.
 * Used to give demo users a plausible geographic distribution — NOT encrypted,
 * because demo user locations are synthetic and marked via `locationCity` only.
 *
 * Weight = rough population share (from CBS data) + strategic importance for
 * supermarket positioning stories (Bnei Brak weighted heavy for mehadrin demos).
 */

export interface IsraeliCity {
  nameHe: string;
  nameEn: string;
  lat: number;
  lng: number;
  region: 'center' | 'tel-aviv' | 'jerusalem' | 'north' | 'south' | 'sharon' | 'haifa' | 'shfela';
  cultureFit: Array<'mainstream' | 'religious' | 'mehadrin' | 'haredi' | 'secular' | 'russian' | 'periphery' | 'premium'>;
  weight: number;
}

export const ISRAELI_CITIES: IsraeliCity[] = [
  { nameHe: 'תל אביב-יפו', nameEn: 'Tel Aviv-Yafo',  lat: 32.0853, lng: 34.7818, region: 'tel-aviv', cultureFit: ['secular', 'premium', 'mainstream'], weight: 8 },
  { nameHe: 'ירושלים',     nameEn: 'Jerusalem',       lat: 31.7683, lng: 35.2137, region: 'jerusalem', cultureFit: ['religious', 'mehadrin', 'haredi', 'mainstream'], weight: 10 },
  { nameHe: 'חיפה',        nameEn: 'Haifa',            lat: 32.7940, lng: 34.9896, region: 'haifa',    cultureFit: ['mainstream', 'russian', 'secular'],  weight: 6 },
  { nameHe: 'ראשון לציון', nameEn: 'Rishon LeZion',   lat: 31.9730, lng: 34.8066, region: 'center',   cultureFit: ['mainstream', 'secular'],             weight: 5 },
  { nameHe: 'פתח תקווה',   nameEn: 'Petah Tikva',     lat: 32.0870, lng: 34.8878, region: 'center',   cultureFit: ['mainstream', 'religious'],           weight: 5 },
  { nameHe: 'אשדוד',       nameEn: 'Ashdod',           lat: 31.8044, lng: 34.6553, region: 'south',    cultureFit: ['mainstream', 'russian', 'religious'],weight: 5 },
  { nameHe: 'נתניה',       nameEn: 'Netanya',          lat: 32.3215, lng: 34.8532, region: 'sharon',   cultureFit: ['mainstream', 'russian'],             weight: 5 },
  { nameHe: 'באר שבע',     nameEn: 'Beer Sheva',       lat: 31.2518, lng: 34.7915, region: 'south',    cultureFit: ['mainstream', 'periphery'],           weight: 5 },
  { nameHe: 'בני ברק',     nameEn: 'Bnei Brak',        lat: 32.0809, lng: 34.8338, region: 'tel-aviv', cultureFit: ['haredi', 'mehadrin'],                weight: 7 },
  { nameHe: 'חולון',       nameEn: 'Holon',            lat: 32.0169, lng: 34.7722, region: 'tel-aviv', cultureFit: ['mainstream', 'secular'],             weight: 4 },
  { nameHe: 'רמת גן',      nameEn: 'Ramat Gan',        lat: 32.0680, lng: 34.8244, region: 'tel-aviv', cultureFit: ['mainstream', 'premium', 'secular'],  weight: 4 },
  { nameHe: 'אשקלון',      nameEn: 'Ashkelon',         lat: 31.6688, lng: 34.5743, region: 'south',    cultureFit: ['mainstream', 'russian'],             weight: 4 },
  { nameHe: 'רחובות',      nameEn: 'Rehovot',          lat: 31.8947, lng: 34.8089, region: 'shfela',   cultureFit: ['mainstream', 'religious'],           weight: 4 },
  { nameHe: 'בת ים',       nameEn: 'Bat Yam',          lat: 32.0171, lng: 34.7448, region: 'tel-aviv', cultureFit: ['mainstream', 'russian'],             weight: 3 },
  { nameHe: 'בית שמש',     nameEn: 'Beit Shemesh',     lat: 31.7497, lng: 34.9887, region: 'jerusalem', cultureFit: ['haredi', 'mehadrin', 'religious'],  weight: 4 },
  { nameHe: 'כפר סבא',     nameEn: 'Kfar Saba',        lat: 32.1751, lng: 34.9068, region: 'sharon',   cultureFit: ['mainstream', 'premium', 'secular'],  weight: 3 },
  { nameHe: 'הרצליה',      nameEn: 'Herzliya',         lat: 32.1663, lng: 34.8404, region: 'sharon',   cultureFit: ['premium', 'mainstream'],             weight: 3 },
  { nameHe: 'חדרה',        nameEn: 'Hadera',           lat: 32.4365, lng: 34.9196, region: 'sharon',   cultureFit: ['mainstream', 'russian'],             weight: 3 },
  { nameHe: 'מודיעין',     nameEn: 'Modiin',           lat: 31.8930, lng: 35.0104, region: 'center',   cultureFit: ['mainstream', 'religious', 'premium'],weight: 3 },
  { nameHe: 'רעננה',       nameEn: 'Ra\'anana',        lat: 32.1848, lng: 34.8713, region: 'sharon',   cultureFit: ['premium', 'mainstream'],             weight: 3 },
  { nameHe: 'קריית גת',    nameEn: 'Kiryat Gat',       lat: 31.6100, lng: 34.7642, region: 'south',    cultureFit: ['mainstream', 'periphery'],           weight: 2 },
  { nameHe: 'נהריה',       nameEn: 'Nahariya',         lat: 33.0073, lng: 35.0981, region: 'north',    cultureFit: ['mainstream', 'russian'],             weight: 2 },
  { nameHe: 'טבריה',       nameEn: 'Tiberias',         lat: 32.7964, lng: 35.5310, region: 'north',    cultureFit: ['mainstream', 'religious'],           weight: 2 },
  { nameHe: 'צפת',         nameEn: 'Tsfat',            lat: 32.9650, lng: 35.4951, region: 'north',    cultureFit: ['religious', 'mehadrin', 'haredi'],   weight: 2 },
  { nameHe: 'אילת',        nameEn: 'Eilat',            lat: 29.5581, lng: 34.9482, region: 'south',    cultureFit: ['mainstream', 'periphery', 'secular'],weight: 2 },
  { nameHe: 'רמלה',        nameEn: 'Ramla',            lat: 31.9290, lng: 34.8667, region: 'center',   cultureFit: ['mainstream', 'periphery'],           weight: 2 },
  { nameHe: 'לוד',         nameEn: 'Lod',              lat: 31.9506, lng: 34.8954, region: 'center',   cultureFit: ['mainstream', 'periphery'],           weight: 2 },
  { nameHe: 'עכו',         nameEn: 'Akko',             lat: 32.9281, lng: 35.0818, region: 'north',    cultureFit: ['mainstream', 'periphery'],           weight: 2 },
  { nameHe: 'נצרת',        nameEn: 'Nazareth',         lat: 32.7021, lng: 35.2978, region: 'north',    cultureFit: ['mainstream', 'periphery'],           weight: 2 },
  { nameHe: 'גבעתיים',     nameEn: 'Givatayim',        lat: 32.0721, lng: 34.8105, region: 'tel-aviv', cultureFit: ['secular', 'premium'],                weight: 2 },
  { nameHe: 'רמת השרון',   nameEn: 'Ramat HaSharon',   lat: 32.1437, lng: 34.8438, region: 'sharon',   cultureFit: ['premium', 'secular'],                weight: 1 },
  { nameHe: 'כרמיאל',      nameEn: 'Karmiel',          lat: 32.9192, lng: 35.2900, region: 'north',    cultureFit: ['mainstream', 'russian'],             weight: 1 },
  { nameHe: 'עפולה',       nameEn: 'Afula',            lat: 32.6078, lng: 35.2891, region: 'north',    cultureFit: ['mainstream', 'periphery'],           weight: 2 },
  { nameHe: 'דימונה',      nameEn: 'Dimona',           lat: 31.0700, lng: 35.0333, region: 'south',    cultureFit: ['mainstream', 'periphery'],           weight: 1 },
  { nameHe: 'קריית מוצקין',nameEn: 'Kiryat Motzkin',   lat: 32.8396, lng: 35.0781, region: 'haifa',    cultureFit: ['mainstream', 'russian'],             weight: 1 },
  { nameHe: 'קריית אתא',   nameEn: 'Kiryat Ata',       lat: 32.8110, lng: 35.1062, region: 'haifa',    cultureFit: ['mainstream', 'russian'],             weight: 1 },
  { nameHe: 'גבעת שמואל',  nameEn: 'Givat Shmuel',     lat: 32.0770, lng: 34.8508, region: 'tel-aviv', cultureFit: ['religious', 'mainstream'],           weight: 1 },
  { nameHe: 'אלעד',        nameEn: 'Elad',             lat: 32.0513, lng: 34.9502, region: 'center',   cultureFit: ['haredi', 'mehadrin'],                weight: 1 },
  { nameHe: 'מעלה אדומים', nameEn: 'Maale Adumim',     lat: 31.7725, lng: 35.2987, region: 'jerusalem', cultureFit: ['mainstream', 'religious'],          weight: 1 },
  { nameHe: 'אריאל',       nameEn: 'Ariel',            lat: 32.1049, lng: 35.1722, region: 'center',   cultureFit: ['mainstream', 'russian', 'religious'],weight: 1 },
];

/**
 * Pick a weighted-random city. Seeded via `rng` so calls are reproducible.
 */
export function pickCity(rng: () => number, cultureHint?: IsraeliCity['cultureFit'][number]): IsraeliCity {
  const pool = cultureHint
    ? ISRAELI_CITIES.filter(c => c.cultureFit.includes(cultureHint))
    : ISRAELI_CITIES;
  const total = pool.reduce((s, c) => s + c.weight, 0);
  let r = rng() * total;
  for (const c of pool) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return pool[pool.length - 1];
}

/** Add a small jitter around a city centroid so users aren't stacked on one pixel. */
export function jitterLatLng(city: IsraeliCity, rng: () => number): { lat: number; lng: number } {
  const dLat = (rng() - 0.5) * 0.04;   // ±~2km
  const dLng = (rng() - 0.5) * 0.04;
  return { lat: Number((city.lat + dLat).toFixed(6)), lng: Number((city.lng + dLng).toFixed(6)) };
}
