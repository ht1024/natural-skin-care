import React from 'react';
import MegaMenu from './components/MegaMenu';
import Hero from './components/Hero';
import SpecialsCarousel from './components/SpecialsCarousel';
import { serviceCards, waxingServices } from './data/services';

function App() {
  return (
    <>
      <MegaMenu />
      <main>
        <Hero />

        <section id="about" className="section about">
          <div className="content-wrap">
            <h2>About Natural Skin Care SA by Norma Perry</h2>
            <p>
              Natural Skin Care SA by Norma Perry is rooted in gentle, personalized care using thoughtfully selected natural products.
              Every treatment is designed to support healthy skin function, calm sensitivity, and reveal a balanced, luminous complexion.
            </p>
            <p>
              Monthly skincare sessions help maintain progress, prevent buildup, and keep your skin looking refreshed all year long.
              Norma combines professional techniques with a relaxing spa atmosphere so each visit supports both skin health and stress relief.
            </p>
          </div>
        </section>

        <section id="services" className="section services">
          <div className="content-wrap">
            <h2>Services</h2>
            <p className="section-intro">
              Explore customized skincare and wellness treatments designed for visible results and restorative self-care.
            </p>

            <div className="service-grid" role="list" aria-label="Service offerings">
              {serviceCards.map((service) => (
                <article key={service.title} className="service-card" role="listitem">
                  <h3>{service.title}</h3>
                  <p className="duration">{service.duration}</p>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>

            <article className="waxing-list">
              <h3>Waxing Services</h3>
              <ul>
                {waxingServices.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="specials" className="section specials">
          <div className="content-wrap">
            <h2>Specials</h2>
            <SpecialsCarousel />
            <p className="specials-copy">
              Specials are refreshed regularly based on seasonal skincare goals and appointment availability.
              Placeholder promotions are currently shown and will be replaced with Norma&#39;s current offers.
            </p>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="content-wrap">
            <h2>Contact</h2>
            <p>Appointments are available by reservation only.</p>
            <p>
              Email: <a href="mailto:naturalskincaresa@example.com">naturalskincaresa@example.com</a>
              <br />
              Phone: <a href="tel:+12105551234">(210) 555-1234</a>
            </p>
            <form className="contact-form" aria-label="Contact form">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" />

              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" />

              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="4" />

              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Natural Skin Care SA by Norma Perry</p>
        <p>1234 Wellness Avenue, San Antonio, TX</p>
        <p>
          <a href="tel:+12105551234">(210) 555-1234</a> |{' '}
          <a href="mailto:naturalskincaresa@example.com">naturalskincaresa@example.com</a>
        </p>
        <p>&copy; {new Date().getFullYear()} Natural Skin Care SA. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
