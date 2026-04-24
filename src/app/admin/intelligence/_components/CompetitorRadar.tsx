'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';

interface RadarDatum { axis: string; value: number; max: number }

export function CompetitorRadar({ data, color }: { data: RadarDatum[]; color: string }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="78%">
          <PolarGrid stroke="#EEF0F3" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: '#1A1A1A', fontWeight: 600 }} />
          <Tooltip
            formatter={(v) => `${Math.round(Number(v ?? 0))}% of market-best`}
            contentStyle={{
              background: '#fff', border: '1px solid #E5E7EB',
              borderRadius: 10, fontSize: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            }}
          />
          <Radar
            name="vs market"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.28}
            strokeWidth={2.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
