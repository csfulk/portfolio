/**
 * Visitor Analytics Dashboard — colt.fyi/dashboard
 *
 * Protected by VITE_DASHBOARD_PASSWORD.
 * Reads from Supabase (requires VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@services/core/supabaseClient.js';
import { visitorIdentity } from '@services/core/visitorIdentity.js';

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

// ─── Events Tab ────────────────────────────────────────────────────────────

const EventsTab = ({ events, totalEvents }) => {
  if (!events || events.length === 0) return (
    <p style={{ color: 'var(--colors-text-secondary, #666)', fontSize: 14, marginTop: 24 }}>
      No events recorded yet. They will appear here once visitors interact with the portfolio.
    </p>
  );

  // Aggregate
  const byType      = {};
  const sectionTime = {}; // label → total seconds
  const caseStudyClicks = {};
  const projectDurations = {}; // label → [seconds]
  let pwSuccess = 0, pwFail = 0;

  events.forEach(e => {
    byType[e.event_type] = (byType[e.event_type] || 0) + 1;
    if (e.event_type === 'section_view'     && e.label) sectionTime[e.label]  = (sectionTime[e.label] || 0) + (e.value ?? 0);
    if (e.event_type === 'case_study_click' && e.label) caseStudyClicks[e.label] = (caseStudyClicks[e.label] || 0) + 1;
    if (e.event_type === 'project_close'    && e.label && e.value) {
      if (!projectDurations[e.label]) projectDurations[e.label] = [];
      projectDurations[e.label].push(e.value);
    }
    if (e.event_type === 'password_success') pwSuccess++;
    if (e.event_type === 'password_fail')    pwFail++;
  });

  const sortedSection = Object.entries(sectionTime).sort(([,a],[,b]) => b - a);
  const sortedClicks  = Object.entries(caseStudyClicks).sort(([,a],[,b]) => b - a);
  const maxSection    = sortedSection[0]?.[1] ?? 1;
  const maxClicks     = sortedClicks[0]?.[1]  ?? 1;

  const avgDuration = (arr) => arr.length
    ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
    : 0;

  const eventTypeLabels = {
    section_view:      '📖 Section views',
    case_study_click:  '🖱️ Case study clicks',
    project_open:      '📂 Projects opened',
    project_close:     '📂 Projects closed',
    password_success:  '🔓 Password success',
    password_fail:     '🔒 Password fail',
  };

  return (
    <div style={{ marginTop: 0 }}>
      {/* Stat cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total events" value={totalEvents ?? events.length} />
        <StatCard label="Section views" value={byType['section_view'] ?? 0} />
        <StatCard label="Case study clicks" value={byType['case_study_click'] ?? 0} />
        <StatCard label="Projects opened" value={byType['project_open'] ?? 0} />
        {(pwSuccess + pwFail) > 0 && (
          <StatCard label="Password attempts"
            value={`${pwSuccess}✓ / ${pwFail}✗`}
            sub={`${Math.round((pwSuccess / (pwSuccess + pwFail)) * 100)}% success`}
          />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 32 }}>

        {/* Section engagement */}
        {sortedSection.length > 0 && (
          <div style={cardStyle}>
            <h3 style={cardTitle}>📖 Section Engagement (total seconds)</h3>
            {sortedSection.map(([label, secs]) => (
              <BarRow key={label} label={label} count={secs} max={maxSection} />
            ))}
          </div>
        )}

        {/* Case study clicks */}
        {sortedClicks.length > 0 && (
          <div style={cardStyle}>
            <h3 style={cardTitle}>🖱️ Case Study Clicks</h3>
            {sortedClicks.map(([label, count]) => (
              <BarRow key={label} label={label} count={count} max={maxClicks} />
            ))}
          </div>
        )}

        {/* Project view durations */}
        {Object.keys(projectDurations).length > 0 && (
          <div style={cardStyle}>
            <h3 style={cardTitle}>📂 Avg Time in Project Viewer</h3>
            {Object.entries(projectDurations)
              .sort(([,a],[,b]) => avgDuration(b) - avgDuration(a))
              .map(([title, arr]) => (
                <BarRow key={title} label={title}
                  count={`${avgDuration(arr)}s avg (${arr.length} views)`}
                  max={1} // no bar needed, just labels
                />
              ))}
          </div>
        )}

        {/* Events by type breakdown */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>📊 Events by Type</h3>
          {Object.entries(byType).sort(([,a],[,b]) => b - a).map(([type, count]) => (
            <BarRow key={type}
              label={eventTypeLabels[type] || type}
              count={count}
              max={Math.max(...Object.values(byType))}
            />
          ))}
        </div>
      </div>

      {/* Recent events table */}
      <div style={cardStyle}>
        <h3 style={{ ...cardTitle, marginBottom: 16 }}>
          🗂️ Recent Events
          <span style={{ fontWeight: 400, color: 'var(--colors-text-secondary, #666)', marginLeft: 8, fontSize: 13 }}>
            (latest {events.length})
          </span>
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Time', 'Type', 'Label', 'Value', 'Session'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={e.id ?? i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--colors-background-secondary, #f8f9fa)' }}>
                  <td style={tdStyle}>{formatDate(e.created_at)}</td>
                  <td style={tdStyle}>{eventTypeLabels[e.event_type] || e.event_type}</td>
                  <td style={tdStyle}>{e.label ?? '—'}</td>
                  <td style={tdStyle}>{e.value != null ? `${e.value}s` : '—'}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11 }}>
                    {e.session_id ? e.session_id.slice(0, 12) + '…' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ marginTop: 16, fontSize: 11, color: 'var(--colors-text-tertiary, #999)', textAlign: 'center' }}>
        Showing up to 300 most recent events · Powered by Supabase
      </p>
    </div>
  );
};

