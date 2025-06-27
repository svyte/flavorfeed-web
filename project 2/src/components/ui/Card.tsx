import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
}) => {
  const baseClasses = 'bg-surface-card rounded-2xl border border-surface-elevated/50';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const interactiveClasses = onClick ? 'cursor-pointer' : '';
  const hoverClasses = hover ? 'hover:border-american-gold/30 hover:shadow-lg hover:shadow-american-gold/10' : '';
  
  const classes = `${baseClasses} ${paddingClasses[padding]} ${interactiveClasses} ${hoverClasses} ${className}`;

  const content = (
    <div className={classes}>
      {children}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: hover ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Card;