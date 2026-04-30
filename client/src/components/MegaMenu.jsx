import React, { useEffect, useRef, useState } from 'react';

const topLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#specials', label: 'Specials' },
  { href: '#contact', label: 'Contact' }
];

const serviceColumns = [
  {
    heading: 'Facials',
    links: [
      { href: '#services', label: 'Express Facial' },
      { href: '#services', label: 'Deep Cleansing Facial' },
      { href: '#services', label: 'Deluxe Anti-Aging' }
    ]
  },
  {
    heading: 'Advanced Care',
    links: [
      { href: '#services', label: 'Gold Anti-Aging' },
      { href: '#services', label: 'LamProbe' },
      { href: '#services', label: 'Microcurrent Treatments' }
    ]
  },
  {
    heading: 'Wellness & Waxing',
    links: [
      { href: '#services', label: 'Reflexology' },
      { href: '#services', label: 'Waxing Services' },
      { href: '#contact', label: 'Book Appointment' }
    ]
  }
];

function MegaMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const navRef = useRef(null);

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
      <nav className="mega-nav" aria-label="Primary navigation" ref={navRef}>
        <a className="brand" href="#hero" onClick={closeAllMenus}>
          Natural Skin Care SA
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          Menu
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
                Services
              </button>
              <div
                id="services-mega-menu"
                className={`services-mega-menu ${servicesOpen ? 'open' : ''}`}
                role="group"
                aria-label="Services menu"
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
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default MegaMenu;
