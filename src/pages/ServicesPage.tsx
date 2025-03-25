
import React from 'react';
import PageLayout from '@/components/PageLayout';
import Services from '@/components/Services';
import SectionHeading from '@/components/SectionHeading';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  return (
    <PageLayout>
      <div className="pt-12 pb-24">
        <div className="container-wide">
          <AnimatedSection animation="slide-up" className="mb-12">
            <SectionHeading
              title="Our Healthcare Services"
              subtitle="Comprehensive sepsis detection and management services powered by advanced AI technology."
            />
          </AnimatedSection>
          
          <Services />
          
          <AnimatedSection animation="fade-in" className="mt-16 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Want to learn more about how our sepsis detection platform can help your healthcare facility? 
              Contact our team for a personalized demonstration.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </div>
    </PageLayout>
  );
};

export default ServicesPage;
