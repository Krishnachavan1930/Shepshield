
import React from 'react';
import PageLayout from '@/components/PageLayout';
import About from '@/components/About';
import SectionHeading from '@/components/SectionHeading';
import AnimatedSection from '@/components/AnimatedSection';

const AboutPage = () => {
  return (
    <PageLayout>
      <div className="pt-12 pb-24">
        <div className="container-wide">
          <AnimatedSection animation="slide-up" className="mb-12">
            <SectionHeading
              title="About SepsisCare"
              subtitle="Learn about our mission to revolutionize sepsis detection through AI technology."
            />
          </AnimatedSection>
          
          <About />
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutPage;
