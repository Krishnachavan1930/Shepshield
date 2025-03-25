
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  subtitleClassName?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  centered = true,
  className,
  subtitleClassName
}) => {
  return (
    <div className={cn(
      'space-y-4 mb-12',
      centered && 'text-center',
      className
    )}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          'text-lg text-muted-foreground max-w-3xl',
          centered && 'mx-auto',
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
