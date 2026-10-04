import { useReveal } from "@/hooks/useReveal";

export default function About() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-20 md:py-28 bg-cream-50">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center reveal ${visible ? "visible" : ""}`}
      >
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.pexels.com/photos/5912003/pexels-photo-5912003.jpeg?auto=compress&cs=tinysrgb&w=940"
              alt="Natural skincare products"
              referrerPolicy="no-referrer"
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-gold-500 text-white px-8 py-6 rounded-2xl shadow-xl hidden md:block">
            <p className="font-serif text-3xl font-light">Norma</p>
            <p className="text-sm tracking-wide text-gold-100">Perry, Founder</p>
          </div>
        </div>

        <div>
          <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-4">Our Philosophy</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-light leading-tight mb-6">
            Natural Skin Care SA by Norma Perry
          </h2>
          <p className="text-charcoal/70 text-base leading-relaxed mb-5">
            Rooted in gentle, personalized care using thoughtfully selected natural products. Every treatment is designed to support healthy skin function, calm sensitivity, and reveal a balanced, luminous complexion.
          </p>
          <p className="text-charcoal/70 text-base leading-relaxed mb-5">
            Monthly skincare sessions help maintain progress, prevent buildup, and keep your skin looking refreshed all year long. Norma combines professional techniques with a relaxing spa atmosphere so each visit supports both skin health and stress relief.
          </p>
          <div className="flex gap-8 mt-8">
            <div>
              <p className="font-serif text-3xl text-sage-600 font-light">100%</p>
              <p className="text-xs text-charcoal/50 tracking-wide uppercase mt-1">Natural Products</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-sage-600 font-light">1-on-1</p>
              <p className="text-xs text-charcoal/50 tracking-wide uppercase mt-1">Personalized Care</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-sage-600 font-light">By Res.</p>
              <p className="text-xs text-charcoal/50 tracking-wide uppercase mt-1">Appointment Only</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
