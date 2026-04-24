import { adminSupabase } from '@/lib/admin/supabase';
import { StatCard } from '../_components/StatCard';
import { HBarChart } from '../_components/Charts';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function GeoPage() {
  const sb = adminSupabase();

  const branchRes = await sb.from('StoreBranch').select('chainKey, city, lat, lng');
  type B = { chainKey: string; city: string; lat: number; lng: number };
  const branches: B[] = (branchRes.data as B[] | null) ?? [];

  const cityMap = branches.reduce((acc, b) => {
    const c = (b.city ?? 'unknown').trim();
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const cities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([city, n]) => ({ city, n }));

  // User locations from preferences
  const prefsRes = await sb.from('UserPreferences').select('locationCity');
  type P = { locationCity: string | null };
  const prefs: P[] = (prefsRes.data as P[] | null) ?? [];
  const userCityMap = prefs.reduce((acc, p) => {
    const c = (p.locationCity ?? 'unset').trim();
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const userCities = Object.entries(userCityMap).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([city, n]) => ({ city, n }));

  // Bounding box for map
  const validBranches = branches.filter(b => b.lat != null && b.lng != null);
  const minLat = Math.min(...validBranches.map(b => b.lat));
  const maxLat = Math.max(...validBranches.map(b => b.lat));
  const minLng = Math.min(...validBranches.map(b => b.lng));
  const maxLng = Math.max(...validBranches.map(b => b.lng));

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Geography</h1>
          <p className="admin-sub">Branch distribution and user location preferences</p>
        </div>
      </header>

      <div className="stat-grid cols-4">
        <StatCard label="Branches"          value={branches.length} accent="green" source="StoreBranch" />
        <StatCard label="Cities with branches" value={Object.keys(cityMap).length} accent="blue" />
        <StatCard label="Users with location" value={prefs.filter(p => p.locationCity).length} accent="purple" />
        <StatCard label="Unique user cities"  value={Object.keys(userCityMap).length - 1} accent="gold" />
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-head">
          <div>
            <div className="admin-card-title">Branch distribution map</div>
            <div className="admin-card-sub">Simple dot plot of all branch coordinates · Israel</div>
          </div>
        </div>
        <BranchMap branches={validBranches} minLat={minLat} maxLat={maxLat} minLng={minLng} maxLng={maxLng} />
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Top cities · branches</div></div>
          <HBarChart data={cities} labelKey="city" valueKey="n" height={400} color="#34C759" />
        </div>
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Top cities · users</div></div>
          <HBarChart data={userCities} labelKey="city" valueKey="n" height={400} color="#007AFF" />
        </div>
      </div>
    </div>
  );
}

function BranchMap({ branches, minLat, maxLat, minLng, maxLng }: { branches: Array<{ chainKey: string; lat: number; lng: number }>; minLat: number; maxLat: number; minLng: number; maxLng: number }) {
  const w = 860, h = 460;
  if (branches.length === 0) {
    return <div style={{ height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E8E93' }}>No branch coordinates.</div>;
  }
  const latSpan = Math.max(0.01, maxLat - minLat);
  const lngSpan = Math.max(0.01, maxLng - minLng);
  const pad = 30;

  // Chain → color map
  const chains = Array.from(new Set(branches.map(b => b.chainKey)));
  const palette = ['#34C759', '#007AFF', '#AF52DE', '#FF9500', '#FF3B30', '#5AC8FA', '#D4A853', '#248A3D'];
  const colorFor = new Map(chains.map((c, i) => [c, palette[i % palette.length]]));

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: h, background: '#F9FAFB', borderRadius: 10 }}>
        {branches.map((b, i) => {
          const x = pad + ((b.lng - minLng) / lngSpan) * (w - pad * 2);
          // y inverted (higher lat = more north = top)
          const y = h - pad - ((b.lat - minLat) / latSpan) * (h - pad * 2);
          return (
            <circle
              key={i} cx={x} cy={y} r={3.5}
              fill={colorFor.get(b.chainKey)}
              fillOpacity={0.7}
              stroke="#FFFFFF" strokeWidth={0.5}
            />
          );
        })}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {chains.slice(0, 15).map(c => (
          <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#3C3C43' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: colorFor.get(c) }} />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
