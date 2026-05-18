/* Shared SplitSecond components */

const ICONS = {
  back: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrow: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  scan: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 7V4a1 1 0 011-1h3M17 7V4a1 1 0 00-1-1h-3M3 13v3a1 1 0 001 1h3M17 13v3a1 1 0 01-1 1h-3M3 10h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  radar: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2" fill="currentColor"/><path d="M10 5a5 5 0 015 5M10 1a9 9 0 019 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  faceid: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 7V5a2 2 0 012-2h2M19 7V5a2 2 0 00-2-2h-2M3 15v2a2 2 0 002 2h2M19 15v2a2 2 0 01-2 2h-2M8 9v2M14 9v2M11 8v4l-1 1M8 14s1 1.5 3 1.5S14 14 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  card: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 9h16" stroke="currentColor" strokeWidth="1.5"/></svg>,
  receipt: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 2v16l2-1.5L9 18l2-1.5L13 18l2-1.5L17 18V2H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 7h6M8 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 17c0-2.5 2-4.5 5-4.5s5 2 5 4.5M13 12.5c2.5 0 4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  divide: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="5" r="1.5" fill="currentColor"/><circle cx="10" cy="15" r="1.5" fill="currentColor"/><path d="M3 10h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  spark: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M3 11l2-2M9 5l2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
};

// Color palette for avatars
const AVATAR_COLORS = [
  'oklch(0.65 0.18 30)',  // coral
  'oklch(0.62 0.16 150)', // green
  'oklch(0.6 0.18 250)',  // blue
  'oklch(0.7 0.15 70)',   // amber
  'oklch(0.62 0.2 320)',  // pink
  'oklch(0.55 0.15 200)', // teal
];

function avatarColor(name, idx) {
  if (idx !== undefined) return AVATAR_COLORS[idx % AVATAR_COLORS.length];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function Avatar({ name, idx, size = 36, ring = false }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className="avatar" style={{
      width: size, height: size,
      background: avatarColor(name, idx),
      fontSize: size * 0.4,
      boxShadow: ring ? '0 0 0 3px var(--bg)' : undefined,
    }}>{initial}</div>
  );
}

function StepBar({ step, total = 8 }) {
  return (
    <div className="stepbar">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`stepbar-dot ${i + 1 === step ? 'active' : i + 1 < step ? 'done' : ''}`} />
      ))}
    </div>
  );
}

function ScreenHeader({ eyebrow, title, sub, onBack }) {
  return (
    <div style={{ marginBottom: 22 }}>
      {onBack && (
        <button className="btn btn-ghost" onClick={onBack} style={{
          height: 36, width: 36, borderRadius: 18, padding: 0,
          background: 'var(--bg-elev)', border: '1px solid var(--line)',
          marginBottom: 16,
        }}>{ICONS.back}</button>
      )}
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1 className="screen-title">{title}</h1>
      {sub && <p className="screen-sub">{sub}</p>}
    </div>
  );
}

function Money({ value, currency = '€', size = 'inherit', weight = 600 }) {
  const v = Number(value || 0);
  return (
    <span className="t-num" style={{ fontSize: size, fontWeight: weight, letterSpacing: '-0.02em' }}>
      {currency}{v.toFixed(2)}
    </span>
  );
}

// Animated count-up number
function CountUp({ value, currency = '€', duration = 700, size, weight }) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    const from = 0, to = Number(value || 0);
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <Money value={v} currency={currency} size={size} weight={weight} />;
}

window.SS = {
  ICONS, Avatar, StepBar, ScreenHeader, Money, CountUp, avatarColor, AVATAR_COLORS,
};
