import { Suspense, lazy, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContactFormErrorBoundary from "@/components/ContactFormErrorBoundary";
import { LanguageProvider } from "@/context/LanguageContext";

const ContactBanner = lazy(() => import("@/components/ContactBanner"));
const About = lazy(() => import("@/components/About"));
const Services = lazy(() => import("@/components/Services"));
const Waxing = lazy(() => import("@/components/Waxing"));
const Footer = lazy(() => import("@/components/Footer"));
const ContactForm = lazy(() => import("@/components/ContactForm"));

function App() {
  const [showContactForm, setShowContactForm] = useState(false);
  const contactRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (showContactForm) return;
    const el = contactRef.current;
    if (!el) return;

    const load = () => setShowContactForm(true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);

    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href="#contact"]');
      if (anchor) load();
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onAnchorClick);
    };
  }, [showContactForm]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <Hero />
        <Suspense fallback={null}>
          <ContactBanner />
          <About />
          <Services />
          <Waxing />
        </Suspense>
        <section id="contact" ref={contactRef} className="py-20 md:py-28 bg-cream-50">
          <ContactFormErrorBoundary>
            <Suspense fallback={<div className="min-h-[40vh]" aria-hidden="true" />}>
              {showContactForm ? (
                <ContactForm />
              ) : (
                <div className="min-h-[40vh]" aria-hidden="true" />
              )}
            </Suspense>
          </ContactFormErrorBoundary>
        </section>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </LanguageProvider>
  );
}

export default App;
