import React from 'react';
import { Hero } from '../sections/Hero';
import { Services } from '../sections/Services';
import { FeaturedUniversities } from '../sections/FeaturedUniversities';
import { HowItWorks } from '../sections/HowItWorks';
import { Testimonials } from '../sections/Testimonials';
import { Contact } from '../sections/Contact';
import { Footer } from '../sections/Footer';

export const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedUniversities />
      <HowItWorks />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
};
