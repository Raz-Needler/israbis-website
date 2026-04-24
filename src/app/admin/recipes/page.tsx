import { adminSupabase } from '@/lib/admin/supabase';
import { sql } from '@/lib/admin/sql';
import { StatCard } from '../_components/StatCard';
import { HBarChart } from '../_components/Charts';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  const sb = adminSupabase();

  const [recipesRes, userRecipesRes, socialRes, likesRes] = await Promise.all([
    sb.from('recipes').select('id', { count: 'exact', head: true }),
    sb.from('user_recipes').select('id', { count: 'exact', head: true }),
    sb.from('recipe_social_stats').select('recipe_id, like_count, upvote_count, times_cooked, rating, comment_count').order('times_cooked', { ascending: false }).limit(15),
    sb.from('likes').select('recipe_id', { count: 'exact', head: true }),
  ]);

  const topRecipes = (socialRes.data as Array<{ recipe_id: string; times_cooked: number; like_count: number; upvote_count: number; rating: number | null; comment_count: number }> | null) ?? [];
  const recipeIds = topRecipes.map(r => r.recipe_id).filter(Boolean);
  const names = recipeIds.length
    ? await sb.from('recipes').select('id, name').in('id', recipeIds)
    : { data: [] as Array<{ id: string; name: string }> };
  const nameMap = new Map((names.data as Array<{ id: string; name: string }> | null ?? []).map(r => [r.id, r.name]));

  // Recipe views event (if instrumented)
  const viewsRes = await sql<{ recipe_id: string; views: number }>(`
    SELECT props->>'recipe_id' AS recipe_id, COUNT(*)::int AS views
    FROM analytics.events
    WHERE event_name='recipe.viewed' AND day >= current_date - 30
    GROUP BY 1 ORDER BY views DESC LIMIT 15
  `);

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Recipes</h1>
          <p className="admin-sub">Recipe engagement and user-generated content</p>
        </div>
      </header>

      <div className="stat-grid cols-4">
        <StatCard label="Recipes (catalog)"  value={recipesRes.count ?? 0} accent="green" source="public.Recipe" />
        <StatCard label="User-created recipes" value={userRecipesRes.count ?? 0} accent="blue" source="public.UserRecipe" />
        <StatCard label="Total likes"         value={likesRes.count ?? 0} accent="rose" source="public.Like" />
        <StatCard label="Top cooked"          value={topRecipes[0]?.times_cooked ?? 0} accent="gold" source="social stats" />
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Most cooked</div></div>
          <HBarChart
            data={topRecipes.map(r => ({ name: nameMap.get(r.recipe_id) ?? r.recipe_id.slice(0, 8), value: r.times_cooked }))}
            labelKey="name" valueKey="value" height={380} color="#34C759"
          />
        </div>
        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">Most viewed · 30 days</div>
            <div className="admin-card-sub">recipe.viewed event</div>
          </div>
          <HBarChart
            data={viewsRes.rows.map(r => ({ name: nameMap.get(r.recipe_id) ?? r.recipe_id.slice(0, 8), value: r.views }))}
            labelKey="name" valueKey="value" height={380} color="#007AFF"
          />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">Engagement leaders</div>
        </div>
        <table className="admin-table">
          <thead><tr><th>Recipe</th><th>Cooks</th><th>Likes</th><th>Upvotes</th><th>Rating</th><th>Comments</th></tr></thead>
          <tbody>
            {topRecipes.map(r => (
              <tr key={r.recipe_id}>
                <td style={{ fontWeight: 600 }}>{nameMap.get(r.recipe_id) ?? r.recipe_id}</td>
                <td>{r.times_cooked}</td>
                <td>{r.like_count}</td>
                <td>{r.upvote_count}</td>
                <td>{r.rating ? Number(r.rating).toFixed(1) : '—'}</td>
                <td>{r.comment_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
