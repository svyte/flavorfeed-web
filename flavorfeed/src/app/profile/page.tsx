"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Crown, Star, MapPin, Camera, Award, Calendar, Heart } from 'lucide-react';
import { useAuthContext } from '../../components/auth/AuthProvider';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const ProfilePage: React.FC = () => {
  const { profile, signOut } = useAuthContext();
  
  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).getFullYear().toString()
    : '2023';

  const recentVisits = [
    {
      id: 1,
      name: 'Celestial Rooftop',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      rating: 5,
      date: 'Dec 10',
    },
    {
      id: 2,
      name: 'Sakura Sushi',
      image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg',
      rating: 4,
      date: 'Dec 8',
    },
    {
      id: 3,
      name: "Nonna's Kitchen",
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      rating: 5,
      date: 'Dec 5',
    },
  ];

  const achievements = [
    { id: 1, name: 'First Timer', icon: Award, color: 'text-success-green' },
    { id: 2, name: 'Cuisine Explorer', icon: MapPin, color: 'text-champagne-gold' },
    { id: 3, name: 'Social Butterfly', icon: Heart, color: 'text-royal-purple' },
    { id: 4, name: 'Food Critic', icon: Star, color: 'text-info-blue' },
  ];

  return (
    <div className="min-h-screen bg-midnight-navy text-text-primary pb-32">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-crimson font-bold text-text-primary">Profile</h1>
            <p className="text-text-secondary font-inter">Your culinary journey</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" icon={Settings}>{''}</Button>
            <Button variant="ghost" onClick={signOut}>Sign Out</Button>
          </div>
        </motion.div>
      </div>
      {/* ...rest of the ProfileScreen logic and UI... */}
    </div>
  );
};

export default ProfilePage; 