import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Crown, Star, MapPin, Camera, Award, Calendar, Heart } from 'lucide-react';
import { useAuthContext } from '../../components/auth/AuthProvider';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Image from 'next/image';

const ProfileScreen: React.FC = () => {
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

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative">
                <Image
                  src={profile?.avatar_url || 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'}
                  alt={profile?.full_name || 'User'}
                  width={96}
                  height={96}
                  className="w-24 h-24 sm:w-20 sm:h-20 rounded-full object-cover"
                />
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-champagne-gold text-midnight-navy rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-crimson font-bold text-text-primary mb-1">
                  {profile?.full_name || 'User'}
                </h2>
                <p className="text-text-secondary font-inter mb-2">{profile?.email}</p>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Badge variant="gold">
                    <Crown className="w-3 h-3 mr-1" />
                    {profile?.subscription_tier
                      ? profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)
                      : 'Free'}
                  </Badge>
                  <span className="text-text-tertiary font-inter text-sm">Member since {memberSince}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Stats Dashboard */}
      <motion.div
        className="px-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-crimson font-bold text-text-primary mb-4">Your Dining Journey</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center">
            <div className="text-2xl sm:text-3xl font-playfair font-bold text-champagne-gold mb-1">
              {profile?.total_posts || 0}
            </div>
            <p className="text-text-secondary font-lato text-sm font-medium">Posts</p>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl sm:text-3xl font-playfair font-bold text-royal-purple mb-1">
              {profile?.total_reviews || 0}
            </div>
            <p className="text-text-secondary font-lato text-sm font-medium">Reviews</p>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl sm:text-3xl font-playfair font-bold text-social-blue mb-1">
              {profile?.friends_count || 0}
            </div>
            <p className="text-text-secondary font-lato text-sm font-medium">Friends Connected</p>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl sm:text-3xl font-playfair font-bold text-discovery-orange mb-1">
              {profile?.points || 0}
            </div>
            <p className="text-text-secondary font-lato text-sm font-medium">Points</p>
          </Card>
        </div>
      </motion.div>

      {/* Recent Visits */}
      <motion.div
        className="px-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-crimson font-bold text-text-primary">Recent Visits</h2>
          <button className="text-champagne-gold text-sm font-lato font-medium">View All</button>
        </div>
        
        <div className="space-y-3">
          {recentVisits.map((visit, index) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card hover>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Image
                    src={visit.image}
                    alt={visit.name}
                    width={64}
                    height={64}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-lato font-semibold text-text-primary">{visit.name}</h3>
                    <p className="text-text-secondary font-inter text-sm">{visit.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          i < visit.rating ? 'text-champagne-gold fill-current' : 'text-surface-elevated'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="px-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-crimson font-bold text-text-primary mb-4">Achievements</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card hover className="text-center">
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${achievement.color}`} />
                  <p className="text-text-primary font-lato font-semibold text-sm">{achievement.name}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Membership Info */}
      <motion.div
        className="px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-crimson font-bold text-text-primary mb-4">Membership</h2>
        
        <Card className="bg-gradient-to-br from-champagne-gold/10 to-royal-purple/10 border-champagne-gold/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-crimson font-bold text-text-primary mb-1">
                {profile?.subscription_tier === 'free' 
                  ? 'Free Member' 
                  : profile?.subscription_tier === 'premium' 
                    ? 'Premium Member' 
                    : 'Insider Member'}
              </h3>
              <p className="text-text-secondary font-inter text-sm">
                {profile?.subscription_tier === 'free'
                  ? 'Upgrade to enjoy exclusive benefits'
                  : 'Enjoy exclusive benefits and experiences'}
              </p>
            </div>
            <Crown className="w-8 h-8 text-champagne-gold self-start sm:self-auto" />
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-champagne-gold rounded-full"></div>
              <span className="text-text-primary font-inter text-sm">Priority reservations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-champagne-gold rounded-full"></div>
              <span className="text-text-primary font-inter text-sm">Exclusive experiences</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-champagne-gold rounded-full"></div>
              <span className="text-text-primary font-inter text-sm">Complimentary tastings</span>
            </div>
          </div>
          
          <Button variant="primary" fullWidth>
            {profile?.subscription_tier === 'free' 
              ? 'Upgrade to Premium' 
              : profile?.subscription_tier === 'premium' 
                ? 'Upgrade to Insider' 
                : 'Manage Subscription'}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileScreen;