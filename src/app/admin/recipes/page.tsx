import { adminSupabase } from '@/lib/admin/supabase';
import { sql } from '@/lib/admin/sql';
import { StatCard } from '../_components/StatCard';
import { HBarChart } from '../_components/Charts';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  const sb = adminSupabase();

  const [recipesRes, userRecipesRes, socialRes, likesRes] = await Promise.all([
    sb.from('Recipe').select('id', { count: 'exact', head: true }),
    sb.from('UserRecipe').select('id', { count: 'exact', head: true }),
    sb.from('RecipeSocialStats').select('recipeId, likeCount, upvoteCount, timesCooked, rating, commentCount').order('timesCooked', { ascending: false }).limit(15),
    sb.from('Like').select('recipeId', { count: 'exact', head: true }),
  ]);

  // Top recipes by cooks (need JOIN with Recipe for names)
  const topRecipes = (socialRes.data as Array<{ recipeId: string; timesCooked: number; likeCount: number; upvoteCount: number; rating: number | null; commentCount: number }> | null) ?? [];
  const recipeIds = topRecipes.map(r => r.recipeId).filter(Boolean);
  const names = recipeIds.length
    ? await sb.from('Recipe').select('id, name').in('id', recipeIds)
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
        <StatCard label="Top cooked"          value={topRecipes[0]?.timesCooked ?? 0} accent="gold" source="social stats" />
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Most cooked</div></div>
          <HBarChart
            data={topRecipes.map(r => ({ name: nameMap.get(r.recipeId) ?? r.recipeId.slice(0, 8), value: r.timesCooked }))}
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
              <tr key={r.recipeId}>
                <td style={{ fontWeight: 600 }}>{nameMap.get(r.recipeId) ?? r.recipeId}</td>
                <td>{r.timesCooked}</td>
                <td>{r.likeCount}</td>
                <td>{r.upvoteCount}</td>
                <td>{r.rating ? Number(r.rating).toFixed(1) : '—'}</td>
                <td>{r.commentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
