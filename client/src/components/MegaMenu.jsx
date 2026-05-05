import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function MegaMenu() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const navRef = useRef(null);
  const topLinks = [
    { href: '#hero', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#specials', label: t('nav.specials') },
    { href: '#contact', label: t('nav.contact') }
  ];
  const serviceColumns = [
    {
      heading: t('nav.facials'),
      links: [
        { href: '#services', label: t('services.cards.expressFacial.title') },
        { href: '#services', label: t('services.cards.deepCleansing.title') },
        { href: '#services', label: t('services.cards.deluxeAntiAging.title') }
      ]
    },
    {
      heading: t('nav.advancedCare'),
      links: [
        { href: '#services', label: t('services.cards.goldAntiAging.title') },
        { href: '#services', label: t('services.cards.lamprobe.title') },
        { href: '#services', label: t('services.cards.faceNeckMicrocurrent.title') }
      ]
    },
    {
      heading: t('nav.wellnessWaxing'),
      links: [
        { href: '#services', label: t('services.cards.reflexology.title') },
        { href: '#services', label: t('services.waxingHeading') },
        { href: '#contact', label: t('nav.bookAppointment') }
      ]
    }
  ];

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="mega-nav" aria-label={t('nav.ariaPrimary')} ref={navRef}>
        <a className="brand" href="#hero" onClick={closeAllMenus}>
          {t('nav.brand')}
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {t('nav.menu')}
        </button>

        <div id="main-menu" className={`menu-panel ${menuOpen ? 'open' : ''}`}>
          <ul className="menu-list">
            {topLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={closeAllMenus}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="services-item">
              <button
                type="button"
                className="services-trigger"
                aria-expanded={servicesOpen}
                aria-controls="services-mega-menu"
                onClick={() => setServicesOpen((prev) => !prev)}
              >
                {t('nav.services')}
              </button>
              <div
                id="services-mega-menu"
                className={`services-mega-menu ${servicesOpen ? 'open' : ''}`}
                role="group"
                aria-label={t('nav.servicesAria')}
              >
                {serviceColumns.map((column) => (
                  <section key={column.heading} className="services-column">
                    <h3>{column.heading}</h3>
                    <ul>
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <a href={link.href} onClick={closeAllMenus}>
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </li>
            <li className="language-switcher">
              <span>{t('nav.language')}:</span>
              <button
                type="button"
                className={`language-btn ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`language-btn ${i18n.language === 'es' ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage('es')}
              >
                ES
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default MegaMenu;
