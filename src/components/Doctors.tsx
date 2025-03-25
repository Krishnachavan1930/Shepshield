
import React from 'react';
import { Calendar, Mail, ExternalLink } from 'lucide-react';
import SectionHeading from './SectionHeading';
import AnimatedSection from './AnimatedSection';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DoctorCardProps {
  image: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  email: string;
  delay?: number;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ 
  image, 
  name, 
  role, 
  specialty, 
  experience, 
  email,
  delay = 0
}) => (
  <AnimatedSection animation="scale" delay={delay}>
    <div className="group relative overflow-hidden rounded-2xl shadow-md hover-scale bg-white">
      {/* Image */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-sm text-white/80">{role}</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary">
            <Calendar className="h-4 w-4 mr-1" />
            Book
          </Button>
        </div>
        
        {/* Hidden details that appear on hover */}
        <div className="mt-4 space-y-2 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-sm"><span className="font-medium">Specialty:</span> {specialty}</p>
          <p className="text-sm"><span className="font-medium">Experience:</span> {experience}</p>
          <div className="flex items-center pt-2">
            <Button variant="ghost" size="sm" className="p-0 h-auto text-white/80 hover:text-white">
              <Mail className="h-4 w-4 mr-1" />
              <span className="text-xs">{email}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AnimatedSection>
);

const Doctors = () => {
  const doctors = [
    {
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Dr. Sarah Johnson",
      role: "Chief of Infectious Disease",
      specialty: "Infectious Disease, Sepsis Management",
      experience: "15+ years",
      email: "s.johnson@sepsiscare.med"
    },
    {
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Dr. Michael Chen",
      role: "Medical Director",
      specialty: "Internal Medicine, Critical Care",
      experience: "12+ years",
      email: "m.chen@sepsiscare.med"
    },
    {
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Dr. Amara Okafor",
      role: "AI Research Lead",
      specialty: "Medical Informatics, ML Applications",
      experience: "8+ years",
      email: "a.okafor@sepsiscare.med"
    },
    {
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Dr. James Wilson",
      role: "Emergency Medicine Specialist",
      specialty: "Emergency Medicine, Rapid Response",
      experience: "10+ years",
      email: "j.wilson@sepsiscare.med"
    }
  ];

  return (
    <section id="doctors" className="section bg-muted/30">
      <div className="container-wide">
        <AnimatedSection animation="slide-up">
          <SectionHeading 
            title="Meet Our Specialists"
            subtitle="Our team of expert physicians specializes in infectious disease management and early sepsis detection."
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <DoctorCard 
              key={doctor.name}
              {...doctor}
              delay={index * 100}
            />
          ))}
        </div>
        
        <AnimatedSection animation="fade-in" className="text-center mt-12">
          <Button variant="outline" className="group">
            View All Doctors
            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Doctors;
