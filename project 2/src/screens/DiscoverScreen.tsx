import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, Compass, Star, Sparkles } from 'lucide-react';
import { Restaurant } from '../types';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// Mock data for demonstration
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Celestial Rooftop',
    cuisine: ['Mediterranean', 'Modern'],
    priceRange: 3,
    rating: 4.8,
    reviewCount: 247,
    images: ['https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'],
    address: '123 Skyline Ave',
    distance: 0.8,
    phone: '(555) 123-4567',
    hours: [],
    availability: 'available',
    features: ['Rooftop Dining', 'Wine Selection', 'Romantic'],
    hasInsiderAccess: true,
    coordinates: [0, 0],
  },
  {
    id: '2',
    name: "Nonna's Kitchen",
    cuisine: ['Italian', 'Traditional'],
    priceRange: 2,
    rating: 4.6,
    reviewCount: 189,
    images: ['https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'],
    address: '456 Little Italy St',
    distance: 1.2,
    phone: '(555) 234-5678',
    hours: [],
    availability: 'limited',
    waitTime: 25,
    features: ['Family Style', 'Homemade Pasta', 'Cozy'],
    hasInsiderAccess: false,
    coordinates: [0, 0],
  },
  {
    id: '3',
    name: 'Sakura Sushi',
    cuisine: ['Japanese', 'Sushi'],
    priceRange: 3,
    rating: 4.9,
    reviewCount: 312,
    images: ['https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg'],
    address: '789 Zen Garden Way',
    distance: 2.1,
    phone: '(555) 345-6789',
    hours: [],
    availability: 'available',
    features: ['Omakase', 'Fresh Fish', 'Minimalist'],
    hasInsiderAccess: true,
    coordinates: [0, 0],
  },
];

const DiscoverScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRestaurants, setSavedRestaurants] = useState<Set<string>>(new Set());

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const contextMessage = currentHour < 12 
    ? 'Perfect day for brunch discoveries' 
    : currentHour < 18 
    ? 'Lunch spots are calling' 
    : 'Perfect night for rooftop dining';

  const handleSaveRestaurant = (restaurantId: string) => {
    setSavedRestaurants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(restaurantId)) {
        newSet.delete(restaurantId);
      } else {
        newSet.add(restaurantId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-midnight-navy text-text-primary pb-32">
      {/* Header Section */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-poppins font-semibold mb-2">
            {greeting}, Sarah
          </h1>
          <p className="text-text-secondary font-inter mb-6">{contextMessage}</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center bg-surface-elevated rounded-2xl border border-surface-card">
            <Search className="w-5 h-5 text-text-tertiary ml-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you craving?"
              className="flex-1 px-4 py-4 font-inter bg-transparent text-text-primary placeholder-text-tertiary focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-champagne-gold/20 to-champagne-gold/10 border-champagne-gold/30" hover>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-champagne-gold" />
              <div>
                <h3 className="font-lato font-semibold text-text-primary">Book Dinner</h3>
                <p className="text-sm font-inter text-text-secondary">Reserve tonight</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-success-green/20 to-success-green/10 border-success-green/30" hover>
            <div className="flex items-center gap-3">
              <Compass className="w-6 h-6 text-success-green" />
              <div>
                <h3 className="font-lato font-semibold text-text-primary">Available Now</h3>
                <p className="text-sm font-inter text-text-secondary">Instant seating</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-royal-purple/20 to-royal-purple/10 border-royal-purple/30" hover>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-royal-purple" />
              <div>
                <h3 className="font-lato font-semibold text-text-primary">Plan with Friends</h3>
                <p className="text-sm font-inter text-text-secondary">Group dining</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-discovery-orange/20 to-discovery-orange/10 border-discovery-orange/30" hover>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-discovery-orange" />
              <div>
                <h3 className="font-lato font-semibold text-text-primary">Surprise Me</h3>
                <p className="text-sm font-inter text-text-secondary">Culinary adventure</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Restaurant Sections */}
      <div className="space-y-8">
        {/* Curated for You */}
        <motion.section
          className="px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-crimson font-bold text-text-primary">Curated for You</h2>
            <button className="text-champagne-gold text-sm font-lato font-medium">See all</button>
          </div>
          
          <div className="space-y-4">
            {mockRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <RestaurantCard
                  restaurant={restaurant}
                  saved={savedRestaurants.has(restaurant.id)}
                  onSave={() => handleSaveRestaurant(restaurant.id)}
                  onShare={() => console.log('Share', restaurant.id)}
                  onClick={() => console.log('View restaurant', restaurant.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trending Section */}
        <motion.section
          className="px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-crimson font-bold text-text-primary">Trending in Your Area</h2>
            <button className="text-champagne-gold text-sm font-lato font-medium">See all</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockRestaurants.slice(0, 2).map((restaurant) => (
              <Card key={restaurant.id} padding="none" hover className="overflow-hidden">
                <div className="aspect-[4/3] sm:aspect-square relative">
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-lato font-semibold text-white mb-1">{restaurant.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-inter text-gray-300">{restaurant.cuisine[0]}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-champagne-gold fill-current" />
                        <span className="text-xs text-white">{restaurant.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default DiscoverScreen;