/**
 * Event Tracker
 * Logs user interaction events to the Supabase `events` table.
 *
 * Event types used across the app:
 *   section_view      — visitor spent time on a section (label=sectionId, value=seconds)
 *   case_study_click  — case study button clicked     (label=caseStudyKey)
 *   project_open      — project viewer opened         (label=projectTitle)
 *   project_close     — project viewer closed         (label=projectTitle, value=seconds open)
 *   password_success  — portfolio password correct
 *   password_fail     — incorrect password attempt
 */

import { supabaseClient } from './supabaseClient.js';
import { visitorIdentity } from './visitorIdentity.js';

class EventTracker {
  /** Reuses the same session ID as LocationService */
  _sessionId() {
    let id = sessionStorage.getItem('portfolio_session_id');
    if (!id) {
      id = Date.now().toString(36) + Math.random().toString(36).slice(2);
      sessionStorage.setItem('portfolio_session_id', id);
    }
    return id;
  }

  /**
   * Track an event.
   * @param {string}      eventType  One of the event type constants above
   * @param {string|null} label      Section id, project title, case study key, etc.
   * @param {number|null} value      Duration in seconds, count, etc.
   * @param {Object|null} meta       Any extra JSON data
   */
  track(eventType, label = null, value = null, meta = null) {
    if (!supabaseClient.isConfigured()) return;

    supabaseClient.insertEvent({
      session_id: this._sessionId(),
      event_type: eventType,
      label:      label ?? null,
      value:      value ?? null,
      meta:       meta  ?? null,
      ...visitorIdentity.fields,
    });
  }
}

export const eventTracker = new EventTracker();
export default eventTracker;
