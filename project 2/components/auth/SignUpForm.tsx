import React, { useState } from 'react';
import { useAuthContext } from './AuthProvider';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SignUpFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onLoginClick }) => {
  const { signUp, loading, error } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (!fullName) errors.fullName = 'Full name is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await signUp({
        email,
        password,
        fullName,
        username: username || undefined
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            icon={Mail}
            error={validationErrors.email}
            required
          />
        </div>

        <div>
          <Input
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            icon={User}
            error={validationErrors.fullName}
            required
          />
        </div>

        <div>
          <Input
            label="Username (optional)"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            icon={User}
          />
        </div>

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            icon={Lock}
            icon2={showPassword ? EyeOff : Eye}
            icon2Position="right"
            onIcon2Click={togglePasswordVisibility}
            error={validationErrors.password}
            required
          />
        </div>

        {error && (
          <div className="text-error-red text-sm font-medium">{error}</div>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
        >
          Create Account
        </Button>

        <div className="text-center mt-4">
          <p className="text-text-secondary text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-champagne-gold hover:text-champagne-gold/80 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-elevated"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-midnight-navy text-text-tertiary">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              // Implement Google sign in
            }}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              // Implement Apple sign in
            }}
          >
            Apple
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;