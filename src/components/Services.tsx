import { featuredTreatments } from "@/data/services";
import { useReveal } from "@/hooks/useReveal";
import { Clock, DollarSign } from "lucide-react";

export default function Services() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="services" className="py-20 md:py-28 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-4">Our Services</p>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light mb-4">
            Featured Treatments
          </h2>
          <p className="text-charcoal/60 text-base max-w-2xl mx-auto leading-relaxed">
            Explore customized skincare and wellness treatments designed for visible results and restorative self-care. Each facial includes deep cleansing, exfoliation, and gentle extractions.
          </p>
        </div>

        <div
          ref={ref}
          className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 reveal ${visible ? "visible" : ""}`}
        >
          {featuredTreatments.map((t) => (
            <article
              key={t.name}
              className="group bg-cream-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={t.image}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 bg-charcoal/40 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3" /> {t.duration}
                  </span>
                  <span className="flex items-center gap-1 bg-gold-500/80 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                    <DollarSign className="w-3 h-3" /> {t.price}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl text-charcoal font-medium mb-2 group-hover:text-gold-600 transition-colors">
                  {t.name}
                </h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">{t.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
