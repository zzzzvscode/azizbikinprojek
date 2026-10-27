import React from 'react';
import { Award, Code2, Trophy } from 'lucide-react';
import LiquidMetalBorder from './LiquidMetalBorder';
import texmacoLogo from '../assets/LOGO/texmaco.png';
import mobileTexmacoLogo from '../assets/LOGO/texmaco-mobile.webp';
import mtsLogo from '../assets/LOGO/masamujaya.png';
import mobileMtsLogo from '../assets/LOGO/masamujaya-mobile.webp';
import stekomLogo from '../assets/LOGO/stekom.png';
import mobileStekomLogo from '../assets/LOGO/stekom-mobile.webp';
import SkeletonImage from './SkeletonImage';
import '../style/ExperienceEducation.css';

const stats = [
  { label: 'Projects', detail: 'Karya yang dibuat', value: '3', Icon: Code2 },
  { label: 'Certificates', detail: 'Skill yang divalidasi', value: '3', Icon: Award },
  { label: 'Awards', detail: 'Pencapaian diraih', value: '1', Icon: Trophy },
];

export default function ExperienceEducation() {
  return (
    <section className="experience-section" aria-labelledby="experience-section-heading">
      <div className="experience-container">
        <div className="experience-columns">
          <div className="experience-group">
            <h2>Education</h2>
            <article className="experience-card">
              <div className="experience-logo">
                <SkeletonImage src={texmacoLogo} mobileSrc={mobileTexmacoLogo} alt="Logo SMK Texmaco Semarang" />
              </div>
              <div className="experience-card-copy">
                <h3>SMK Texmaco Semarang</h3>
                <p>Sekolah Menengah Kejuruan</p>
                <span className="experience-date">2024 – 2027</span>
              </div>
            </article>
            <article className="experience-card">
              <div className="experience-logo">
                <SkeletonImage src={mtsLogo} mobileSrc={mobileMtsLogo} alt="Logo MTs Muhammadiyah Jayapura" />
              </div>
              <div className="experience-card-copy">
                <h3>MTs Muhammadiyah Jayapura</h3>
                <p>Madrasah Tsanawiyah</p>
                <span className="experience-date">2021 – 2024</span>
              </div>
            </article>
          </div>

          <div className="experience-group">
            <h2>Experience</h2>
            <article className="experience-card">
              <div className="experience-logo">
                <SkeletonImage src={stekomLogo} mobileSrc={mobileStekomLogo} alt="Logo Universitas STEKOM" />
              </div>
              <div className="experience-card-copy">
                <h3>Universitas STEKOM</h3>
                <p>Admin</p>
              </div>
            </article>
          </div>
        </div>

        <div className="experience-stats" aria-label="Portfolio statistics">
          {stats.map(({ label, detail, value, Icon }) => (
            <article className="experience-stat-card" key={label}>
              <LiquidMetalBorder />
              <div className="experience-stat-top">
                <span className="experience-stat-icon">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <strong>{value}</strong>
              </div>
              <h3>{label}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
