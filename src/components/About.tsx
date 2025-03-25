
import React from 'react';
import { Shield, Award, HeartPulse, Activity } from 'lucide-react';
import SectionHeading from './SectionHeading';
import AnimatedSection from './AnimatedSection';
import AnimatedCounter from './AnimatedCounter';
import { cn } from '@/lib/utils';

const About = () => {
  return (
    <section id="about" className="section">
      <div className="container-wide">
        <AnimatedSection animation="slide-up">
          <SectionHeading 
            title="About SepsisCare"
            subtitle="We're dedicated to revolutionizing sepsis care through advanced technology and medical expertise."
          />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <AnimatedSection animation="slide-right" className="space-y-6">
            <h3 className="text-2xl font-semibold font-display">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              At SepsisCare, we're on a mission to dramatically reduce sepsis-related mortality by enabling healthcare providers with cutting-edge technology for early detection and intervention.
            </p>
            
            <h3 className="text-2xl font-semibold font-display pt-4">Our Approach</h3>
            <p className="text-muted-foreground leading-relaxed">
              We combine advanced machine learning algorithms with clinical expertise to create solutions that integrate seamlessly into existing healthcare workflows, ensuring adoption and maximum impact.
            </p>
            
            <div className="grid grid-cols-2 gap-8 py-6">
              <ValueItem 
                icon={<Shield className="h-5 w-5" />}
                title="Patient-Centered"
                description="Everything we do prioritizes patient outcomes and safety."
              />
              
              <ValueItem 
                icon={<Award className="h-5 w-5" />}
                title="Excellence"
                description="We strive for the highest quality in technology and care."
              />
              
              <ValueItem 
                icon={<HeartPulse className="h-5 w-5" />}
                title="Compassion"
                description="We approach healthcare with empathy and understanding."
              />
              
              <ValueItem 
                icon={<Activity className="h-5 w-5" />}
                title="Innovation"
                description="We continuously evolve our approach to improve outcomes."
              />
            </div>
          </AnimatedSection>
          
          {/* Image Side */}
          <AnimatedSection animation="slide-left" className="space-y-8">
            <div className="aspect-video overflow-hidden rounded-2xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Hospital facility" 
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <StatsCard 
                value={<AnimatedCounter end={12} className="text-3xl" />}
                label="Years of Excellence"
                color="bg-gradient-to-br from-blue-50 to-blue-100"
              />
              
              <StatsCard 
                value={<AnimatedCounter end={250} suffix="+" className="text-3xl" />}
                label="Hospital Partners"
                color="bg-gradient-to-br from-teal-50 to-teal-100"
              />
              
              <StatsCard 
                value={<AnimatedCounter end={50000} suffix="+" className="text-3xl" />}
                label="Patients Monitored"
                color="bg-gradient-to-br from-indigo-50 to-indigo-100"
              />
              
              <StatsCard 
                value={<AnimatedCounter end={2500} suffix="+" className="text-3xl" />}
                label="Lives Saved"
                color="bg-gradient-to-br from-purple-50 to-purple-100"
              />
            </div>
          </AnimatedSection>
        </div>
        
        {/* Timeline */}
        <AnimatedSection animation="fade-in" className="mt-24">
          <h3 className="text-2xl font-semibold font-display text-center mb-12">Our Journey</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-border"></div>
            
            <div className="space-y-24">
              <TimelineItem 
                year="2011"
                title="SepsisCare Founded"
                description="Established with a mission to transform sepsis care through technology."
                isLeft={true}
              />
              
              <TimelineItem 
                year="2014"
                title="First ML Algorithm"
                description="Developed our first machine learning model for sepsis prediction."
                isLeft={false}
              />
              
              <TimelineItem 
                year="2017"
                title="Hospital Implementation"
                description="Successfully deployed our technology in 50 hospitals across the country."
                isLeft={true}
              />
              
              <TimelineItem 
                year="2020"
                title="Advanced Platform Launch"
                description="Released our comprehensive sepsis management platform with real-time monitoring."
                isLeft={false}
              />
              
              <TimelineItem 
                year="2023"
                title="Global Expansion"
                description="Expanded to international markets, now serving hospitals in 15 countries."
                isLeft={true}
              />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

interface ValueItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueItem: React.FC<ValueItemProps> = ({ icon, title, description }) => (
  <div className="space-y-2">
    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
      {icon}
    </div>
    <h4 className="font-medium">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

interface StatsCardProps {
  value: React.ReactNode;
  label: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label, color }) => (
  <div className={cn("p-4 rounded-xl text-center", color)}>
    <div className="font-bold">{value}</div>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLeft: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description, isLeft }) => (
  <div className="relative">
    {/* Center Dot */}
    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 border-background bg-primary"></div>
    
    {/* Content */}
    <AnimatedSection 
      animation={isLeft ? "slide-right" : "slide-left"} 
      className={cn(
        "w-full md:w-[calc(50%-2rem)] p-6 rounded-xl bg-muted/50 shadow-sm",
        isLeft ? "md:mr-auto" : "md:ml-auto"
      )}
    >
      <div className="text-sm font-medium text-primary">{year}</div>
      <h4 className="text-lg font-medium mt-1">{title}</h4>
      <p className="text-muted-foreground mt-1">{description}</p>
    </AnimatedSection>
  </div>
);

export default About;
