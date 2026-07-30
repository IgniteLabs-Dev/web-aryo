import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import FloatingFishingRod from "@/components/FloatingFishingRod";

export default function HomePage() {
  return (
    <main className="relative">
      {/* Global fishing rod (render di luar sections, position: fixed) */}
      <FloatingFishingRod />

      {/* Sections */}
      <Hero />
      <AboutMe />
      <Services />
      <Projects />
      <Achievements />
      <Contact />
    </main>
  );
}
