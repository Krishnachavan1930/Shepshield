
import React from 'react';
import { useAnimatedCounter } from '@/utils/animations';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  prefix = '',
  suffix = '',
  duration = 2000,
  delay = 0,
  className,
}) => {
  const count = useAnimatedCounter(end, duration, delay);
  
  return (
    <div className={cn('font-display font-bold', className)}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

export default AnimatedCounter;
