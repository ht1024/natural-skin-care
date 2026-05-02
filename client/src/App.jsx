import React, { useState } from 'react';
import MegaMenu from './components/MegaMenu';
import Hero from './components/Hero';
import SpecialsCarousel from './components/SpecialsCarousel';
import { serviceCards, waxingServices } from './data/services';

function App() {
  const [marketingStatus, setMarketingStatus] = useState('idle');
  const [marketingError, setMarketingError] = useState('');

  async function handleMarketingSubmit(event) {
    event.preventDefault();
    setMarketingError('');
    setMarketingStatus('sending');

    const form = event.currentTarget;
    const consentChecked = form.querySelector('input[name="marketingConsent"]')?.checked === true;

    const data = {
      email: form.marketingEmail.value,
      firstName: form.marketingFirstName.value,
      consent: consentChecked
    };

    try {
      const response = await fetch('/api/marketing-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMarketingStatus('error');
        setMarketingError(payload.error || 'Something went wrong. Please try again.');
        return;
      }

      setMarketingStatus('success');
      form.reset();
    } catch {
      setMarketingStatus('error');
      setMarketingError('Could not reach the server. Try again later or use the email link above.');
    }
  }

  return (
    <>
      <MegaMenu />
      <main>
        <Hero />

        <section id="about" className="section about">
          <div className="content-wrap">
            <h2>Natural Skin Care SA by Norma Perry</h2>
            {/* <p>We offer skincare services that focus on natural products and gentle treatments. Our goal is to help your skin look and feel its best using safe, simple, and effective methods.</p>
            <p>We use high-quality, natural, and organic product lines to deliver safe and effective results. Monthly treatments are recommended to maintain healthy, glowing skin, prevent signs of aging, and keep your skin clean and hydrated.</p> */}
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
            <p>Each facial includes deep cleansing, exfoliation, and gentle extractions to leave your skin smooth and clear. A revitalizing mask and light facial massage complete the experience, helping to restore and nourish your skin.</p>

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
            <div className="contact-layout">
              <div className="contact-layout__intro">
                <h2>Contact</h2>
                <p>Appointments are available by reservation only.</p>
                <p>
                  Email: <a href="mailto:normacperry@gmail.com">normacperry@gmail.com</a>
                  <br />
                  Phone: <a href="tel:+12108879339">(210) 887-9339</a>
                </p>
              </div>

              <div className="marketing-signup">
                <h3 className="marketing-signup__title">Email list</h3>
                <p className="marketing-signup__intro">
                  Get occasional updates on specials, seasonal treatments, and skincare tips.
                </p>
                <form
                  className="marketing-signup__form"
                  aria-label="Marketing email signup"
                  onSubmit={handleMarketingSubmit}
                >
                  <label htmlFor="marketingFirstName">First name (optional)</label>
                  <input
                    id="marketingFirstName"
                    name="marketingFirstName"
                    type="text"
                    autoComplete="given-name"
                  />

                  <label htmlFor="marketingEmail">Email</label>
                  <input
                    id="marketingEmail"
                    name="marketingEmail"
                    type="email"
                    autoComplete="email"
                    required
                  />

                  <label className="marketing-signup__consent">
                    <input type="checkbox" name="marketingConsent" value="yes" required />
                    <span>
                      I agree to receive occasional marketing emails about specials and studio news. I can unsubscribe
                      anytime.
                    </span>
                  </label>

                  {marketingStatus === 'success' && (
                    <p className="contact-form-feedback contact-form-feedback--success" role="status">
                      You&apos;re on the list—watch your inbox for specials and skincare tips.
                    </p>
                  )}
                  {marketingStatus === 'error' && marketingError && (
                    <p className="contact-form-feedback contact-form-feedback--error" role="alert">
                      {marketingError}
                    </p>
                  )}

                  <button type="submit" className="btn btn-primary" disabled={marketingStatus === 'sending'}>
                    {marketingStatus === 'sending' ? 'Joining…' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Natural Skin Care SA by Norma Perry</p>
        <p>18834 Stone Oak Pkwy, Suite 104, San Antonio, TX 78258</p>
        <p>
          <a href="tel:+12108879339">(210) 887-9339</a> |{' '}
          <a href="mailto:normacperry@gmail.com">normacperry@gmail.com</a>
        </p>
        <p>&copy; {new Date().getFullYear()} Natural Skin Care SA. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
