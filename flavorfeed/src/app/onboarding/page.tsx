"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, MapPin, Utensils, User } from 'lucide-react';
import { useAuthContext } from '../../components/auth/AuthProvider';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { AuthService } from '../../lib/services/auth-service';

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const { profile, updateProfile } = useAuthContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  // ...rest of the OnboardingScreen logic and UI...
  return (
    <div className="min-h-screen bg-midnight-navy text-text-primary">
      {/* Onboarding UI goes here */}
    </div>
  );
};

export default OnboardingPage; 