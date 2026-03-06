/**
 * Visitor Analytics Dashboard — colt.fyi/dashboard
 *
 * Protected by VITE_DASHBOARD_PASSWORD.
 * Reads from Supabase (requires VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@services/core/supabaseClient.js';

// ─── Helpers ───────────────────────────────────────────────────────────────

const countryFlag = (code) => {
  if (!code || code.length !== 2) return '🌍';
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt(0))
  );
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const cleanReferrer = (ref) => {
  if (!ref) return 'Direct';
  try { return new URL(ref).hostname.replace('www.', ''); } catch { return ref; }
};

const summarize = (visits) => {
  const countries = {};
  const cities    = {};
  const referrers = {};
  let lastVisit   = null;

  visits.forEach(v => {
    if (v.country)  countries[v.country]              = (countries[v.country]  || 0) + 1;
    if (v.city)     cities[`${v.city}, ${v.region || v.country || ''}`] = (cities[`${v.city}, ${v.region || v.country || ''}`] || 0) + 1;
    const ref = cleanReferrer(v.referrer);
    referrers[ref] = (referrers[ref] || 0) + 1;
    if (!lastVisit || v.created_at > lastVisit) lastVisit = v.created_at;
  });

  const sorted = (obj) =>
    Object.entries(obj).sort(([, a], [, b]) => b - a);

  return {
    topCountries: sorted(countries).slice(0, 8),
    topCities:    sorted(cities).slice(0, 8),
    topReferrers: sorted(referrers).slice(0, 6),
    lastVisit,
  };
};

// ─── Sub-components ────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub }) => (
  <div style={{
    background: 'var(--colors-background-secondary, #f8f9fa)',
    border: '1px solid var(--colors-border-primary, #e0e0e0)',
    borderRadius: 12,
    padding: '20px 24px',
    minWidth: 140,
  }}>
    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--colors-text-primary, #000)', lineHeight: 1 }}>
      {value ?? '—'}
    </div>
    <div style={{ fontSize: 13, color: 'var(--colors-text-secondary, #666)', marginTop: 6 }}>
      {label}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: 'var(--colors-text-tertiary, #999)', marginTop: 3 }}>
        {sub}
      </div>
    )}
  </div>
);

const BarRow = ({ label, count, max, flag }) => {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ minWidth: 24 }}>{flag || ''}</span>
      <div style={{ flex: 1, fontSize: 13, color: 'var(--colors-text-primary, #000)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </div>
      <div style={{ width: 100, height: 6, background: 'var(--colors-border-primary, #e0e0e0)', borderRadius: 3, flexShrink: 0 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--colors-accent-primary, #0066cc)', borderRadius: 3 }} />
      </div>
      <span style={{ minWidth: 28, fontSize: 12, textAlign: 'right', color: 'var(--colors-text-secondary, #666)' }}>
        {count}
      </span>
    </div>
  );
};

// ─── Login Screen ──────────────────────────────────────────────────────────

const LoginScreen = ({ onAuth }) => {
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const expected = import.meta.env.VITE_DASHBOARD_PASSWORD;
    if (!expected) {
      setError('VITE_DASHBOARD_PASSWORD is not set.');
      return;
    }
    if (pw === expected) {
      sessionStorage.setItem('dashboard_auth', '1');
      onAuth();
    } else {
      setError('Wrong password.');
      setPw('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--colors-background-primary, #fff)',
      fontFamily: 'var(--typography-font-family-primary, system-ui, sans-serif)',
    }}>
      <div style={{
        width: 340,
        padding: '40px 36px',
        background: 'var(--colors-background-secondary, #f8f9fa)',
        border: '1px solid var(--colors-border-primary, #e0e0e0)',
        borderRadius: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
        <h1 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: 'var(--colors-text-primary, #000)' }}>
          Visitor Dashboard
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--colors-text-secondary, #666)' }}>
          colt.fyi analytics
        </p>
        <form onSubmit={submit}>
          <input
            autoFocus
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(''); }}
            placeholder="Password"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px', fontSize: 14,
              border: `1px solid ${error ? '#e53e3e' : 'var(--colors-border-primary, #e0e0e0)'}`,
              borderRadius: 8, outline: 'none',
              background: 'var(--colors-background-primary, #fff)',
              color: 'var(--colors-text-primary, #000)',
              marginBottom: 8,
            }}
          />
          {error && (
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#e53e3e' }}>{error}</p>
          )}
          <button
            type="submit"
            style={{
              width: '100%', padding: '10px 14px', fontSize: 14, fontWeight: 600,
              background: 'var(--colors-accent-primary, #0066cc)', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
            }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────

const DashboardContent = ({ onLogout }) => {
  const [visits,  setVisits]  = useState(null);
  const [total,   setTotal]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!supabaseClient.isConfigured()) {
      setError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }

    const [rows, count] = await Promise.all([
      supabaseClient.getVisits({ limit: 500 }),
      supabaseClient.getTotalCount(),
    ]);

    if (rows === null) {
      setError('Could not connect to Supabase. Check your env vars and RLS policies.');
    } else {
      setVisits(rows);
    }
    setTotal(count);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--colors-background-primary, #fff)',
      fontFamily: 'var(--typography-font-family-primary, system-ui, sans-serif)' }}>
      <span style={{ color: 'var(--colors-text-secondary, #666)', fontSize: 14 }}>Loading…</span>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'var(--colors-background-primary, #fff)',
      fontFamily: 'var(--typography-font-family-primary, system-ui, sans-serif)',
      gap: 16 }}>
      <span style={{ fontSize: 32 }}>⚠️</span>
      <p style={{ color: '#e53e3e', fontSize: 14, maxWidth: 440, textAlign: 'center' }}>{error}</p>
      <button onClick={load} style={btnStyle}>Retry</button>
    </div>
  );

  const stats   = visits ? summarize(visits) : { topCountries: [], topCities: [], topReferrers: [], lastVisit: null };
  const maxC    = stats.topCountries[0]?.[1] ?? 1;
  const maxCity = stats.topCities[0]?.[1]    ?? 1;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--colors-background-primary, #fff)',
      fontFamily: 'var(--typography-font-family-primary, system-ui, sans-serif)',
      color: 'var(--colors-text-primary, #000)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid var(--colors-border-primary, #e0e0e0)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--colors-background-secondary, #f8f9fa)',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>📊 Visitor Dashboard</h1>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--colors-text-secondary, #666)' }}>
            colt.fyi analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={load} style={{ ...btnStyle, fontSize: 13 }}>↻ Refresh</button>
          <button onClick={onLogout} style={{ ...btnStyle, background: 'transparent',
            border: '1px solid var(--colors-border-primary, #e0e0e0)',
            color: 'var(--colors-text-secondary, #666)', fontSize: 13 }}>
            Log out
          </button>
        </div>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Stat cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <StatCard label="Total visits" value={total ?? visits?.length ?? 0} />
          <StatCard label="Unique countries" value={stats.topCountries.length} />
          <StatCard label="Unique cities" value={stats.topCities.length} />
          <StatCard label="Last visit" value={stats.lastVisit ? formatDate(stats.lastVisit) : '—'} />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 32 }}>

          {/* Top countries */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>🌍 Top Countries</h3>
            {stats.topCountries.length === 0
              ? <p style={emptyMsg}>No data yet</p>
              : stats.topCountries.map(([name, count]) => (
                  <BarRow key={name} label={name} count={count} max={maxC} flag={countryFlag(
                    visits?.find(v => v.country === name)?.country_code
                  )} />
                ))}
          </div>

          {/* Top cities */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>🏙️ Top Cities</h3>
            {stats.topCities.length === 0
              ? <p style={emptyMsg}>No data yet</p>
              : stats.topCities.map(([name, count]) => (
                  <BarRow key={name} label={name} count={count} max={maxCity} />
                ))}
          </div>

          {/* Top referrers */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>🔗 Top Referrers</h3>
            {stats.topReferrers.length === 0
              ? <p style={emptyMsg}>No data yet</p>
              : stats.topReferrers.map(([ref, count]) => (
                  <BarRow key={ref} label={ref} count={count} max={stats.topReferrers[0][1]} />
                ))}
          </div>
        </div>

        {/* Recent visits table */}
        <div style={cardStyle}>
          <h3 style={{ ...cardTitle, marginBottom: 16 }}>
            📋 Recent Visits
            <span style={{ fontWeight: 400, color: 'var(--colors-text-secondary, #666)', marginLeft: 8, fontSize: 13 }}>
              (latest {visits?.length ?? 0})
            </span>
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Time', 'Location', 'City', 'ISP', 'Referrer', 'Language', 'Screen'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(visits ?? []).map((v, i) => (
                  <tr key={v.id ?? i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--colors-background-secondary, #f8f9fa)' }}>
                    <td style={tdStyle}>{formatDate(v.created_at)}</td>
                    <td style={tdStyle}>
                      {countryFlag(v.country_code)}&nbsp;
                      {v.country ?? '—'}
                      {v.region && v.region !== v.country ? `, ${v.region}` : ''}
                    </td>
                    <td style={tdStyle}>{v.city ?? '—'}</td>
                    <td style={{ ...tdStyle, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {v.isp ?? '—'}
                    </td>
                    <td style={tdStyle}>{cleanReferrer(v.referrer)}</td>
                    <td style={tdStyle}>{v.language ?? '—'}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      {v.screen_width && v.screen_height ? `${v.screen_width}×${v.screen_height}` : '—'}
                    </td>
                  </tr>
                ))}
                {(visits?.length ?? 0) === 0 && (
                  <tr>
                    <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '32px 0', color: 'var(--colors-text-secondary, #666)' }}>
                      No visits recorded yet. Visits will appear here once someone lands on your portfolio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ marginTop: 16, fontSize: 11, color: 'var(--colors-text-tertiary, #999)', textAlign: 'center' }}>
          Showing up to 500 most recent visits · Powered by Supabase
        </p>
      </div>
    </div>
  );
};

