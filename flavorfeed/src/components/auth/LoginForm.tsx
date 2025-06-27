import React, { useState } from 'react';
import { useAuthContext } from './AuthProvider';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LoginFormProps {
  onSuccess?: () => void;
  onSignUpClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSignUpClick }) => {
  const { signIn, loading, error } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            icon={Mail}
            required
          />
        </div>

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={Lock}
            icon2={showPassword ? EyeOff : Eye}
            icon2Position="right"
            onIcon2Click={togglePasswordVisibility}
            required
          />
        </div>

        {error && (
          <div className="text-error-red text-sm font-medium">{error}</div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a href="#" className="text-champagne-gold hover:text-champagne-gold/80">
              Forgot password?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
        >
          Sign In
        </Button>

        <div className="text-center mt-4">
          <p className="text-text-secondary text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSignUpClick}
              className="text-champagne-gold hover:text-champagne-gold/80 font-medium"
            >
              Sign Up
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

export default LoginForm;