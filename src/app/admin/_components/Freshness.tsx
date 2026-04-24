export function Freshness({ minutesAgo }: { minutesAgo: number | null }) {
  if (minutesAgo === null) {
    return <span className="freshness freshness-dead"><span className="freshness-dot" />No events yet</span>;
  }
  const kind = minutesAgo <= 15 ? 'fresh' : minutesAgo <= 60 ? 'stale' : 'dead';
  const label =
    minutesAgo < 1  ? 'just now' :
    minutesAgo < 60 ? `${Math.round(minutesAgo)} min ago` :
    minutesAgo < 60 * 24 ? `${Math.round(minutesAgo / 60)} h ago` :
    `${Math.round(minutesAgo / 60 / 24)} d ago`;
  return (
    <span className={`freshness freshness-${kind}`}>
      <span className="freshness-dot" />
      Last event {label}
    </span>
  );
}
