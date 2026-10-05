import { useEffect, useRef, useState } from 'react';
import { FaArrowRight, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { CONTACT_INFO, SOCIAL_LINKS } from '../constants';

const emptyForm = { name: '', email: '', subject: '', message: '', website: '' };
const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const fields = [
  { name: 'name', label: 'Your name', placeholder: 'Your name', minLength: 2, maxLength: 80, autoComplete: 'name', required: true },
  { name: 'email', label: 'Email address', placeholder: 'you@example.com', maxLength: 254, type: 'email', autoComplete: 'email', required: true },
  { name: 'subject', label: 'Subject (optional)', placeholder: 'What would you like to work on?', maxLength: 120 },
];

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ kind: 'idle', message: '' });
  const [errors, setErrors] = useState({});
  const requestRef = useRef(null);
  useEffect(() => () => requestRef.current?.abort(), []);

  const updateField = ({ target: { name, value } }) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    if (status.kind !== 'sending') setStatus({ kind: 'idle', message: '' });
  };

  const submitMessage = async (event) => {
    event.preventDefault();
    if (requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    setStatus({ kind: 'sending', message: 'Sending your message…' });
    setErrors({});
    try {
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), signal: controller.signal,
      });
      const data = response.headers.get('content-type')?.includes('application/json') ? await response.json() : null;
      if (response.status !== 201 || !data?.message) {
        if (data?.fields) setErrors(data.fields);
        throw new Error(data?.error || 'Messaging is unavailable right now. Please email me directly.');
      }
      setForm(emptyForm);
      setStatus({ kind: 'success', message: 'Thanks! Your message has been received.' });
    } catch (error) {
      setStatus({ kind: 'error', message: error.name === 'AbortError'
        ? 'The request timed out. Please try again or email me directly.'
        : error instanceof TypeError ? 'Could not connect. Please check your connection or email me directly.' : error.message });
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
    }
  };

  return (
    <section id="contact" className="contact-section adri-contact" aria-labelledby="contact-title">
      <div className="contact-layout">
        <div className="contact-intro reveal-3d">
          <p className="adri-eyebrow">HAVE A PROJECT IN MIND?</p>
          <h2 id="contact-title">Get in Touch!</h2>
          <p className="contact-description">A project, an opportunity, or just a hello. Tell me what you’re thinking — I’d love to hear from you.</p>
          <div className="contact-details">
            <a href={`mailto:${CONTACT_INFO.email}`}><FaEnvelope aria-hidden="true" />{CONTACT_INFO.email}</a>
            <a href={`tel:${CONTACT_INFO.phone}`}><FaPhoneAlt aria-hidden="true" />{CONTACT_INFO.phone}</a>
            <a href={CONTACT_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer"><FaMapMarkerAlt aria-hidden="true" />{CONTACT_INFO.location}</a>
          </div>
          <div className="contact-socials">
            {SOCIAL_LINKS.map((social) => <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`Guddu on ${social.platform}`}>{social.icon}</a>)}
          </div>
        </div>
        <div className="contact-form-shell reveal-3d">
        <form className="contact-form" onSubmit={submitMessage} aria-label="Send Guddu a message">
          <div className="contact-form-heading"><span><i aria-hidden="true" />LET’S CONNECT</span><span aria-hidden="true">↗</span></div>
          <fieldset disabled={status.kind === 'sending'}>
            <div className="form-grid">
              {fields.map(({ name, label, ...attributes }) => <div className={`form-field field-${name}`} key={name}>
                <label htmlFor={`contact-${name}`}>{label}{attributes.required && <span> *</span>}</label>
                <input id={`contact-${name}`} name={name} {...attributes} value={form[name]} onChange={updateField} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />
                {errors[name] && <p id={`${name}-error`} className="field-error">{errors[name]}</p>}
              </div>)}
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">Your message <span>*</span></label>
              <textarea id="contact-message" name="message" placeholder="Tell me a little about your idea…" rows={5} required minLength={10} maxLength={5000} value={form.message} onChange={updateField} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : 'message-hint'} />
              {errors.message ? <p id="message-error" className="field-error">{errors.message}</p> : <p id="message-hint" className="field-hint">At least 10 characters. Fields marked * are required.</p>}
            </div>
            <div className="form-trap" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={updateField} />
            </div>
            <button className="send-button" type="submit">{status.kind === 'sending' ? 'Sending…' : 'Send message'}<FaArrowRight aria-hidden="true" /></button>
          </fieldset>
          <p className={`form-status ${status.kind}`} role="status" aria-live="polite" aria-atomic="true">{status.message}</p>
        </form>
        </div>
      </div>
    </section>
  );
}
