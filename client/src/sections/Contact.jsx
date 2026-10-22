import { useState } from 'react';
import { useContent } from '../lib/content.jsx';
import { sendMessage } from '../lib/api.js';
import SectionHead from '../components/SectionHead.jsx';

const EMPTY = { name: '', email: '', message: '', website: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email, message }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Please enter a valid email address.';
  if (message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  return errors;
}

export default function Contact() {
  const { profile } = useContent();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', text: '' });

  const update = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((errs) => ({ ...errs, [e.target.name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus({ state: 'sending', text: 'Sending…' });
    try {
      await sendMessage(form);
      setForm(EMPTY);
      setStatus({ state: 'success', text: "Message sent. Thanks! I'll get back to you soon." });
    } catch (err) {
      if (err.fields) setErrors(err.fields);
      setStatus({ state: 'error', text: err.message });
    }
  };

  const field = (name, label, props = {}) => {
    const Tag = props.as || 'input';
    const { as, ...rest } = props;
    return (
      <div className={`field ${errors[name] ? 'has-error' : ''}`}>
        <label htmlFor={`contact-${name}`} className="mono">
          {label}
        </label>
        <Tag
          id={`contact-${name}`}
          name={name}
          value={form[name]}
          onChange={update}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
          {...rest}
        />
        {errors[name] && (
          <span className="field__error mono" id={`contact-${name}-error`}>
            {errors[name]}
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="section contact container" id="contact">
      <SectionHead
        index="06"
        label="Contact"
        title={
          <>
            Let&apos;s build something <em>bold.</em>
          </>
        }
      />

      <div className="contact__grid">
        <div className="contact__info" data-reveal>
          <p className="contact__lead">Have a project, an internship or just want to say hi? My inbox is always open.</p>
          <a className="contact__email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          {profile.phone && (
            <a className="contact__phone mono" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
              {profile.phone}
            </a>
          )}
          <ul className="contact__socials mono">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className="contact__form" onSubmit={submit} noValidate data-reveal="0.1">
          {field('name', '01 — Your name', { autoComplete: 'name', placeholder: 'Jane Doe' })}
          {field('email', '02 — Your email', { type: 'email', autoComplete: 'email', placeholder: 'jane@company.com' })}
          {field('message', '03 — Your message', { as: 'textarea', rows: 5, placeholder: 'Tell me about your project…' })}
          <div className="hp" aria-hidden="true">
            <label>
              Website
              <input name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="contact__submit">
            <button className="btn btn--accent btn--lg" type="submit" disabled={status.state === 'sending'}>
              {status.state === 'sending' ? 'Sending…' : 'Send message →'}
            </button>
            <p className={`form-status mono is-${status.state}`} role="status" aria-live="polite">
              {status.state !== 'sending' && status.text}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
