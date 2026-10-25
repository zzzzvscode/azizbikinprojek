import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  ImagePlus,
  Mail,
  MessageSquare,
  Send,
  UserRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import instagramLogo from '../assets/TECH/instagram.svg';
import githubLogo from '../assets/TECH/github-svgrepo-com.svg';
import tiktokLogo from '../assets/TECH/tiktok.svg';
import { supabase } from '../lib/supabase';
import SkeletonImage from './SkeletonImage';
import '../style/Contact.css';

const COMMENTS_STORAGE_KEY = 'portfolio-contact-comments';

const readSavedComments = () => {
  try {
    const savedComments = JSON.parse(localStorage.getItem(COMMENTS_STORAGE_KEY) || '[]');
    return Array.isArray(savedComments) ? savedComments : [];
  } catch {
    return [];
  }
};

const mapSupabaseComment = (comment) => ({
  id: comment.id,
  name: comment.name,
  message: comment.comment,
  photo: comment.avatar_url,
  createdAt: comment.created_at,
});

const formatCommentAge = (createdAt) => {
  const createdTime = new Date(createdAt).getTime();
  if (!Number.isFinite(createdTime)) return 'Waktu tidak diketahui';

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - createdTime) / 1000));
  if (elapsedSeconds < 60) return 'Baru saja';

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `${elapsedMinutes} menit lalu`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} jam lalu`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays} hari lalu`;
};

