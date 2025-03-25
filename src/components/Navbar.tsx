
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="container-wide flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 focus-ring"
          onClick={() => setIsOpen(false)}
        >
          <span className="text-xl font-bold text-primary font-display">SepsisCare</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/doctors">Doctors</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <Button size="sm" variant="outline" asChild className="ml-2">
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 focus-ring rounded-md"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={cn(
            'fixed inset-0 top-[calc(4rem)] bg-background z-40 transform transition-transform duration-300 ease-in-out md:hidden',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <nav className="flex flex-col p-6 space-y-4">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/services" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
            <MobileNavLink to="/doctors" onClick={() => setIsOpen(false)}>Doctors</MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
            <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
            <Button className="w-full mt-4" asChild>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ to, children, className }: NavLinkProps) => (
  <Link 
    to={to} 
    className={cn(
      'text-base font-medium text-foreground hover:text-primary transition-colors duration-200 focus-ring',
      className
    )}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

const MobileNavLink = ({ to, children, onClick, className }: MobileNavLinkProps) => (
  <Link
    to={to}
    className={cn(
      'text-lg font-medium py-2 border-b border-border focus-ring',
      className
    )}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
