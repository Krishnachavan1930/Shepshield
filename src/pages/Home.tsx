
import React from 'react';
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Technology from '@/components/Technology';
import Doctors from '@/components/Doctors';
import About from '@/components/About';
import Contact from '@/components/Contact';

const Home = () => {
  return (
    <PageLayout>
      <Hero />
      <Services />
      <Technology />
      <Doctors />
      <About />
      <Contact />
    </PageLayout>
  );
};

export default Home;
