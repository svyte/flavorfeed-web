import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Navigation, Users, Camera, Layers } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const ExploreScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'ar' | 'list'>('map');
  const [showFilters, setShowFilters] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string>('restaurants');

  const layers = [
    { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
    { id: 'friends', label: 'Friends', icon: '👥' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'insider', label: 'Insider', icon: '⭐' },
    { id: 'events', label: 'Events', icon: '📍' },
    { id: 'parking', label: 'Parking', icon: '🚗' },
  ];

  return (
    <div className="min-h-screen bg-midnight-navy text-text-primary pb-32">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-crimson font-bold text-text-primary">Explore</h1>
            <p className="text-text-secondary font-inter">Discover your culinary world</p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <Button
              variant={viewMode === 'map' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              Map
            </Button>
            <Button
              variant={viewMode === 'ar' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('ar')}
              icon={Camera}
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines..."
              className="w-full pl-12 pr-4 py-3 font-inter bg-surface-elevated border border-surface-card rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 focus:border-champagne-gold"
            />
          </div>
          <div className="flex gap-3 sm:flex-shrink-0">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              icon={Filter}
            />
            <Button
              variant="secondary"
              icon={Layers}
            />
          </div>
        </motion.div>

        {/* Layer Toggle System */}
        <motion.div
          className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {layers.map((layer) => (
            <button
              key={layer.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeLayer === layer.id
                  ? 'bg-champagne-gold text-midnight-navy'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveLayer(layer.id)}
            >
              <span>{layer.icon}</span>
              <span className="text-sm font-lato font-medium">{layer.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Filter Chips */}
        <motion.div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Badge variant="gold">Available Now</Badge>
          <Badge variant="default">Italian</Badge>
          <Badge variant="default">Under $30</Badge>
          <Badge variant="purple">Insider Access</Badge>
          <Badge variant="green">Outdoor Seating</Badge>
        </motion.div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <motion.div
          className="relative flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Map Interface */}
          <div className="h-80 sm:h-96 mx-6 bg-surface-card rounded-2xl border border-surface-elevated relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-champagne-gold/10 to-royal-purple/10">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-champagne-gold rounded-full animate-pulse"></div>
              </div>
              
              {/* Enhanced Restaurant Pins */}
              <div className="absolute top-20 left-16">
                <motion.div 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-success-green rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-white text-xs sm:text-sm font-bold">🍝</span>
                </motion.div>
              </div>
              
              <div className="absolute top-32 right-20">
                <motion.div 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-champagne-gold rounded-full flex items-center justify-center cursor-pointer border-2 border-yellow-300 shadow-lg"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-midnight-navy text-xs sm:text-sm font-bold">🍣</span>
                </motion.div>
              </div>
              
              <div className="absolute bottom-24 left-1/3">
                <motion.div 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-warning-amber rounded-full flex items-center justify-center cursor-pointer border-2 border-orange-300 shadow-lg"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-white text-xs sm:text-sm font-bold">🥘</span>
                </motion.div>
              </div>

              {/* Friend Avatars */}
              <div className="absolute top-40 right-32">
                <motion.div 
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-social-blue shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                >
                  <img 
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" 
                    alt="Friend"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Enhanced Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button variant="secondary" size="sm" icon={Navigation} />
              <Button variant="secondary" size="sm" icon={Users} />
              <Button variant="secondary" size="sm" icon={Camera} />
            </div>
          </div>

          {/* Enhanced Restaurant Details Bottom Sheet */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 mx-6 mb-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-champagne-gold/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
                  alt="Celestial Rooftop"
                  className="w-full sm:w-20 h-32 sm:h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-crimson font-bold text-text-primary text-lg">Celestial Rooftop</h3>
                  <p className="text-sm font-inter text-text-secondary">Mediterranean • 0.8 mi</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="gold" size="sm">Insider Access</Badge>
                    <Badge variant="green" size="sm">Available</Badge>
                    <Badge variant="default" size="sm">Rooftop</Badge>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 sm:space-y-2 w-full sm:w-auto">
                  <Button variant="primary" size="sm">Reserve</Button>
                  <Button variant="ghost" size="sm">Directions</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* AR View */}
      {viewMode === 'ar' && (
        <motion.div
          className="relative flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-80 sm:h-96 mx-6 bg-gradient-to-br from-midnight-navy to-surface-card rounded-2xl border border-champagne-gold/30 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-champagne-gold mx-auto mb-4" />
                <h3 className="text-xl font-crimson font-bold text-text-primary mb-2">AR Camera Mode</h3>
                <p className="text-text-secondary font-inter">Point your camera at restaurants for instant info</p>
                <Button variant="primary" className="mt-4">
                  Enable Camera
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <motion.div
          className="px-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
            >
              <Card hover className="border-surface-elevated/50 hover:border-champagne-gold/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={`https://images.pexels.com/photos/${262978 + item * 1000}/pexels-photo-${262978 + item * 1000}.jpeg`}
                    alt={`Restaurant ${item}`}
                    className="w-full sm:w-20 h-32 sm:h-20 rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-crimson font-bold text-text-primary text-lg">Restaurant Name {item}</h3>
                    <p className="text-sm font-inter text-text-secondary">Italian • $$ • {0.5 + item * 0.3} mi</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="green" size="sm">Available</Badge>
                      <Badge variant="default" size="sm">Outdoor Seating</Badge>
                      {item % 2 === 0 && <Badge variant="gold" size="sm">Insider</Badge>}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto">
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-champagne-gold">★</span>
                      <span className="text-text-primary font-lato font-semibold">4.{5 + item}</span>
                    </div>
                    <p className="text-xs font-inter text-text-tertiary">{Math.floor(Math.random() * 200) + 100} reviews</p>
                    <Button variant="primary" size="sm" className="mt-2">
                      Reserve
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ExploreScreen;