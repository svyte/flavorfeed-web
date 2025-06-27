import React, { forwardRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  onIconClick,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 font-inter bg-surface-elevated border border-surface-card rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 focus:border-champagne-gold transition-colors duration-200';
  
  const iconClasses = Icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : '';
  const errorClasses = error ? 'border-error-red focus:border-error-red focus:ring-error-red/20' : '';
  
  const inputClasses = `${baseClasses} ${iconClasses} ${errorClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div
            className={`absolute ${iconPosition === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 ${onIconClick ? 'cursor-pointer' : ''}`}
            onClick={onIconClick}
          >
            <Icon className="w-5 h-5 text-text-tertiary" />
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-error-red">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;