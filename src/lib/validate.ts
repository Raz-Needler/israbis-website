import { z } from "zod";

/**
 * Input validation schemas.
 * Every piece of user input that touches a fetch call
 * MUST pass through one of these before use.
 */

/** Recipe ID: lowercase slug, max 100 chars */
export const RecipeIdSchema = z
  .string()
  .max(100, "Recipe ID too long")
  .regex(/^[a-z0-9][a-z0-9\-]*$/, "Invalid recipe ID format");

/** Ingredient search: Hebrew + English + numbers + spaces only */
export const IngredientNameSchema = z
  .string()
  .min(1, "Name required")
  .max(100, "Name too long")
  .regex(
    /^[\u0590-\u05FFa-zA-Z0-9\s\-']+$/,
    "Only Hebrew, English, numbers, spaces, and hyphens allowed"
  )
  .transform((s) => s.trim());

/** Pagination limit: integer 1-50 */
export const LimitSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(50)
  .default(10);

/** Generic search query */
export const SearchQuerySchema = z
  .string()
  .max(200, "Query too long")
  .transform((s) => s.replace(/[<>"'`;]/g, "").trim());
