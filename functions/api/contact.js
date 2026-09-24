/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Receives contact-form submissions from contact/index.html and stores
 * them in Cloudflare D1 (a serverless SQL database bound to this Pages
 * project) — one table per form type: hiring_leads, career_leads,
 * general_leads. No external account, no API token to manage.
 *
 * Setup (one-time):
 *   1. Cloudflare dashboard -> Workers & Pages -> D1 -> Create database
 *      (e.g. name it "endurava-leads")
 *   2. Open its Console tab and run the CREATE TABLE statements below
 *      once, to create hiring_leads / career_leads / general_leads
 *   3. Back in your Pages project -> Settings -> Functions ->
 *      D1 database bindings -> add binding, Variable name: DB,
 *      pointing at the database you created
 *   4. Redeploy (bindings apply on the next deployment)
 *
 * --- SQL to run once in the D1 Console ---
 *
 * CREATE TABLE hiring_leads (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   created_at TEXT DEFAULT (datetime('now')),
 *   company TEXT, contact_name TEXT, contact_email TEXT, contact_phone TEXT,
 *   role TEXT, tech_stack TEXT, timeline TEXT, message TEXT,
 *   status TEXT DEFAULT 'New'
 * );
 *
 * CREATE TABLE career_leads (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   created_at TEXT DEFAULT (datetime('now')),
 *   candidate_name TEXT, candidate_email TEXT, candidate_phone TEXT,
 *   experience_level TEXT, current_skills TEXT, interests TEXT, career_goals TEXT,
 *   status TEXT DEFAULT 'New'
 * );
 *
 * CREATE TABLE general_leads (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   created_at TEXT DEFAULT (datetime('now')),
 *   inquiry_name TEXT, inquiry_email TEXT, inquiry_company TEXT,
 *   inquiry_subject TEXT, inquiry_message TEXT,
 *   status TEXT DEFAULT 'New'
 * );
 */

export async function onRequestPost({ request, env }) {
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
    console.error('D1 binding "DB" is not configured for this Pages project.');
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
