import { useState, useEffect } from 'react'
import PortfolioNavbar from './PortfolioNavbar'
import ThreeHeroMesh from './ThreeHeroMesh'
import ThreeObjectLab from './ThreeObjectLab'
import ThreeBackground from './ThreeBackground'
import ProjectModal from './ProjectModal'
import { GithubIcon, InstagramIcon, TikTokIcon } from './BrandIcons'
import {
  ArrowDown,
  ArrowUpRight,
  Copy,
  Check,
  Send,
  ArrowUp,
} from 'lucide-react'
import '../style/Portfolio.css'

const PROJECTS_DATA = [
  {
    id: 'spatial',
    title: 'Spatial Canvas',
    subtitle: '3D Interactive Product Visualizer',
    tag: 'THREE.JS / REACT',
    gradient: 'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
    description:
      'Eksplorasi visualisator produk 3D interaktif yang memungkinkan manipulasi material, pencahayaan studio, dan rotasi 360° secara mulus di browser.',
    longDescription:
      'Spatial Canvas dibangun untuk menyajikan produk dalam ruang tiga dimensi tanpa penurunan performa. Menggunakan Three.js dan kustom shader untuk menghasilkan pantulan cahaya realistis dengan bobot aset minimal.',
    highlights: ['PBR rendering dengan bayangan lembut', 'Kontrol orbit presisi dengan inertia', 'Performa 60 FPS di perangkat mobile'],
    stack: ['React', 'Three.js', 'WebGL', 'Tailwind'],
    demoUrl: 'https://github.com/gyzeennnpro-sudo',
    githubUrl: 'https://github.com/gyzeennnpro-sudo',
  },
  {
    id: 'editorial',
    title: 'Kolektif Jurnal',
    subtitle: 'Minimal Editorial Publication',
    tag: 'WEB DESIGN / EDITORIAL',
    gradient: 'linear-gradient(135deg, #3f3f46 0%, #27272a 100%)',
    description:
      'Platform baca digital dengan ritme tipografi yang tenang, ruang baca lapang, dan navigasi minimalis tanpa distraksi.',
    longDescription:
      'Sebuah eksplorasi desain editorial web yang terinspirasi oleh majalah cetak Swiss. Mengutamakan kenyamanan membaca dalam durasi lama dengan tema adaptif gelap dan terang.',
    highlights: ['Tipografi grid Swiss dengan rasio emas', 'Transisi halaman instan', 'Dark/Light mode dengan kontras terkalibrasi'],
    stack: ['Next.js', 'TypeScript', 'CSS Modules'],
    demoUrl: 'https://github.com/gyzeennnpro-sudo',
    githubUrl: 'https://github.com/gyzeennnpro-sudo',
  },
  {
    id: 'atelier',
    title: 'Atelier 3D',
    subtitle: 'Architectural Space Showcase',
    tag: 'SPLINE / 3D ARCHITECTURE',
    gradient: 'linear-gradient(135deg, #18181b 0%, #090a0d 100%)',
    description:
      'Showcase arsitektur virtual yang memadukan model ruang modern dengan interaksi kamera dan tata cahaya alami.',
    longDescription:
      'Menggunakan Spline 3D untuk menciptakan walkthrough arsitektural yang ringan. Pengunjung dapat berpindah sudut pandang dan berinteraksi dengan elemen interior secara langsung.',
    highlights: ['Pencahayaan ambient realistis', 'Interaksi perpindahan kamera smooth', 'Optimasi kompresi geometri'],
    stack: ['Spline 3D', 'React', 'Framer Motion'],
    demoUrl: 'https://github.com/gyzeennnpro-sudo',
    githubUrl: 'https://github.com/gyzeennnpro-sudo',
  },
  {
    id: 'synapse',
    title: 'Synapse Engine',
    subtitle: 'Collaborative Canvas Workspace',
    tag: 'SYSTEMS / CANVAS API',
    gradient: 'linear-gradient(135deg, #27272a 0%, #090a0d 100%)',
    description:
      'Kanvas digital tanpa batas untuk visualisasi alur ide dan sketsa arsitektur perangkat lunak secara kolaboratif.',
    longDescription:
      'Menyediakan performa rendering tinggi untuk ratusan elemen diagram pada kanvas virtual tanpa jeda menggunakan HTML5 Canvas API dan state management terdistribusi.',
    highlights: ['Rendering ribuan nodes berbasis GPU', 'Penyimpanan lokal instan', 'Antarmuka modular dan rapi'],
    stack: ['TypeScript', 'Canvas API', 'Node.js', 'Vite'],
    demoUrl: 'https://github.com/gyzeennnpro-sudo',
    githubUrl: 'https://github.com/gyzeennnpro-sudo',
  },
]

