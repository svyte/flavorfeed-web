"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Calendar, Users, Clock, Star, ChefHat } from 'lucide-react';
import { useAuthContext } from '../../components/auth/AuthProvider';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Image from 'next/image';

const InsiderPage: React.FC = () => {
  const { profile } = useAuthContext();
  const membershipTier = profile?.subscription_tier || 'free';
  
  const featuredExperience = {
    title: 'Private Wine Cellar Dinner at Chez Laurent',
    restaurant: 'Chez Laurent',
    date: 'Friday, Dec 15',
    time: '7:00 PM',
    spots: 8,
    available: 3,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
  };

  const experiences = [
    {
      id: 1,
      title: "Chef's Table Experience",
      restaurant: 'Sakura Sushi',
      type: 'chefs-table',
      date: 'Dec 20',
      price: 'Included',
      image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg',
      tier: 'premium',
    },
    {
      id: 2,
      title: 'Truffle Hunting Workshop',
      restaurant: 'Forest Bistro',
      type: 'workshop',
      date: 'Dec 22',
      price: 'Included',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      tier: 'insider',
    },
    {
      id: 3,
      title: 'Rooftop Jazz & Cocktails',
      restaurant: 'Celestial Rooftop',
      type: 'popup',
      date: 'Dec 18',
      price: 'Included',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      tier: 'free',
    },
  ];

  return (
    <div className="min-h-screen bg-midnight-navy text-text-primary pb-32">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-text-primary mb-2">Insider Access</h1>
              <p className="text-text-secondary font-inter">Exclusive culinary experiences curated for you</p>
            </div>
            <div className="text-left sm:text-right">
              <Badge variant="gold" className="mb-2">
                <Crown className="w-4 h-4 mr-1" />
                {membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)}
              </Badge>
              <p className="text-xs font-inter text-text-tertiary">Member since {new Date(profile?.created_at || '').getFullYear()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Experience */}
      <motion.div
        className="px-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-crimson font-bold text-text-primary mb-4">This Week's Featured Experience</h2>
        <Card padding="none" className="overflow-hidden border-champagne-gold/30">
          <div className="relative h-40 sm:h-48">
            <Image
              src={featuredExperience.image}
              alt={featuredExperience.title}
              fill
              className="w-full h-full object-cover"
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge variant="gold">Featured Experience</Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-lg sm:text-xl font-crimson font-bold text-white mb-2">
                {featuredExperience.title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-white gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="font-inter">{featuredExperience.date}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span className="font-inter">{featuredExperience.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span className="font-inter">{featuredExperience.available} of {featuredExperience.spots} spots available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-text-secondary font-inter mb-2">at {featuredExperience.restaurant}</p>
                <p className="text-sm font-inter text-text-tertiary">
                  Experience an intimate dinner in our historic wine cellar with sommelier-paired selections
                </p>
              </div>
              <Button variant="primary">
                Claim Your Spot
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Experience Categories */}
      <motion.div
        className="px-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-crimson font-bold text-text-primary mb-4">Experience Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card hover className="bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 border-champagne-gold/20">
            <div className="text-center">
              <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-champagne-gold mx-auto mb-3" />
              <h3 className="font-lato font-semibold text-text-primary mb-1">Chef's Table</h3>
              <p className="text-sm font-inter text-text-secondary">Intimate dining experiences</p>
            </div>
          </Card>
          <Card hover className="bg-gradient-to-br from-royal-purple/10 to-royal-purple/5 border-royal-purple/20">
            <div className="text-center">
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-royal-purple mx-auto mb-3" />
              <h3 className="font-lato font-semibold text-text-primary mb-1">Wine Vault</h3>
              <p className="text-sm font-inter text-text-secondary">Exclusive cellar access</p>
            </div>
          </Card>
          <Card hover className="bg-gradient-to-br from-success-green/10 to-success-green/5 border-success-green/20">
            <div className="text-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-success-green mx-auto mb-3" />
              <h3 className="font-lato font-semibold text-text-primary mb-1">Private Dining</h3>
              <p className="text-sm font-inter text-text-secondary">After-hours experiences</p>
            </div>
          </Card>
          <Card hover className="bg-gradient-to-br from-discovery-orange/10 to-discovery-orange/5 border-discovery-orange/20">
            <div className="text-center">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-discovery-orange mx-auto mb-3" />
              <h3 className="font-lato font-semibold text-text-primary mb-1">Workshops</h3>
              <p className="text-sm font-inter text-text-secondary">Learn from the masters</p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Upcoming Experiences */}
      <motion.div
        className="px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-crimson font-bold text-text-primary">Upcoming Experiences</h2>
          <button className="text-champagne-gold text-sm font-lato font-medium">View All</button>
        </div>
        <div className="space-y-4">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card hover>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    width={80}
                    height={80}
                    className="w-full sm:w-20 h-32 sm:h-20 rounded-xl object-cover"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-crimson font-bold text-text-primary">{experience.title}</h3>
                        <p className="text-sm font-inter text-text-secondary">{experience.restaurant}</p>
                      </div>
                      <Badge 
                        variant={experience.tier === 'insider' ? 'purple' : experience.tier === 'premium' ? 'gold' : 'green'}
                        size="sm"
                      >
                        {experience.tier}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-4 text-sm font-inter text-text-tertiary">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{experience.date}</span>
                        </div>
                        <span className="text-champagne-gold font-lato font-semibold">{experience.price}</span>
                      </div>
                      <Button variant="secondary" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Membership Benefits */}
      <motion.div
        className="px-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-crimson font-bold text-text-primary mb-4">Your Benefits</h2>
        <Card className="bg-gradient-to-br from-champagne-gold/10 to-royal-purple/10 border-champagne-gold/30">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-champagne-gold rounded-full"></div>
              <span className="text-text-primary font-inter">Exclusive access to chef's table experiences</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-champagne-gold rounded-full"></div>
              <span className="text-text-primary font-inter">Priority reservations at partner restaurants</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-champagne-gold rounded-full"></div>
              <span className="text-text-primary font-inter">Complimentary wine tastings and workshops</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-champagne-gold rounded-full"></div>
              <span className="text-text-primary font-inter">Special occasion celebration planning</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-surface-elevated">
            <Button variant="primary" fullWidth>
              {membershipTier === 'free' 
                ? 'Upgrade to Premium' 
                : membershipTier === 'premium' 
                  ? 'Upgrade to Insider' 
                  : 'Manage Subscription'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default InsiderPage; 