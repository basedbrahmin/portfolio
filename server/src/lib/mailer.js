import nodemailer from 'nodemailer';

// Only the credentials live in env. Brevo on port 2525 because Render's free tier blocks 25/465/587.
const SMTP_HOST = 'smtp-relay.brevo.com';
const SMTP_PORT = 2525;
const { SMTP_USER, SMTP_PASS, MAIL_TO } = process.env;

const transporter =
  SMTP_USER && SMTP_PASS && MAIL_TO
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        // Fail fast if the host blocks SMTP instead of hanging for minutes.
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      })
    : null;

const escape = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Best effort: a failed email never fails the contact request.
export async function notifyNewMessage({ name, email, message }) {
  if (!transporter) return false;
  try {
    await transporter.sendMail({
      from: `"Portfolio" <${MAIL_TO}>`, // must be a verified sender in Brevo
      to: MAIL_TO,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `${name} <${email}>\n\n${message}`,
      html: `<p><strong>${escape(name)}</strong> &lt;${escape(email)}&gt;</p><p style="white-space:pre-wrap">${escape(message)}</p>`,
    });
    return true;
  } catch (err) {
    console.error('[mail] failed:', err.message);
    return false;
  }
}
