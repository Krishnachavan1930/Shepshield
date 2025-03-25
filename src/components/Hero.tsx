
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-28 pb-16 flex items-center">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(10, 110, 180, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(10, 110, 180, 0.2) 2%, transparent 0%)',
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Content */}
      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Activity className="w-4 h-4 mr-2" />
              Advanced Sepsis Detection Technology
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight font-display">
              Early Sepsis Detection Saves <span className="primary-gradient-text">Lives</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our AI-powered platform helps healthcare professionals detect sepsis early, improving patient outcomes and reducing mortality rates with real-time monitoring and predictive analytics.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Try Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#contact">Contact Us</a>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <Stat label="Early Detection">
                <Activity className="w-10 h-10 text-primary mb-2" />
                <span className="text-3xl font-bold">95%</span>
              </Stat>
              <Stat label="Time Saved">
                <Clock className="w-10 h-10 text-primary mb-2" />
                <span className="text-3xl font-bold">6hrs</span>
              </Stat>
              <Stat label="Lives Saved">
                <Shield className="w-10 h-10 text-primary mb-2" />
                <span className="text-3xl font-bold">+80%</span>
              </Stat>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-70 animate-pulse"></div>
              <div className="relative glass-card rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Doctor using AI technology" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -top-8 -right-8 glass-card p-4 rounded-xl shadow-lg max-w-xs animate-float">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sepsis Risk Detected</p>
                  <p className="text-xs text-muted-foreground">Early intervention recommended</p>
                </div>
              </div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-4 -left-8 glass-card p-4 rounded-xl shadow-lg max-w-xs animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Real-time Monitoring</p>
                  <p className="text-xs text-muted-foreground">Continuous patient assessment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface StatProps {
  children: React.ReactNode;
  label: string;
  className?: string;
}

const Stat: React.FC<StatProps> = ({ children, label, className }) => (
  <div className={cn("flex flex-col items-center", className)}>
    {children}
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

export default Hero;
