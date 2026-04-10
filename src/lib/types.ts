/* ── Backend response types ── */

export interface Recipe {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  imageUrl: string | null;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  isKosher: boolean;
  tags: string[];
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  category: Category;
  socialStats: SocialStats;
}

export interface RecipeDetail extends Recipe {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface RecipeIngredient {
  id: string;
  item: string;
  amount: string;
  sortOrder: number;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  text: string;
  duration?: number | null;
  temperature?: string | null;
  tip?: string | null;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string | null;
}

export interface SocialStats {
  recipeId: string;
  likeCount: number;
  upvoteCount: number;
  timesCooked: number;
  rating: number;
  ratingCount: number;
  commentCount: number;
}

export interface RecipeListResponse {
  recipes: Recipe[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface CategoryListResponse {
  categories: (Category & { _count: { recipes: number } })[];
}

/* ── Price types ── */

export interface StorePrice {
  price: number;
  unit: string | null;
  matched?: string;
  estimated?: boolean;
}

export interface IngredientPriceResponse {
  base: {
    priceNIS: number;
    unit: string;
    nameHe: string;
  };
  stores: Record<string, StorePrice>;
}

export interface ChainInfo {
  key: string;
  id: string;
  nameHe: string;
  nameEn: string;
  color: string;
  initials: string;
  priority: number;
}

export interface ChainsResponse {
  data: ChainInfo[];
}

export interface StoreCost {
  totalCost: number;
  coveredCount: number;
  verifiedCount: number;
  totalIngredients: number;
  verifiedRatio: number;
  isVerified: boolean;
  lastScrapedAt: string | null;
}

export interface RecipeCompareResponse {
  recipeId: string;
  currency: string;
  stores: Record<string, StoreCost>;
  cheapest?: string;
  fallbackTotal: number;
}
