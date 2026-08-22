/**
 * GET /api/case-study?id=<key>
 *
 * Returns the Figma embed URL for a case study, but only to a request carrying
 * a valid site session. Unauthenticated callers get 404 rather than 403 so the
 * endpoint doesn't confirm which ids exist.
 */
import { isAuthed } from '../lib/auth.mjs';
import { CASE_STUDY_EMBEDS } from '../lib/caseStudyContent.mjs';

export default async (req) => {
  const notFound = () =>
    new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });

  if (!isAuthed(req, { scope: 'site' })) return notFound();

  const id = new URL(req.url).searchParams.get('id');
  const embedUrl = id && CASE_STUDY_EMBEDS[id];
  if (!embedUrl) return notFound();

  return new Response(JSON.stringify({ id, embedUrl }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};

export const config = { path: '/api/case-study' };