const SKILLS_LIST = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { category: '3D & Interaktif', items: ['Three.js', 'Spline 3D', 'WebGL GLSL', 'Canvas API'] },
  { category: 'Backend & Tools', items: ['Node.js', 'Vite', 'Git', 'REST APIs', 'Figma'] },
]

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSent, setFormSent] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('gyzeennnpro@smktexmaco.my.id')
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2200)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setFormSent(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setFormSent(false), 4000)
  }

  return (
    <div className="clean-portfolio-root">
      <ThreeBackground />
      <PortfolioNavbar />

      <main className="clean-main-container">
        {/* ===================================================
            HERO SECTION
            =================================================== */}
        <section className="clean-hero-section" id="beranda">
          <div className="clean-hero-layout">
            <div className="clean-hero-copy">
              <span className="clean-hero-badge">
                <span className="clean-beacon" /> Alfari Yusuf — Creative Developer
              </span>

              <h1 className="clean-hero-h1">
                Membangun pengalaman web dengan kode, tipografi, dan dimensi 3D.
              </h1>

              <p className="clean-hero-p">
                Fokus merangkai visual yang bersih, performa tinggi, dan interaksi yang halus.
                Mengeksplorasi batas teknologi web modern dari antarmuka datar hingga ruang 3D interaktif.
              </p>

              <div className="clean-hero-actions">
                <a href="#karya" className="clean-btn-dark">
                  <span>Lihat Karya</span>
                  <ArrowDown size={15} />
                </a>

                <button
                  type="button"
                  className="clean-btn-outline"
                  onClick={copyEmail}
                >
                  {copiedEmail ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedEmail ? 'Email Disalin' : 'Salin Email'}</span>
                </button>
              </div>
            </div>

            {/* Clean 3D Centerpiece */}
            <div className="clean-hero-mesh">
              <ThreeHeroMesh />
            </div>
          </div>
        </section>

        {/* ===================================================
            SELECTED WORKS
            =================================================== */}
        <section className="clean-section" id="karya">
          <div className="clean-section-header">
            <div>
              <span className="clean-section-index">01 / EKSPLORASI</span>
              <h2 className="clean-section-title">Karya Terpilih</h2>
            </div>
            <p className="clean-section-subtitle">
              Pilihan proyek eksperimental dan produk digital yang dibangun dengan perhatian pada setiap detail kecil.
            </p>
          </div>

          <div className="clean-works-grid">
            {PROJECTS_DATA.map((proj, idx) => (
              <article
                key={proj.id}
                className="clean-work-card"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="clean-card-visual" style={{ background: proj.gradient }}>
                  <span className="clean-card-tag">{proj.tag}</span>
                  <span className="clean-card-num">0{idx + 1}</span>
                </div>

                <div className="clean-card-info">
                  <div className="clean-card-title-row">
                    <h3>{proj.title}</h3>
                    <ArrowUpRight size={16} className="clean-card-arrow" />
                  </div>
                  <p className="clean-card-sub">{proj.subtitle}</p>
                  <p className="clean-card-desc">{proj.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===================================================
            3D PLAYGROUND
            =================================================== */}
        <section className="clean-section" id="lab">
          <ThreeObjectLab />
        </section>

        {/* ===================================================
            SKILLS & ARSENAL
            =================================================== */}
        <section className="clean-section" id="keahlian">
          <div className="clean-section-header">
            <div>
              <span className="clean-section-index">03 / KEAHLIAN</span>
              <h2 className="clean-section-title">Teknologi & Alat Kerja</h2>
            </div>
            <p className="clean-section-subtitle">
              Teknologi yang sering kugunakan untuk membangun situs web modern dan pengalaman visual yang tangguh.
            </p>
          </div>

          <div className="clean-skills-matrix">
            {SKILLS_LIST.map((group, idx) => (
              <div key={idx} className="clean-skill-column">
                <span className="skill-col-title">{group.category}</span>
                <ul className="skill-col-items">
                  {group.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            ABOUT SECTION
            =================================================== */}
        <section className="clean-section" id="tentang">
          <div className="clean-about-box">
            <div className="about-col-left">
              <span className="clean-section-index">04 / TENTANGKU</span>
              <h2 className="about-heading">
                Desain yang baik berawal dari rasa ingin tahu yang jujur.
              </h2>
            </div>
            <div className="about-col-right">
              <p>
                Aku Alfari, seorang developer independen yang gemar merangkai antarmuka web.
                Bagi saya, web bukan sekadar tempat menaruh teks, melainkan medium interaktif
                yang bisa dirasakan — lewat kejelasan tipografi, kecepatan transisi, dan kedalaman visual.
              </p>
              <p>
                Portofolio ini dibangun menggunakan React 19, Three.js, dan Spline sebagai wadah
                belajar sekaligus bereksperimen dengan web 3D modern.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================
            CONTACT SECTION
            =================================================== */}
        <section className="clean-section" id="kontak">
          <div className="clean-contact-box">
            <div className="contact-box-left">
              <span className="clean-section-index">05 / KONTAK</span>
              <h2 className="contact-heading">Punya ide proyek? Mari berdiskusi.</h2>
              <p className="contact-desc">
                Terbuka untuk kolaborasi pembuatan web interaktif, visualisasi 3D, atau sekadar berbagi cerita teknis.
              </p>

              <div className="contact-direct-wrap">
                <a
                  href="mailto:gyzeennnpro@smktexmaco.my.id"
                  className="contact-email-link"
                >
                  gyzeennnpro@smktexmaco.my.id
                </a>
                <button
                  type="button"
                  className="clean-copy-btn"
                  onClick={copyEmail}
                >
                  {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedEmail ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              <div className="contact-social-row">
                <a
                  href="https://github.com/gyzeennnpro-sudo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clean-social-link"
                >
                  <GithubIcon size={14} />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.instagram.com/alfariyusuff_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clean-social-link"
                >
                  <InstagramIcon size={14} />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.tiktok.com/@mie_ayamm__3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clean-social-link"
                >
                  <TikTokIcon size={14} />
                  <span>TikTok</span>
                </a>
              </div>
            </div>

            <div className="contact-box-right">
              <form onSubmit={handleFormSubmit} className="clean-message-form">
                <div className="clean-input-group">
                  <label htmlFor="name-input">Nama</label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="clean-input-group">
                  <label htmlFor="email-input">Email</label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="clean-input-group">
                  <label htmlFor="msg-input">Pesan</label>
                  <textarea
                    id="msg-input"
                    rows={4}
                    required
                    placeholder="Tuliskan pesan atau gambaran proyek..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="clean-submit-btn">
                  <span>Kirim Pesan</span>
                  <Send size={14} />
                </button>

                {formSent && (
                  <p className="clean-form-alert">
                    Pesan berhasil dikirim. Terima kasih!
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="clean-portfolio-footer">
        <div className="clean-footer-inner">
          <p>© 2026 Alfari Yusuf • Dirancang & dibangun dengan presisi.</p>
          <a href="#beranda" className="clean-back-top">
            <span>Kembali ke atas</span>
            <ArrowUp size={14} />
          </a>
        </div>
      </footer>

      {/* Minimal Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
