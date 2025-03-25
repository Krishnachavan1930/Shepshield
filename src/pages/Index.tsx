
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Technology from '@/components/Technology';
import Doctors from '@/components/Doctors';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Technology />
        <Doctors />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
