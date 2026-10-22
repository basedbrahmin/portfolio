import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM } = process.env;

const transporter =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
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
      from: `"Portfolio" <${MAIL_FROM || SMTP_USER}>`,
      to: MAIL_TO || SMTP_USER,
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
