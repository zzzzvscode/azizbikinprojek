import React from 'react';
import alAmanahLogo from '../assets/LOGO/al-amanah.png';
import SkeletonImage from './SkeletonImage';
import '../style/ExperienceEducation.css';

export default function ExperienceEducation() {
  return (
    <section className="experience-section" aria-labelledby="experience-section-heading">
      <div className="experience-container">
        <div className="experience-columns">
          <div className="experience-group">
            <h2 id="experience-section-heading">Education</h2>
            <article className="experience-card">
              <div className="experience-logo">
                <SkeletonImage src={alAmanahLogo} alt="Logo SMK Al Amanah" />
              </div>
              <div className="experience-card-copy">
                <h3>SMK Al Amanah</h3>
                <p>Sekolah Menengah Kejuruan</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
