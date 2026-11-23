import React from 'react';
import { ArrowUp, Terminal } from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './BrandIcons';
import '../style/Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-wrap">
            <div className="footer-logo">
              <Terminal size={18} className="text-blue-400" />
              <span className="footer-brand-title">AzizDev.</span>
            </div>
            <p className="footer-tagline">
              Membangun pengalaman web modern dengan presisi kode, tipografi tajam, dan dimensi 3D interaktif.
            </p>
          </div>

          <div className="footer-nav-col">
            <span className="footer-col-heading">Navigasi</span>
            <div className="footer-links-list">
              <a href="#Home">Beranda</a>
              <a href="#About">Tentang Saya</a>
              <a href="#Projects">Hobi</a>
              <a href="#Contact">Kontak</a>
            </div>
          </div>

          <div className="footer-nav-col">
            <span className="footer-col-heading">Terhubung</span>
            <div className="footer-social-row">
              <a
                href="https://www.instagram.com/zizzz__z.co"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@zizz2511"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
              >
                <TikTokIcon size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Azizdev. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-back-to-top"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
