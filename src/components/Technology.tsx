
import React from 'react';
import { Cpu, BarChart3, Clock, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';
import AnimatedSection from './AnimatedSection';
import AnimatedCounter from './AnimatedCounter';
import { cn } from '@/lib/utils';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description, delay = 0 }) => (
  <AnimatedSection animation="slide-up" delay={delay} className="flex gap-4">
    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </AnimatedSection>
);

const Technology = () => {
  return (
    <section id="technology" className="section overflow-hidden">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <AnimatedSection animation="slide-right" className="relative order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="AI technology for sepsis detection" 
                  className="rounded-3xl shadow-lg w-full"
                />
                
                {/* Floating Elements */}
                <div className="absolute top-4 left-4 glass-card p-3 rounded-xl shadow-lg animate-float">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    <div className="text-sm font-medium">ML Processing</div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 glass-card p-3 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <div className="text-sm font-medium">Risk Alert</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <StatsCard 
                title="Faster Detection" 
                value={<AnimatedCounter end={94} suffix="%" className="text-3xl" />}
                description="Earlier than traditional methods"
                className="bg-gradient-to-br from-blue-50 to-blue-100"
              />
              
              <StatsCard 
                title="Accuracy" 
                value={<AnimatedCounter end={98} suffix="%" className="text-3xl" />}
                description="Precision in prediction"
                className="bg-gradient-to-br from-teal-50 to-teal-100"
              />
            </div>
          </AnimatedSection>
          
          {/* Text Side */}
          <div className="space-y-8 order-1 lg:order-2">
            <AnimatedSection animation="slide-left">
              <SectionHeading 
                title="AI-Powered Sepsis Detection Technology"
                subtitle="Our cutting-edge machine learning algorithms detect sepsis hours before traditional methods, giving healthcare providers the critical time needed for effective intervention."
                centered={false}
              />
            </AnimatedSection>
            
            <div className="space-y-8">
              <FeatureItem 
                icon={<Cpu className="h-6 w-6" />}
                title="Advanced Machine Learning Algorithms"
                description="Our models are trained on millions of patient records to identify subtle patterns indicative of early sepsis development."
                delay={100}
              />
              
              <FeatureItem 
                icon={<BarChart3 className="h-6 w-6" />}
                title="Comprehensive Data Analysis"
                description="Integration of vital signs, lab results, medications, and electronic health records for holistic patient assessment."
                delay={200}
              />
              
              <FeatureItem 
                icon={<Clock className="h-6 w-6" />}
                title="Real-time Monitoring System"
                description="Continuous evaluation of patient status with alerts for subtle changes that may indicate sepsis onset."
                delay={300}
              />
              
              <FeatureItem 
                icon={<Zap className="h-6 w-6" />}
                title="Rapid Response Integration"
                description="Seamless alerts to clinical staff with recommended interventions based on patient-specific risk factors."
                delay={400}
              />
              
              <FeatureItem 
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Secure and HIPAA Compliant"
                description="End-to-end encryption and stringent data protection measures to ensure patient information security."
                delay={500}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  description: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, className }) => (
  <AnimatedSection animation="fade-in">
    <div className={cn("p-6 rounded-xl", className)}>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">{title}</h4>
      <div className="font-bold text-foreground">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </AnimatedSection>
);

export default Technology;
