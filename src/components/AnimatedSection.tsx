
import React, { ReactNode } from 'react';
import { useIntersectionObserver, usePrefersReducedMotion } from '@/utils/animations';
import { cn } from '@/lib/utils';

type AnimationType = 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  id?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  id,
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    triggerOnce,
  });
  
  const prefersReducedMotion = usePrefersReducedMotion();

  const animationStyles = prefersReducedMotion ? {} : {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : getInitialTransform(animation),
    transition: `opacity 0.5s ease, transform 0.5s ease ${delay}ms`,
  };

  return (
    <div
      id={id}
      ref={ref}
      className={cn('w-full', className)}
      style={animationStyles}
    >
      {children}
    </div>
  );
};

function getInitialTransform(animation: AnimationType): string {
  switch (animation) {
    case 'slide-up':
      return 'translateY(20px)';
    case 'slide-down':
      return 'translateY(-20px)';
    case 'slide-left':
      return 'translateX(20px)';
    case 'slide-right':
      return 'translateX(-20px)';
    case 'scale':
      return 'scale(0.95)';
    default:
      return 'none';
  }
}

export default AnimatedSection;
