import React, { useEffect, useState } from 'react';
import heroDesktop from '../assets/hero/hero-desktop.jpg';
import heroTablet from '../assets/hero/hero-tablet.jpg';
import heroMobile from '../assets/hero/hero-mobile.jpg';

const rotatingWords = ['Restore', 'Hydrate', 'Glow'];

function Hero() {
  const [activeWord, setActiveWord] = useState(rotatingWords[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((current) => {
        const index = rotatingWords.indexOf(current);
        return rotatingWords[(index + 1) % rotatingWords.length];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="hero section">
      <picture className="hero-media" aria-hidden="true">
        <source media="(min-width: 1024px)" srcSet={heroDesktop} />
        <source media="(min-width: 640px)" srcSet={heroTablet} />
        <img src={heroMobile} alt="" />
      </picture>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <p className="eyebrow">Natural Skin Care SA by Norma Perry</p>
        <h1>
          Elevated Skin Rituals to <span className="hero-word">{activeWord}</span>
        </h1>
        <p>
          Gentle, natural skincare experiences tailored to your monthly wellness routine and long-term skin goals.
        </p>
        <div className="hero-cta-group">
          <a className="btn btn-primary" href="#services">
            View Services
          </a>
          <a className="btn btn-secondary" href="#contact">
            Book Appointment
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
