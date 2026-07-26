import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import FloatingFishingRod from "@/components/FloatingFishingRod";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Floating fishing rod — continues line from Hero + dangling cacing */}
      <FloatingFishingRod />

      <main className="flex-grow">
        <Hero />
        <AboutMe />
        <Services />
        <Projects />
        <Achievements />
        <Contact />
      </main>

      <footer className="w-full bg-black py-8 border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-center px-6 md:px-16 lg:px-24 text-slate-500 text-xs sm:text-sm gap-4 z-20">
        <div>
          © {new Date().getFullYear()} Aryo. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="#about-me" className="hover:text-brand-yellow transition-colors duration-200">About</a>
          <a href="#services" className="hover:text-brand-yellow transition-colors duration-200">Services</a>
          <a href="#projects" className="hover:text-brand-yellow transition-colors duration-200">Projects</a>
          <a href="#achievements" className="hover:text-brand-yellow transition-colors duration-200">Achievements</a>
          <a href="#contact" className="hover:text-brand-yellow transition-colors duration-200">Contact meeeeeeee</a>
        </div>
      </footer>
    </div>
  );
}