const createProfileThumbnail = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const size = 128;
      const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
      if (!context) {
        reject(new Error('Canvas tidak tersedia'));
        return;
      }

      canvas.width = size;
      canvas.height = size;
      context.drawImage(
        image,
        (image.naturalWidth - cropSize) / 2,
        (image.naturalHeight - cropSize) / 2,
        cropSize,
        cropSize,
        0,
        0,
        size,
        size,
      );
      resolve(canvas.toDataURL('image/jpeg', 0.78));
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
});

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [commentData, setCommentData] = useState({ name: '', message: '', photo: '', photoName: '' });
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setComments(readSavedComments());
      setCommentsLoading(false);
      return undefined;
    }

    let isActive = true;
    const loadComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('id, name, comment, avatar_url, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!isActive) return;
      if (error) {
        setCommentError('Komentar gagal dimuat. Coba muat ulang halaman.');
      } else {
        const loadedComments = (data || []).map(mapSupabaseComment);
        setComments((current) => {
          const merged = new Map(loadedComments.map((comment) => [comment.id, comment]));
          current.forEach((comment) => merged.set(comment.id, comment));
          return [...merged.values()]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 100);
        });
      }
      setCommentsLoading(false);
    };

    loadComments();

    const channel = supabase
      .channel('comments-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const nextComment = mapSupabaseComment(payload.new);
          setComments((current) => [
            nextComment,
            ...current.filter((comment) => comment.id !== nextComment.id),
          ].slice(0, 100));
        } else if (payload.eventType === 'UPDATE') {
          const updatedComment = mapSupabaseComment(payload.new);
          setComments((current) => current.map((comment) => (
            comment.id === updatedComment.id ? updatedComment : comment
          )));
        } else if (payload.eventType === 'DELETE') {
          setComments((current) => current.filter((comment) => comment.id !== payload.old.id));
        }
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' && isActive) {
          setCommentError('Koneksi realtime komentar terputus. Coba muat ulang halaman.');
        }
      });

    return () => {
      isActive = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const email = 'gyzeennnpro@smktexmaco.my.id';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleProfilePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCommentError('Pilih file gambar yang valid.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCommentError('Ukuran foto maksimal 5 MB.');
      event.target.value = '';
      return;
    }

    try {
      const photo = await createProfileThumbnail(file);
      setCommentData((current) => ({ ...current, photo, photoName: file.name }));
      setCommentError('');
    } catch {
      setCommentError('Foto tidak dapat dibaca. Coba pilih gambar lain.');
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setCommentError('');

    const name = commentData.name.trim();
    const message = commentData.message.trim();

    if (supabase) {
      setIsCommentSubmitting(true);
      const { data, error } = await supabase
        .from('comments')
        .insert({ name, comment: message, avatar_url: commentData.photo || null })
        .select('id, name, comment, avatar_url, created_at')
        .single();

      setIsCommentSubmitting(false);
      if (error) {
        console.error('Supabase comment insert failed:', error);
        setCommentError(`Supabase: ${error.message || 'Komentar gagal dikirim. Coba lagi sebentar.'}`);
        return;
      }

      const savedComment = mapSupabaseComment(data);
      setComments((current) => [
        savedComment,
        ...current.filter((comment) => comment.id !== savedComment.id),
      ].slice(0, 100));
      setCommentData({ name: '', message: '', photo: '', photoName: '' });
      return;
    }

    const nextComments = [
      {
        id: `${Date.now()}`,
        name,
        message,
        photo: commentData.photo,
        createdAt: new Date().toISOString(),
      },
      ...comments,
    ];

    setComments(nextComments);
    try {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(nextComments));
    } catch {
      setCommentError('Komentar tampil, tetapi tidak dapat disimpan di browser ini.');
    }
    setCommentData({ name: '', message: '', photo: '', photoName: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setIsSubmitting(true);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    try {
      const response = await fetch('https://formspree.io/f/moeevqjj', {
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
    // {
    //   name: 'LinkedIn',
    //   label: "Let's Connect",
    //   sub: 'on LinkedIn Professional',
    //   url: 'https://www.linkedin.com/in/eka-wahyu-maulidan-484021315',
    //   icon: LinkedInIcon,
    //   gradient: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
    // },
    {
      name: 'Instagram',
      label: 'Instagram',
      sub: '@alfariyusuff_',
      url: 'https://www.instagram.com/alfariyusuff_/',
      logo: instagramLogo,
    },
    {
      name: 'TikTok',
      label: 'TikTok',
      sub: '@mie_ayamm__3',
      url: 'https://www.tiktok.com/@mie_ayamm__3',
      logo: tiktokLogo,
    },
    {
      name: 'GitHub',
      label: 'GitHub',
      sub: '@alfariyusuff',
      url: 'https://github.com/gyzeennnpro-sudo',
      logo: githubLogo,
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
              {contactError && <p className="contact-comment-error" role="alert">{contactError}</p>}
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

          <div className="contact-comments-panel">
            <div className="contact-comments-header">
              <span className="contact-comments-icon"><MessageSquare size={19} /></span>
              <h2>Komentar <span>({comments.length})</span></h2>
            </div>

            <form onSubmit={handleCommentSubmit} className="contact-comment-form">
              <div className="contact-form-field">
                <label htmlFor="comment-name">Nama</label>
                <input
                  id="comment-name"
                  type="text"
                  required
                  maxLength={50}
                  placeholder="Masukkan nama kamu"
                  value={commentData.name}
                  onChange={(event) => setCommentData({ ...commentData, name: event.target.value })}
                />
              </div>
              <div className="contact-form-field">
                <label htmlFor="comment-message">Komentar</label>
                <textarea
                  id="comment-message"
                  required
                  maxLength={500}
                  rows={4}
                  placeholder="Tulis komentar kamu di sini..."
                  value={commentData.message}
                  onChange={(event) => setCommentData({ ...commentData, message: event.target.value })}
                />
              </div>
              <div className="contact-form-field">
                <label htmlFor="comment-photo">Foto Profil (opsional)</label>
                <label className="contact-photo-picker" htmlFor="comment-photo">
                  <ImagePlus size={17} aria-hidden="true" />
                  <span>{commentData.photoName || 'Pilih Foto Profil'}</span>
                </label>
                <input
                  className="contact-photo-input"
                  id="comment-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhoto}
                />
                <span className="contact-photo-hint">Ukuran file maksimal 5 MB</span>
              </div>
              {commentError && <p className="contact-comment-error" role="alert">{commentError}</p>}
              <button type="submit" className="contact-submit-btn" disabled={isCommentSubmitting}>
                <Send size={15} aria-hidden="true" />
                <span>{isCommentSubmitting ? 'Mengirim...' : 'Kirim Komentar'}</span>
              </button>
            </form>

            <div className="contact-comments-list" aria-live="polite" aria-busy={commentsLoading}>
              {commentsLoading ? (
                <div className="contact-comment-skeleton-list" role="status" aria-label="Memuat komentar">
                  {[0, 1, 2].map((item) => (
                    <div className="contact-comment-skeleton" key={item} aria-hidden="true">
                      <span className="skeleton-block contact-comment-skeleton-avatar" />
                      <span className="contact-comment-skeleton-copy">
                        <span className="skeleton-block contact-comment-skeleton-name" />
                        <span className="skeleton-block contact-comment-skeleton-line" />
                        <span className="skeleton-block contact-comment-skeleton-line contact-comment-skeleton-line-short" />
                      </span>
                    </div>
                  ))}
                </div>
              ) : comments.length ? comments.map((comment) => (
                <article className="contact-comment-item" key={comment.id}>
                  {comment.photo ? (
                    <SkeletonImage className="contact-comment-avatar" src={comment.photo} alt="" />
                  ) : (
                    <span className="contact-comment-avatar contact-comment-avatar-fallback">
                      <UserRound size={17} aria-hidden="true" />
                    </span>
                  )}
                  <div className="contact-comment-content">
                    <div className="contact-comment-meta">
                      <strong>{comment.name}</strong>
                      <time dateTime={comment.createdAt}>{formatCommentAge(comment.createdAt)}</time>
                    </div>
                    <p>{comment.message}</p>
                  </div>
                </article>
              )) : (
                <p className="contact-comments-empty">Belum ada komentar. Jadilah yang pertama!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
