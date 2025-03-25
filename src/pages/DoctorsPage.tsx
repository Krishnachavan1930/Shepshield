
import React from 'react';
import PageLayout from '@/components/PageLayout';
import Doctors from '@/components/Doctors';
import SectionHeading from '@/components/SectionHeading';
import AnimatedSection from '@/components/AnimatedSection';

const DoctorsPage = () => {
  return (
    <PageLayout>
      <div className="pt-12 pb-24">
        <div className="container-wide">
          <AnimatedSection animation="slide-up" className="mb-12">
            <SectionHeading
              title="Our Medical Specialists"
              subtitle="Meet our team of experienced physicians specializing in sepsis detection and treatment."
            />
          </AnimatedSection>
          
          <Doctors />
        </div>
      </div>
    </PageLayout>
  );
};

export default DoctorsPage;