// ─── Journeys Tab ─────────────────────────────────────────────────────────

const EVENT_ICON = {
  section_view:     '📖',
  case_study_click: '🖱️',
  project_open:     '📂',
  project_close:    '📂',
  password_success: '🔓',
  password_fail:    '🔒',
  visit:            '🌐',
};

const describeEvent = (item) => {
  if (item._kind === 'visit') {
    const ref = item.referrer ? cleanReferrer(item.referrer) : 'Direct';
    const loc = [item.city, item.country].filter(Boolean).join(', ') || 'Unknown location';
    return `Arrived · ${loc} · via ${ref}`;
  }
  switch (item.event_type) {
    case 'section_view':     return `Read "${item.label || 'section'}" · ${item.value ?? 0}s`;
    case 'case_study_click': return `Opened case study: ${item.label || '—'}`;
    case 'project_open':     return `Opened project: ${item.label || '—'}`;
    case 'project_close':    return `Closed "${item.label || '—'}" · ${item.value ?? 0}s in viewer`;
    case 'password_success': return 'Unlocked the portfolio ✅';
    case 'password_fail':    return 'Failed password attempt';
    default:                 return `${item.event_type}${item.label ? ` · ${item.label}` : ''}`;
  }
};

const fmtDelta = (ms) => {
  if (ms < 0 || ms == null) return '';
  if (ms < 60000) return `${Math.round(ms / 1000)}s later`;
  return `${Math.round(ms / 60000)}m later`;
};

