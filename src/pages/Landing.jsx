import Hero from '../components/landing/Hero';
import ProblemSection from '../components/landing/Problemsection';
import Impact from '../components/landing/Impact';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Services from '../components/landing/Services';
import Projects from '../components/landing/Projects';
import Testimonials from '../components/landing/Testimonials';
import CtaBanner from '../components/landing/CtaBanner';

export default function Landing() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <Features />
      <HowItWorks />
      <Services />
      <Projects />
      <Impact />
      <Testimonials />
      <CtaBanner />
    </>
  );
}