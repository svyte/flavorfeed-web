import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Button from '../ui/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  initialView = 'login'
}) => {
  const [view, setView] = useState<'login' | 'signup'>(initialView);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="bg-midnight-navy border border-surface-elevated rounded-2xl shadow-xl max-w-md w-full mx-auto overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-surface-elevated">
                <h2 className="text-2xl font-crimson font-bold text-center text-text-primary">
                  {view === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-text-secondary text-center mt-1">
                  {view === 'login' 
                    ? 'Sign in to continue your culinary journey' 
                    : 'Join the FlavorFeed community'}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-4"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, x: view === 'login' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: view === 'login' ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {view === 'login' ? (
                      <LoginForm 
                        onSuccess={onClose}
                        onSignUpClick={() => setView('signup')}
                      />
                    ) : (
                      <SignUpForm 
                        onSuccess={onClose}
                        onLoginClick={() => setView('login')}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;