// ─── Style constants ───────────────────────────────────────────────────────

const btnStyle = {
  padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  background: 'var(--colors-accent-primary, #0066cc)', color: '#fff',
  border: 'none', borderRadius: 8,
};

const cardStyle = {
  background: 'var(--colors-background-secondary, #f8f9fa)',
  border: '1px solid var(--colors-border-primary, #e0e0e0)',
  borderRadius: 12, padding: 24,
};

const cardTitle = {
  margin: '0 0 16px', fontSize: 15, fontWeight: 600,
  color: 'var(--colors-text-primary, #000)',
};

const emptyMsg = {
  margin: 0, fontSize: 13, color: 'var(--colors-text-secondary, #666)',
};

const thStyle = {
  textAlign: 'left', padding: '8px 12px',
  borderBottom: '1px solid var(--colors-border-primary, #e0e0e0)',
  fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
  color: 'var(--colors-text-secondary, #666)', whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '9px 12px',
  borderBottom: '1px solid var(--colors-border-primary, #e0e0e0)',
  color: 'var(--colors-text-primary, #000)', verticalAlign: 'middle',
};

// ─── Root export ───────────────────────────────────────────────────────────

const Dashboard = () => {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('dashboard_auth') === '1'
  );

  const logout = () => {
    sessionStorage.removeItem('dashboard_auth');
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;
  return <DashboardContent onLogout={logout} />;
};

export default Dashboard;
