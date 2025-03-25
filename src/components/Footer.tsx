
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer = () => {
  return (
    <footer className="bg-muted/50 pt-16 pb-8">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary font-display">SepsisCare</span>
            </Link>
            <p className="text-muted-foreground">
              Leading the revolution in early sepsis detection through advanced artificial intelligence and machine learning.
            </p>
            
            <div className="flex space-x-4 pt-2">
              <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Linkedin className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink href="/#services">Our Services</FooterLink>
              <FooterLink href="/#technology">Technology</FooterLink>
              <FooterLink href="/#doctors">Specialists</FooterLink>
              <FooterLink href="/#about">About Us</FooterLink>
              <FooterLink href="/#contact">Contact</FooterLink>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-medium text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Sepsis Monitoring</FooterLink>
              <FooterLink href="#">Patient Analysis</FooterLink>
              <FooterLink href="#">Hospital Integration</FooterLink>
              <FooterLink href="#">Medical Consulting</FooterLink>
              <FooterLink href="#">Data Security</FooterLink>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-medium text-lg mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates on sepsis care innovations.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-3 py-2 flex-1 rounded-l-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                className="bg-primary text-white px-3 py-2 rounded-r-md hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p className="flex items-center justify-center">
            &copy; {new Date().getFullYear()} SepsisCare. All rights reserved. Made with 
            <Heart className="h-4 w-4 mx-1 text-destructive" /> 
            for patient care.
          </p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon }) => (
  <a 
    href={href} 
    className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
    aria-label="Social media"
  >
    {icon}
  </a>
);

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <li>
    <a 
      href={href} 
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
    </a>
  </li>
);

export default Footer;
