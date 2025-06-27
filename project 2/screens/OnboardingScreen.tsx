import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, MapPin, Utensils, User } from 'lucide-react';
import { useAuthContext } from '../components/auth/AuthProvider';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { AuthService } from '../lib/services/auth-service';

const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuthContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      
      await AuthService.completeOnboarding({
        cuisine_preferences: cuisinePreferences,
        dietary_restrictions: dietaryRestrictions,
        location: location
      });
      
      // Update local profile state
      await updateProfile({
        onboarding_completed: true,
        cuisine_preferences: cuisinePreferences,
        dietary_restrictions: dietaryRestrictions
      });
      
      // Navigate to discover screen
      navigate('/discover');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Current Location' // This would be replaced with reverse geocoding
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const toggleCuisine = (cuisine: string) => {
    setCuisinePreferences(prev => 
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const toggleDietary = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const cuisines = [
    'Italian', 'Japanese', 'Mexican', 'Chinese', 'Indian', 
    'French', 'Thai', 'Mediterranean', 'American', 'Korean',
    'Spanish', 'Vietnamese', 'Greek', 'Middle Eastern', 'Vegetarian'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Halal', 'Kosher', 'Pescatarian', 'Keto'
  ];

  return (
    <div className="min-h-screen bg-midnight-navy text-text-primary">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-crimson font-bold">Welcome to FlavorFeed</h1>
        </div>
        <p className="text-text-secondary font-inter">Let's personalize your experience</p>
        
        {/* Progress Bar */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-lato text-text-secondary">Step {step} of {totalSteps}</span>
            <span className="text-sm font-lato text-champagne-gold">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-champagne-gold to-royal-purple"
              initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-32">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <h2 className="text-xl font-crimson font-bold">Cuisine Preferences</h2>
                </div>
                <p className="text-text-secondary font-inter mb-6">Select cuisines you enjoy to get personalized recommendations</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {cuisines.map(cuisine => (
                    <button
                      key={cuisine}
                      className={`p-3 rounded-xl border transition-colors ${
                        cuisinePreferences.includes(cuisine)
                          ? 'bg-champagne-gold/20 border-champagne-gold text-champagne-gold'
                          : 'bg-surface-card border-surface-elevated text-text-secondary hover:border-champagne-gold/50'
                      }`}
                      onClick={() => toggleCuisine(cuisine)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-lato">{cuisine}</span>
                        {cuisinePreferences.includes(cuisine) && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-success-green/20 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-success-green" />
                  </div>
                  <h2 className="text-xl font-crimson font-bold">Dietary Preferences</h2>
                </div>
                <p className="text-text-secondary font-inter mb-6">Let us know about any dietary restrictions or preferences</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dietaryOptions.map(option => (
                    <button
                      key={option}
                      className={`p-3 rounded-xl border transition-colors ${
                        dietaryRestrictions.includes(option)
                          ? 'bg-success-green/20 border-success-green text-success-green'
                          : 'bg-surface-card border-surface-elevated text-text-secondary hover:border-success-green/50'
                      }`}
                      onClick={() => toggleDietary(option)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-lato">{option}</span>
                        {dietaryRestrictions.includes(option) && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-royal-purple/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-royal-purple" />
                  </div>
                  <h2 className="text-xl font-crimson font-bold">Location</h2>
                </div>
                <p className="text-text-secondary font-inter mb-6">Share your location to discover restaurants nearby</p>
                
                <Card className="mb-6">
                  <div className="flex flex-col items-center justify-center py-4">
                    {location ? (
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-success-green/20 flex items-center justify-center mx-auto mb-4">
                          <Check className="w-6 h-6 text-success-green" />
                        </div>
                        <p className="text-text-primary font-lato font-semibold mb-1">Location Detected</p>
                        <p className="text-text-secondary text-sm">{location.name}</p>
                      </div>
                    ) : (
                      <>
                        <MapPin className="w-12 h-12 text-royal-purple mb-4" />
                        <p className="text-text-primary font-lato font-semibold mb-4">Enable location services</p>
                        <Button 
                          variant="primary" 
                          onClick={handleGetLocation}
                        >
                          Share Location
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
                
                <p className="text-text-tertiary text-sm text-center">
                  You can always change this later in your profile settings
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-midnight-navy via-midnight-navy to-transparent">
        <div className="flex gap-4">
          {step > 1 && (
            <Button
              variant="secondary"
              onClick={handleBack}
              className="flex-1"
            >
              Back
            </Button>
          )}
          
          <Button
            variant="primary"
            onClick={step < totalSteps ? handleNext : handleComplete}
            className="flex-1"
            loading={loading}
          >
            {step < totalSteps ? 'Next' : 'Complete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;