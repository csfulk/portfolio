/**
 * Event Tracker
 * Records user-interaction events. Delivery is handled by analyticsTransport
 * (queue + retry + sendBeacon) → the `ingest` edge function → Supabase `events`.
 *
 * Event types used across the app:
 *   section_view      — visitor spent time on a section (label=sectionId, value=seconds)
 *   case_study_click  — case study button clicked     (label=caseStudyKey)
 *   project_open      — project viewer opened         (label=projectTitle)
 *   project_close     — project viewer closed         (label=projectTitle, value=seconds open)
 *   password_success  — portfolio password correct
 *   password_fail     — incorrect password attempt
 *   hero_cta          — hero call-to-action clicked
 *   privacy_consent   — consent accept/decline
 *
 * Owner traffic is NOT suppressed here — owner events are sent and tagged
 * server-side (is_owner) so the owner can verify tracking works, while the
 * dashboard excludes them from real-visitor stats by default.
 */

import { analyticsTransport } from './analyticsTransport.js';

class EventTracker {
  /**
   * Track an event.
   * @param {string}      eventType  One of the event type constants above
   * @param {string|null} label      Section id, project title, case study key, etc.
   * @param {number|null} value      Duration in seconds, count, etc.
   * @param {Object|null} meta       Any extra JSON data
   */
  track(eventType, label = null, value = null, meta = null) {
    if (!analyticsTransport.isConfigured()) return;
    analyticsTransport.enqueueEvent({
      event_type: eventType,
      label: label ?? null,
      value: value ?? null,
      meta: meta ?? null,
      client_ts: Date.now(),
    });
  }
}

export const eventTracker = new EventTracker();
export default eventTracker;
