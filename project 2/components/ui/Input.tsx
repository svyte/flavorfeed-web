import React, { forwardRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  icon2?: LucideIcon;
  iconPosition?: 'left' | 'right';
  icon2Position?: 'left' | 'right';
  onIconClick?: () => void;
  onIcon2Click?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  icon2: Icon2,
  iconPosition = 'left',
  icon2Position = 'right',
  onIconClick,
  onIcon2Click,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 font-inter bg-surface-elevated border border-surface-card rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 focus:border-champagne-gold transition-colors duration-200';
  
  let paddingClasses = '';
  if (Icon && iconPosition === 'left') paddingClasses += ' pl-12';
  if (Icon && iconPosition === 'right') paddingClasses += ' pr-12';
  if (Icon2 && icon2Position === 'left') paddingClasses += ' pl-12';
  if (Icon2 && icon2Position === 'right') paddingClasses += ' pr-12';
  
  const errorClasses = error ? 'border-error-red focus:border-error-red focus:ring-error-red/20' : '';
  
  const inputClasses = `${baseClasses} ${paddingClasses} ${errorClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
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
        
        {Icon2 && (
          <div
            className={`absolute ${icon2Position === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 ${onIcon2Click ? 'cursor-pointer' : ''}`}
            onClick={onIcon2Click}
          >
            <Icon2 className="w-5 h-5 text-text-tertiary" />
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>

      {error && (
        <p className="text-sm text-error-red">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;