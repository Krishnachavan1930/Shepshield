
import React from 'react';
import PageLayout from '@/components/PageLayout';
import Contact from '@/components/Contact';
import SectionHeading from '@/components/SectionHeading';
import AnimatedSection from '@/components/AnimatedSection';

const ContactPage = () => {
  return (
    <PageLayout>
      <div className="pt-12 pb-24">
        <div className="container-wide">
          {/* <AnimatedSection animation="slide-up" className="mb-12">
            <SectionHeading
              title="Contact Our Team"
              subtitle="Get in touch with our sepsis care specialists to learn how we can help your healthcare facility."
            />
          </AnimatedSection> */}
          
          <Contact />
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
