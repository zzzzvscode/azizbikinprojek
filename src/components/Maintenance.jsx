import { useState } from 'react';
import '../style/Maintenance.css';

export default function Maintenance() {
  const [{ currentYear, timeStamp }] = useState(() => {
    const now = new Date();

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = now.toLocaleDateString('id-ID', options);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return {
      currentYear: now.getFullYear(),
      timeStamp: `${formattedDate} pukul ${hours}.${minutes}`,
    };
  });

  return (
    <div className="maintenance-body">
      {/* Ambient Neon Background Blobs */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      {/* Main Outer Container */}
      <main className="main-card">
        
        {/* Top Header */}
        <header className="header-row">
          <div className="brand-info">
            <div className="brand-logo">TX</div>
            <div>
              <h1 className="brand-title">Portofolio Alfari</h1>
              <p className="brand-domain">alfari.my.id</p>
            </div>
          </div>

          <div className="status-pill">
            <span className="status-dot"></span>
            <span>Sedang pengembangan terjadwal</span>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="content-grid">
          
          {/* Left Side Column */}
          <div className="left-col">
            <div>
              <h2 className="main-heading">
                Mohon maaf, situs sedang <br />
                <span className="gradient-text">dalam pengembangan.</span>
              </h2>

              <p className="main-description">
                Kami sedang melakukan pengembangan sistem dan peningkatan keamanan server agar layanan lebih cepat dan andal. Terima kasih atas pengertiannya.
              </p>
            </div>

            <div>
              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-track">
                  <div className="progress-fill"></div>
                </div>
                <div className="progress-label">Perkiraan progres: 18%</div>
              </div>

              {/* Social Contact Buttons */}
              <div className="buttons-row">
                <a href="mailto:gyzeennnpro@smktexmaco.my.id" className="btn-action btn-primary">
                  <svg className="btn-icon" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Email Developer
                </a>
                <a href="https://www.tiktok.com/@mie_ayamm__3" target="_blank" rel="noopener noreferrer" className="btn-action btn-glass">
                  <svg className="btn-icon" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.3V2h-3.64v13.67a2.9 2.9 0 0 1-2.9 2.75 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .6.05.88.14V9.05a6.5 6.5 0 1 0 5.66 6.45V8.53a8.4 8.4 0 0 0 4.91 1.58V6.69h-1.14Z"/>
                  </svg>
                  TikTok
                </a>
                <a href="https://www.instagram.com/alfariyusuff_/" target="_blank" rel="noopener noreferrer" className="btn-action btn-glass">
                  <svg className="btn-icon" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Right Side Column (Catatan Teknis) */}
          <div className="right-col">
            <h3 className="tech-title">Catatan Teknis</h3>
            
            <ul className="tech-list">
              <li className="tech-item">
                <div className="tech-icon-wrap">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <p className="tech-text">Pembaruan paket keamanan server & penataan ulang layanan web.</p>
              </li>
              <li className="tech-item">
                <div className="tech-icon-wrap">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <p className="tech-text">Downtime diperkirakan singkat; beberapa layanan mungkin tidak tersedia sementara.</p>
              </li>
              <li className="tech-item">
                <div className="tech-icon-wrap">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p className="tech-text">Jika mendesak, hubungi admin jaringan untuk akses sementara.</p>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Row */}
        <footer className="footer-row">
          <div>&copy; {currentYear} Portofolio Alfari</div>
          <div>Terakhir diperbarui: <span className="footer-time">{timeStamp}</span></div>
        </footer>

      </main>
    </div>
  );
}