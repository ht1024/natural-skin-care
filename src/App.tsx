import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContactBanner from "@/components/ContactBanner";
import About from "@/components/About";
import Services from "@/components/Services";
import Waxing from "@/components/Waxing";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <Hero />
        <ContactBanner />
        <About />
        <Services />
        <Waxing />
        <ContactForm />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
