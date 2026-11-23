import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Mail,
  MessageSquare,
  Send,
  UserRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import instagramLogo from '../assets/TECH/instagram.svg';
import tiktokLogo from '../assets/TECH/tiktok.svg';
import { supabase } from '../lib/supabase';
import SkeletonImage from './SkeletonImage';
import '../style/Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setIsSubmitting(true);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    try {
      const response = await fetch(' https://formspree.io/f/xbgopyry', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _replyto: email,
          _subject: `Pesan portfolio dari ${name}`,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const formspreeMessage = result.errors?.map((item) => item.message).filter(Boolean).join(' ');
        throw new Error(formspreeMessage || `Formspree menolak pesan (HTTP ${response.status}).`);
      }

      if (supabase) {
        try {
          const { error } = await supabase
            .from('contact_messages')
            .insert({ name, email, message });

          if (error) console.error('Supabase contact message backup failed:', error);
        } catch (backupError) {
          console.error('Supabase contact message backup failed:', backupError);
        }
      }
    } catch (error) {
      console.error('Formspree contact message submission failed:', error);
      setContactError(error.message || 'Email gagal dikirim. Coba lagi sebentar.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', message: '' });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2c67ed', '#38bdf8', '#818cf8', '#00f0ff'],
      });
    } catch {
      // Keep the success state even when confetti is unavailable.
    }

    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const socialLinks = [
    {
      name: 'Instagram',
      label: 'Instagram',
      sub: '@zizzz__z.co',
      url: 'https://www.instagram.com/zizzz__z.co',
      logo: instagramLogo,
    },
    {
      name: 'TikTok',
      label: 'TikTok',
      sub: '@zizz2511',
      url: 'https://www.tiktok.com/@zizz2511',
      logo: tiktokLogo,
    },
  ];

  return (
    <section className="contact-root-section" id="Contact" aria-labelledby="contact-section-heading">
      <div className="contact-container-inner">
        <h2 className="section-display-title" id="contact-section-heading">Hubungi saya</h2>
        <div className="contact-main-grid contact-layout">
          <div className="contact-panel contact-message-panel">
            <h2 className="contact-section-title">Hubungi</h2>
            <p className="contact-panel-intro">Ada yang mau didiskusikan? Langsung kirim pesan aja ya...</p>

            <form onSubmit={handleSubmit} className="contact-actual-form">
              <div className="contact-form-field">
                <label htmlFor="user-name">Nama</label>
                <div className="contact-input-wrap">
                  <UserRound size={17} aria-hidden="true" />
                  <input
                    id="user-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  />
                </div>
              </div>

              <div className="contact-form-field">
                <label htmlFor="user-email">Email</label>
                <div className="contact-input-wrap">
                  <Mail size={17} aria-hidden="true" />
                  <input
                    id="user-email"
                    name="email"
                    type="email"
                    required
                    maxLength={320}
                    placeholder="Email Anda"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  />
                </div>
              </div>

              <div className="contact-form-field">
                <label htmlFor="user-msg">Pesan</label>
                <div className="contact-input-wrap contact-textarea-wrap">
                  <MessageSquare size={17} aria-hidden="true" />
                  <textarea
                    id="user-msg"
                    name="message"
                    rows={4}
                    required
                    maxLength={5000}
                    placeholder="Pesan Anda"
                    value={formData.message}
                    onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="contact-submit-btn">
                <Send size={16} aria-hidden="true" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
              </button>
              {contactError && <p className="contact-error" role="alert">{contactError}</p>}
              {submitSuccess && (
                <div className="contact-success-toast" role="status">
                  <Check size={18} />
                  <span>Pesan berhasil dikirim. Terima kasih!</span>
                </div>
              )}
            </form>

            <div className="contact-find-me">
              <h3>FIND ME</h3>
              <div className="contact-social-grid">
                {socialLinks.map((social) => {
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`contact-social-card contact-social-card--${social.name.toLowerCase()}`}
                    >
                      <span className="contact-social-icon-box">
                        <SkeletonImage className={`contact-social-logo contact-social-logo--${social.name.toLowerCase()}`} src={social.logo} alt="" />
                      </span>
                      <span className="contact-social-text">
                        <span className="contact-social-label">{social.label}</span>
                        <span className="contact-social-sub">{social.sub}</span>
                      </span>
                      <ArrowUpRight size={16} className="contact-social-arrow" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
