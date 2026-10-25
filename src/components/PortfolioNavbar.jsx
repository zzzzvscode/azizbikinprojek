import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import { ArrowUpRight, Menu, X } from 'lucide-react'

export default function PortfolioNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Karya', href: '#karya' },
    { label: '3D Playground', href: '#lab' },
    { label: 'Keahlian', href: '#keahlian' },
    { label: 'Tentang', href: '#tentang' },
    { label: 'Kontak', href: '#kontak' },
  ]

  return (
    <header className={`clean-navbar-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="clean-navbar">
        {/* Brand */}
        <a href="#beranda" className="clean-nav-brand">
          <span className="brand-monogram">A.</span>
          <span className="brand-title">Alfari</span>
        </a>

        {/* Desktop Links */}
        <div className="clean-nav-links">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="clean-nav-link">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="clean-nav-actions">
          <ThemeToggle />
          <a href="#kontak" className="clean-nav-cta">
            <span>Kontak</span>
            <ArrowUpRight size={13} />
          </a>

          <button
            type="button"
            className="clean-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="clean-mobile-drawer">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="clean-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
