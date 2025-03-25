
import React from 'react';
import { Activity, FileText, Stethoscope, Brain, BarChart3, Shield } from 'lucide-react';
import SectionHeading from './SectionHeading';
import AnimatedSection from './AnimatedSection';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, delay = 0 }) => (
  <AnimatedSection animation="scale" delay={delay}>
    <Card className="hover-scale h-full">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  </AnimatedSection>
);

const Services = () => {
  return (
    <section id="services" className="section bg-muted/50 overflow-hidden">
      <div className="container-wide">
        <AnimatedSection animation="slide-up">
          <SectionHeading 
            title="Our Services"
            subtitle="We provide comprehensive healthcare services with a focus on early sepsis detection and management."
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard 
            icon={<Activity className="h-6 w-6" />}
            title="Real-time Sepsis Monitoring"
            description="Continuous monitoring of patient vitals and biomarkers to detect early signs of sepsis using our advanced ML algorithms."
            delay={100}
          />
          
          <ServiceCard 
            icon={<Brain className="h-6 w-6" />}
            title="AI-Powered Risk Assessment"
            description="Machine learning models that analyze patient data to predict sepsis risk before clinical symptoms appear."
            delay={200}
          />
          
          <ServiceCard 
            icon={<FileText className="h-6 w-6" />}
            title="Patient Report Analysis"
            description="Upload and analyze patient reports in various formats to extract critical information for sepsis prediction."
            delay={300}
          />
          
          <ServiceCard 
            icon={<Stethoscope className="h-6 w-6" />}
            title="Expert Medical Consultation"
            description="Connect with specialists experienced in infectious diseases and sepsis management for patient care."
            delay={400}
          />
          
          <ServiceCard 
            icon={<BarChart3 className="h-6 w-6" />}
            title="Advanced Analytics Dashboard"
            description="Comprehensive analytics platform providing insights into patient trends, treatment efficacy, and hospital performance."
            delay={500}
          />
          
          <ServiceCard 
            icon={<Shield className="h-6 w-6" />}
            title="Secure Patient Data Management"
            description="HIPAA-compliant, encrypted storage and management of sensitive patient information with role-based access."
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