const JourneysTab = ({ visits, events }) => {
  if (!visits && !events) return (
    <p style={{ color: 'var(--colors-text-secondary, #666)', fontSize: 14, marginTop: 24 }}>
      No data yet.
    </p>
  );

  // Group all rows by visitor_id (fallback: session_id)
  const byVisitor = {};

  const addItem = (key, alias, item) => {
    if (!byVisitor[key]) byVisitor[key] = { alias: alias || key, sessions: new Set(), items: [] };
    if (item.session_id) byVisitor[key].sessions.add(item.session_id);
    byVisitor[key].items.push(item);
  };

  (visits || []).forEach(v => {
    const key = v.visitor_id || v.session_id || 'unknown';
    addItem(key, v.visitor_alias, { ...v, _kind: 'visit' });
  });

  (events || []).forEach(e => {
    const key = e.visitor_id || e.session_id || 'unknown';
    addItem(key, e.visitor_alias, { ...e, _kind: 'event' });
  });

  // Sort visitors by most recent activity
  const visitors = Object.entries(byVisitor)
    .map(([key, data]) => {
      const sorted = [...data.items].sort((a, b) =>
        new Date(a.created_at) - new Date(b.created_at)
      );
      const lastActivity = sorted[sorted.length - 1]?.created_at;
      const latestVisit = [...sorted].reverse().find(i => i._kind === 'visit');
      return { key, ...data, items: sorted, lastActivity, latestVisit };
    })
    .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
    .slice(0, 60);

  if (visitors.length === 0) return (
    <p style={{ color: 'var(--colors-text-secondary, #666)', fontSize: 14, marginTop: 24 }}>
      Journeys will appear here once visitors interact with the portfolio.
      New visits will include a visitor alias — existing rows without <code>visitor_id</code> will
      group by session instead.
    </p>
  );

  return (
    <div style={{ marginTop: 0 }}>
      <p style={{ fontSize: 13, color: 'var(--colors-text-secondary, #666)', marginBottom: 24 }}>
        {visitors.length} visitor{visitors.length !== 1 ? 's' : ''} · sorted by most recent activity
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {visitors.map(({ key, alias, sessions, items, latestVisit }) => {
          const loc = [latestVisit?.city, latestVisit?.country].filter(Boolean).join(', ');

          return (
            <div key={key} style={cardStyle}>
              {/* Visitor header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--colors-text-primary, #000)' }}>
                    {alias && alias !== key ? alias : '✦ Anonymous'}
                  </span>
                  {loc && (
                    <span style={{ fontSize: 13, color: 'var(--colors-text-secondary, #666)', marginLeft: 10 }}>
                      {countryFlag(latestVisit?.country_code)} {loc}
                    </span>
                  )}
                  {latestVisit?.isp && (
                    <span style={{ fontSize: 12, color: 'var(--colors-text-tertiary, #999)', marginLeft: 10 }}>
                      · {latestVisit.isp}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={badgeStyle}>{sessions.size} session{sessions.size !== 1 ? 's' : ''}</span>
                  <span style={badgeStyle}>{items.length} step{items.length !== 1 ? 's' : ''}</span>
                  {latestVisit?.referrer && (
                    <span style={{ ...badgeStyle, background: '#e8f0ff', color: '#0066cc' }}>
                      via {cleanReferrer(latestVisit.referrer)}
                    </span>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div style={{ borderLeft: '2px solid var(--colors-border-primary, #e0e0e0)', paddingLeft: 16, marginLeft: 4 }}>
                {items.map((item, i) => {
                  const prev = items[i - 1];
                  const deltaMs = prev
                    ? new Date(item.created_at) - new Date(prev.created_at)
                    : null;
                  const icon = item._kind === 'visit'
                    ? EVENT_ICON.visit
                    : (EVENT_ICON[item.event_type] || '•');
                  const isAlert = item.event_type === 'password_fail';
                  const isArrival = item._kind === 'visit';

                  return (
                    <div key={i} style={{ position: 'relative', marginBottom: 12 }}>
                      {/* Timeline dot */}
                      <div style={{
                        position: 'absolute', left: -22, top: 4,
                        width: 10, height: 10, borderRadius: '50%',
                        background: isArrival
                          ? 'var(--colors-accent-primary, #0066cc)'
                          : isAlert ? '#e53e3e'
                          : 'var(--colors-border-primary, #ccc)',
                        border: '2px solid var(--colors-background-secondary, #f8f9fa)',
                      }} />

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13 }}>{icon}</span>
                        <span style={{
                          fontSize: 13,
                          color: isAlert ? '#e53e3e' : 'var(--colors-text-primary, #000)',
                          fontWeight: isArrival ? 600 : 400,
                        }}>
                          {describeEvent(item)}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--colors-text-tertiary, #999)', flexShrink: 0 }}>
                          {formatDate(item.created_at)}
                        </span>
                        {deltaMs != null && deltaMs > 0 && deltaMs < 3600000 && (
                          <span style={{ fontSize: 11, color: 'var(--colors-text-tertiary, #bbb)' }}>
                            (+{fmtDelta(deltaMs)})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 16, fontSize: 11, color: 'var(--colors-text-tertiary, #999)', textAlign: 'center' }}>
        Showing up to 60 most recent visitors · alias resets on cache clear
      </p>
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────

const DashboardContent = ({ onLogout }) => {
  const [visits,      setVisits]      = useState(null);
  const [total,       setTotal]       = useState(null);
  const [events,      setEvents]      = useState(null);
  const [totalEvents, setTotalEvents] = useState(null);
  const [activeTab,   setActiveTab]   = useState('visits');
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // Owner device controls
  const [isOwner,     setIsOwnerState] = useState(() => visitorIdentity.isOwner);
  const [hideOwner,   setHideOwner]    = useState(true);
  const myVisitorId = visitorIdentity.id;

  const toggleOwner = () => {
    const next = !isOwner;
    visitorIdentity.setOwner(next);
    setIsOwnerState(next);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!supabaseClient.isConfigured()) {
      setError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }

    const [rows, count, evtRows, evtCount] = await Promise.all([
      supabaseClient.getVisits({ limit: 500 }),
      supabaseClient.getTotalCount(),
      supabaseClient.getEvents({ limit: 300 }),
      supabaseClient.getEventTotalCount(),
    ]);

    if (rows === null) {
      setError('Could not connect to Supabase. Check your env vars and RLS policies.');
    } else {
      setVisits(rows);
    }
    setTotal(count);
    setEvents(evtRows);
    setTotalEvents(evtCount);
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

  const stats   = filteredVisits ? summarize(filteredVisits) : { topCountries: [], topCities: [], topReferrers: [], lastVisit: null };
  const maxC    = stats.topCountries[0]?.[1] ?? 1;
  const maxCity = stats.topCities[0]?.[1]    ?? 1;

  // Filter out owner rows when hideOwner is on
  const filteredVisits = hideOwner && visits
    ? visits.filter(v => v.visitor_id !== myVisitorId)
    : visits;
  const filteredEvents = hideOwner && events
    ? events.filter(e => e.visitor_id !== myVisitorId)
    : events;

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
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Owner device toggle */}
          <button
            onClick={toggleOwner}
            title={isOwner ? 'This device is marked as yours — tracking suppressed. Click to unmark.' : 'Mark this device as yours to suppress tracking'}
            style={{
              ...btnStyle, fontSize: 12,
              background: isOwner ? '#e8f5e9' : 'transparent',
              color: isOwner ? '#2e7d32' : 'var(--colors-text-secondary, #666)',
              border: `1px solid ${isOwner ? '#a5d6a7' : 'var(--colors-border-primary, #e0e0e0)'}`,
            }}
          >
            {isOwner ? '🙈 My device (tracking off)' : '👤 Mark as my device'}
          </button>
          {/* Hide/show my rows */}
          <button
            onClick={() => setHideOwner(h => !h)}
            title="Toggle visibility of your own visits in the dashboard"
            style={{
              ...btnStyle, fontSize: 12,
              background: 'transparent',
              color: 'var(--colors-text-secondary, #666)',
              border: '1px solid var(--colors-border-primary, #e0e0e0)',
            }}
          >
            {hideOwner ? '🔍 Showing real visitors' : '👁️ Showing all (incl. you)'}
          </button>
          <button onClick={load} style={{ ...btnStyle, fontSize: 13 }}>↻ Refresh</button>
          <button onClick={onLogout} style={{ ...btnStyle, background: 'transparent',
            border: '1px solid var(--colors-border-primary, #e0e0e0)',
            color: 'var(--colors-text-secondary, #666)', fontSize: 13 }}>
            Log out
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid var(--colors-border-primary, #e0e0e0)',
        padding: '0 32px',
        background: 'var(--colors-background-secondary, #f8f9fa)',
      }}>
        {[['visits', '🌍 Visits'], ['events', '🖱️ Events'], ['journeys', '🧭 Journeys']].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: 13,
              fontWeight: activeTab === tab ? 700 : 400,
              background: 'transparent',
              color: activeTab === tab
                ? 'var(--colors-text-primary, #000)'
                : 'var(--colors-text-secondary, #666)',
              borderBottom: activeTab === tab
                ? '2px solid var(--colors-accent-primary, #0066cc)'
                : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {activeTab === 'visits' && <>

        {/* Stat cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <StatCard label="Total visits" value={total ?? visits?.length ?? 0} />
          <StatCard label="Filtered visits" value={filteredVisits?.length ?? 0} sub={hideOwner ? 'excl. your devices' : 'all devices'} />
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
                    filteredVisits?.find(v => v.country === name)?.country_code
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
              (latest {filteredVisits?.length ?? 0})
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
                {(filteredVisits ?? []).map((v, i) => (
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
                {(filteredVisits?.length ?? 0) === 0 && (
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
        </>}

        {activeTab === 'events' && <EventsTab events={filteredEvents} totalEvents={filteredEvents?.length ?? 0} />}
        {activeTab === 'journeys' && <JourneysTab visits={filteredVisits} events={filteredEvents} />}
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

const badgeStyle = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 10,
  fontSize: 11,
  fontWeight: 600,
  background: 'var(--colors-border-primary, #e0e0e0)',
  color: 'var(--colors-text-secondary, #666)',
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
