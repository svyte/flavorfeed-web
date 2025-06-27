import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Share, Clock, MapPin } from 'lucide-react';
import { Restaurant } from '../../types';
import Badge from '../ui/Badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSave?: () => void;
  onShare?: () => void;
  onClick?: () => void;
  saved?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSave,
  onShare,
  onClick,
  saved = false,
}) => {
  const priceDisplay = '$'.repeat(restaurant.priceRange);
  const availabilityColor = {
    available: 'text-success-green',
    limited: 'text-warning-amber',
    unavailable: 'text-error-red',
  };

  return (
    <motion.div
      className="bg-surface-card rounded-2xl overflow-hidden border border-surface-elevated/50 hover:border-champagne-gold/30 transition-all duration-300 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Hero Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={restaurant.images[0]}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {restaurant.cuisine.slice(0, 2).map((cuisine) => (
            <Badge key={cuisine} variant="default" className="bg-black/50 text-white backdrop-blur-sm">
              {cuisine}
            </Badge>
          ))}
          {restaurant.hasInsiderAccess && (
            <Badge variant="gold">Insider Access</Badge>
          )}
        </div>
        
        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              saved ? 'bg-champagne-gold text-midnight-navy' : 'bg-black/50 text-white hover:bg-champagne-gold hover:text-midnight-navy'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSave?.();
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={saved ? 'currentColor' : 'none'} />
          </motion.button>
          
          <motion.button
            className="p-2 rounded-full bg-black/50 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.();
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Share className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
        
        {/* Distance & Availability */}
        <div className="absolute bottom-4 left-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-white text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.distance}mi</span>
          </div>
          
          <div className={`flex items-center gap-1 ${availabilityColor[restaurant.availability]}`}>
            <Clock className="w-4 h-4" />
            <span>
              {restaurant.availability === 'available' && 'Available now'}
              {restaurant.availability === 'limited' && `${restaurant.waitTime}min wait`}
              {restaurant.availability === 'unavailable' && 'Full'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-crimson font-bold text-text-primary mb-1">
              {restaurant.name}
            </h3>
            <p className="text-text-secondary font-inter text-sm">{priceDisplay} · {restaurant.cuisine.join(', ')}</p>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-champagne-gold fill-current" />
            <span className="text-text-primary font-lato font-semibold">{restaurant.rating}</span>
            <span className="text-text-tertiary font-inter text-sm">({restaurant.reviewCount})</span>
          </div>
        </div>
        
        {/* Features */}
        {restaurant.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {restaurant.features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="default" size="sm">
                {feature}
              </Badge>
            ))}
            {restaurant.features.length > 3 && (
              <Badge variant="default" size="sm">
                +{restaurant.features.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantCard;