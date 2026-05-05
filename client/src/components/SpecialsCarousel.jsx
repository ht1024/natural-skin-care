import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

function SpecialsCarousel() {
  const { t } = useTranslation();
  const specials = useMemo(
    () => [
      {
        title: t('specials.seed.seasonalGlow.title'),
        details: t('specials.seed.seasonalGlow.details'),
        cta: t('specials.seed.seasonalGlow.cta')
      },
      {
        title: t('specials.seed.newClient.title'),
        details: t('specials.seed.newClient.details'),
        cta: t('specials.seed.newClient.cta')
      },
      {
        title: t('specials.seed.wellnessReset.title'),
        details: t('specials.seed.wellnessReset.details'),
        cta: t('specials.seed.wellnessReset.cta')
      }
    ],
    [t]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % specials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [specials.length]);

  return (
    <div className="specials-carousel" aria-roledescription="carousel" aria-label={t('specials.ariaCarousel')}>
      <div className="specials-slides">
        {specials.map((special, index) => (
          <article
            key={special.title}
            className={`special-card ${index === activeIndex ? 'active' : ''}`}
            aria-hidden={index !== activeIndex}
          >
            <h3>{special.title}</h3>
            <p>{special.details}</p>
            <p className="special-cta">{special.cta}</p>
          </article>
        ))}
      </div>

      <div className="specials-controls" aria-label={t('specials.ariaNav')}>
        <button
          type="button"
          onClick={() => setActiveIndex((activeIndex - 1 + specials.length) % specials.length)}
          aria-label={t('specials.prev')}
        >
          &#8592;
        </button>
        <div className="dots">
          {specials.map((special, index) => (
            <button
              key={special.title}
              type="button"
              className={index === activeIndex ? 'dot active' : 'dot'}
              aria-label={t('specials.goTo', { title: special.title })}
              aria-current={index === activeIndex ? 'true' : 'false'}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActiveIndex((activeIndex + 1) % specials.length)}
          aria-label={t('specials.next')}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}

export default SpecialsCarousel;
