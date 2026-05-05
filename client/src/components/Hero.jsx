import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import heroDesktop from '../assets/hero/hero-desktop.jpg';
import heroTablet from '../assets/hero/hero-tablet.jpg';
import heroMobile from '../assets/hero/hero-mobile.jpg';

function Hero() {
  const { t, i18n } = useTranslation();
  const rotatingWords = useMemo(() => [t('hero.word1'), t('hero.word2'), t('hero.word3')], [t, i18n.language]);
  const [activeWord, setActiveWord] = useState(rotatingWords[0]);

  useEffect(() => {
    setActiveWord(rotatingWords[0]);
  }, [i18n.language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((current) => {
        const index = rotatingWords.indexOf(current);
        return rotatingWords[(index + 1) % rotatingWords.length];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [rotatingWords]);

  return (
    <section id="hero" className="hero section">
      <picture className="hero-media" aria-hidden="true">
        <source media="(min-width: 1024px)" srcSet={heroDesktop} />
        <source media="(min-width: 640px)" srcSet={heroTablet} />
        <img src={heroMobile} alt="" />
      </picture>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <p className="eyebrow">{t('hero.eyebrow')}</p>
        <h1>
          {t('hero.headingPrefix')} <span className="hero-word">{activeWord}</span>
        </h1>
        <p>{t('hero.body')}</p>
        <div className="hero-cta-group">
          <a className="btn btn-primary" href="#services">
            {t('hero.ctaServices')}
          </a>
          <a className="btn btn-secondary" href="#contact">
            {t('hero.ctaContact')}
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
