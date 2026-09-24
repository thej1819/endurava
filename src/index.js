/**
 * Endurava Technologies — Worker entry point.
 *
 * This project deploys via `wrangler deploy` (Cloudflare Workers with
 * static assets), not classic Cloudflare Pages — so server-side logic
 * lives here as manual routing, not in a /functions folder (that
 * file-based convention only applies to Pages and is ignored here).
 *
 * Static files (html/css/js, _redirects) are served via the ASSETS
 * binding declared in wrangler.toml. Only /api/* routes are handled
 * below; every other request falls through to the static site.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

/**
 * Stores contact-form submissions in D1 — one table per form type:
 * hiring_leads, career_leads, general_leads. See wrangler.toml for the
 * D1 binding and the project notes for the CREATE TABLE statements.
 */
async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  // Honeypot: bots tend to fill every field, including ones hidden from
  // real users via CSS. If it's filled, silently pretend success.
  if (data.website) {
    return jsonOk();
  }

  const { formType, fields } = data;
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    return jsonError('Invalid submission.', 400);
  }

  if (!env.DB) {
    console.error('D1 binding "DB" is not configured for this Worker.');
    return jsonError('Unable to save your submission right now. Please email us directly.', 500);
  }

  try {
    if (formType === 'hiring') {
      await env.DB.prepare(
        `INSERT INTO hiring_leads (company, contact_name, contact_email, contact_phone, role, tech_stack, timeline, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          str(fields['company']),
          str(fields['contact-name']),
          str(fields['contact-email']),
          str(fields['contact-phone']),
          str(fields['role']),
          str(fields['tech-stack']),
          str(fields['timeline']),
          str(fields['message'])
        )
        .run();
    } else if (formType === 'career') {
      await env.DB.prepare(
        `INSERT INTO career_leads (candidate_name, candidate_email, candidate_phone, experience_level, current_skills, interests, career_goals)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          str(fields['candidate-name']),
          str(fields['candidate-email']),
          str(fields['candidate-phone']),
          str(fields['experience-level']),
          str(fields['current-skills']),
          joinIfArray(fields['interests']),
          str(fields['career-goals'])
        )
        .run();
    } else {
      await env.DB.prepare(
        `INSERT INTO general_leads (inquiry_name, inquiry_email, inquiry_company, inquiry_subject, inquiry_message)
         VALUES (?, ?, ?, ?, ?)`
      )
        .bind(
          str(fields['inquiry-name']),
          str(fields['inquiry-email']),
          str(fields['inquiry-company']),
          str(fields['inquiry-subject']),
          str(fields['inquiry-message'])
        )
        .run();
    }
  } catch (err) {
    console.error('D1 insert failure:', err);
    return jsonError('Unable to save your submission right now. Please email us directly.', 502);
  }

  return jsonOk();
}

function str(value) {
  return value === undefined || value === null ? '' : String(value);
}

function joinIfArray(value) {
  return Array.isArray(value) ? value.join(', ') : str(value);
}

function jsonOk() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
