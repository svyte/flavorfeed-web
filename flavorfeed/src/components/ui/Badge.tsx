import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'green' | 'red' | 'blue' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-surface-elevated text-text-secondary',
    gold: 'bg-champagne-gold/20 text-champagne-gold border border-champagne-gold/30',
    green: 'bg-success-green/20 text-success-green border border-success-green/30',
    red: 'bg-error-red/20 text-error-red border border-error-red/30',
    blue: 'bg-info-blue/20 text-info-blue border border-info-blue/30',
    purple: 'bg-royal-purple/20 text-royal-purple border border-royal-purple/30',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs font-lato',
    md: 'px-3 py-1.5 text-sm font-lato',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;