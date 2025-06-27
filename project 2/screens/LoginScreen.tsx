import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';

const LoginScreen: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-midnight-navy flex flex-col">
      {/* Header/Logo Area */}
      <div className="pt-16 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-playfair font-bold text-champagne-gold mb-2">FlavorFeed</h1>
          <p className="text-text-secondary font-inter">Your Personal Culinary Concierge</p>
        </motion.div>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <motion.div
          className="w-full max-w-md bg-surface-card rounded-2xl p-8 border border-surface-elevated shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Tabs */}
          <div className="flex mb-8 border-b border-surface-elevated">
            <button
              className={`flex-1 pb-3 text-center font-lato font-medium transition-colors ${
                view === 'login'
                  ? 'text-champagne-gold border-b-2 border-champagne-gold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setView('login')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 pb-3 text-center font-lato font-medium transition-colors ${
                view === 'signup'
                  ? 'text-champagne-gold border-b-2 border-champagne-gold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setView('signup')}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <motion.div
            key={view}
            initial={{ opacity: 0, x: view === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === 'login' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'login' ? (
              <LoginForm onSignUpClick={() => setView('signup')} />
            ) : (
              <SignUpForm onLoginClick={() => setView('login')} />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-text-tertiary text-xs">
        <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
};

export default LoginScreen;