import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MegaMenu from './components/MegaMenu';
import Hero from './components/Hero';
import SpecialsCarousel from './components/SpecialsCarousel';
import { serviceCards, waxingServices } from './data/services';

function App() {
  const { t, i18n } = useTranslation();
  const [marketingStatus, setMarketingStatus] = useState('idle');
  const [marketingError, setMarketingError] = useState('');

  useEffect(() => {
    document.title = t('meta.title');
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', t('meta.description'));
    }
  }, [i18n.language, t]);

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
        setMarketingError(payload.error || t('contact.fallbackError'));
        return;
      }

      setMarketingStatus('success');
      form.reset();
    } catch {
      setMarketingStatus('error');
      setMarketingError(t('contact.offlineError'));
    }
  }

  return (
    <>
      <MegaMenu />
      <main>
        <Hero />

        <section id="about" className="section about">
          <div className="content-wrap">
            <h2>{t('about.heading')}</h2>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
          </div>
        </section>

        <section id="services" className="section services">
          <div className="content-wrap">
            <h2>{t('services.heading')}</h2>
            <p className="section-intro">{t('services.intro')}</p>
            <p>{t('services.overview')}</p>

            <div className="service-grid" role="list" aria-label={t('services.ariaOfferings')}>
              {serviceCards.map((serviceKey) => (
                <article key={serviceKey} className="service-card" role="listitem">
                  <h3>{t(`services.cards.${serviceKey}.title`)}</h3>
                  <p className="duration">{t(`services.cards.${serviceKey}.duration`)}</p>
                  <p>{t(`services.cards.${serviceKey}.description`)}</p>
                </article>
              ))}
            </div>

            <article className="waxing-list">
              <h3>{t('services.waxingHeading')}</h3>
              <ul>
                {waxingServices.map((itemKey) => (
                  <li key={itemKey}>{t(`services.waxingItems.${itemKey}`)}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="specials" className="section specials">
          <div className="content-wrap">
            <h2>{t('specials.heading')}</h2>
            <SpecialsCarousel />
            <p className="specials-copy">{t('specials.intro')}</p>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="content-wrap">
            <div className="contact-layout">
              <div className="contact-layout__intro">
                <h2>{t('contact.heading')}</h2>
                <p>{t('contact.appointments')}</p>
                <p>
                  {t('contact.emailLabel')} <a href="mailto:normacperry@gmail.com">normacperry@gmail.com</a>
                  <br />
                  {t('contact.phoneLabel')} <a href="tel:+12108879339">(210) 887-9339</a>
                </p>
              </div>

              <div className="marketing-signup">
                <h3 className="marketing-signup__title">{t('contact.emailListTitle')}</h3>
                <p className="marketing-signup__intro">{t('contact.emailListIntro')}</p>
                <form
                  className="marketing-signup__form"
                  aria-label={t('contact.signupAria')}
                  onSubmit={handleMarketingSubmit}
                >
                  <label htmlFor="marketingFirstName">{t('contact.firstNameLabel')}</label>
                  <input
                    id="marketingFirstName"
                    name="marketingFirstName"
                    type="text"
                    autoComplete="given-name"
                  />

                  <label htmlFor="marketingEmail">{t('contact.emailInputLabel')}</label>
                  <input
                    id="marketingEmail"
                    name="marketingEmail"
                    type="email"
                    autoComplete="email"
                    required
                  />

                  <label className="marketing-signup__consent">
                    <input type="checkbox" name="marketingConsent" value="yes" required />
                    <span>{t('contact.consent')}</span>
                  </label>

                  {marketingStatus === 'success' && (
                    <p className="contact-form-feedback contact-form-feedback--success" role="status">
                      {t('contact.success')}
                    </p>
                  )}
                  {marketingStatus === 'error' && marketingError && (
                    <p className="contact-form-feedback contact-form-feedback--error" role="alert">
                      {marketingError}
                    </p>
                  )}

                  <button type="submit" className="btn btn-primary" disabled={marketingStatus === 'sending'}>
                    {marketingStatus === 'sending' ? t('contact.submitSending') : t('contact.submitIdle')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>{t('meta.title')}</p>
        <p>18834 Stone Oak Pkwy, Suite 104, San Antonio, TX 78258</p>
        <p>
          <a href="tel:+12108879339">(210) 887-9339</a> |{' '}
          <a href="mailto:normacperry@gmail.com">normacperry@gmail.com</a>
        </p>
        <p>
          &copy; {new Date().getFullYear()} Natural Skin Care SA. {t('footer.rights')}
        </p>
      </footer>
    </>
  );
}

export default App;
