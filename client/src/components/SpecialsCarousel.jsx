import React, { useEffect, useMemo, useState } from 'react';

const specialsSeed = [
  {
    title: 'Seasonal Glow Special',
    details: 'Placeholder offer: Save on a Deep Cleansing Facial + brow wax combo this month.',
    cta: 'Contact Norma to confirm current pricing'
  },
  {
    title: 'New Client Welcome',
    details: 'Placeholder offer: First-time guests receive an add-on hydration boost.',
    cta: 'Mention this special during booking'
  },
  {
    title: 'Wellness Reset Package',
    details: 'Placeholder offer: Bundle reflexology with a facial treatment for total relaxation.',
    cta: 'Ask about available appointment times'
  }
];

function SpecialsCarousel() {
  const specials = useMemo(() => specialsSeed, []);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % specials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [specials.length]);

  return (
    <div className="specials-carousel" aria-roledescription="carousel" aria-label="Current specials">
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

      <div className="specials-controls" aria-label="Specials navigation">
        <button
          type="button"
          onClick={() => setActiveIndex((activeIndex - 1 + specials.length) % specials.length)}
          aria-label="Previous special"
        >
          &#8592;
        </button>
        <div className="dots">
          {specials.map((special, index) => (
            <button
              key={special.title}
              type="button"
              className={index === activeIndex ? 'dot active' : 'dot'}
              aria-label={`Go to ${special.title}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActiveIndex((activeIndex + 1) % specials.length)}
          aria-label="Next special"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}

export default SpecialsCarousel;
