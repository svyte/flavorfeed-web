import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, MessageCircle, Share, MapPin, Calendar, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Image from 'next/image';

const SocialScreen: React.FC = () => {
  const activeFriends = [
    { id: 1, name: 'Alex', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', restaurant: "Mama's Italian" },
    { id: 2, name: 'Sarah', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg', restaurant: 'Zen Garden' },
    { id: 3, name: 'Mike', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg', restaurant: 'Corner Bistro' },
  ];

  const activities = [
    {
      id: 1,
      type: 'checkin',
      user: { name: 'Emma Rodriguez', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg' },
      timestamp: '15 minutes ago',
      content: {
        restaurant: 'Celestial Rooftop',
        restaurantImage: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      },
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      type: 'photo',
      user: { name: 'James Chen', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg' },
      timestamp: '1 hour ago',
      content: {
        restaurant: 'Sakura Sushi',
        dish: 'Omakase Selection',
        image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg',
      },
      likes: 28,
      comments: 7,
    },
    {
      id: 3,
      type: 'group-plan',
      user: { name: 'Lisa Park', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
      timestamp: '2 hours ago',
      content: {
        eventName: "Lisa's Birthday Dinner",
        members: 6,
        status: 'voting',
      },
      likes: 5,
      comments: 12,
    },
    {
      id: 4,
      type: 'review',
      user: { name: 'David Kim', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg' },
      timestamp: '3 hours ago',
      content: {
        restaurant: "Nonna's Kitchen",
        rating: 5,
        review: 'Absolutely incredible pasta! The carbonara was perfection and the tiramisu was divine. A must-visit!',
      },
      likes: 18,
      comments: 4,
    },
  ];

  const renderActivity = (activity: any) => {
    switch (activity.type) {
      case 'checkin':
        return (
          <Card key={activity.id}>
            <div className="flex items-start gap-4">
              <Image
                src={activity.user.avatar}
                alt={activity.user.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-lato font-semibold text-text-primary">{activity.user.name}</span>
                  <span className="text-text-tertiary font-inter text-sm">is dining at</span>
                  <span className="font-lato font-semibold text-champagne-gold">{activity.content.restaurant}</span>
                </div>
                <p className="text-text-tertiary font-inter text-sm mb-3">{activity.timestamp}</p>
                <div className="relative rounded-xl overflow-hidden mb-3">
                  <Image
                    src={activity.content.restaurantImage}
                    alt={activity.content.restaurant}
                    width={400}
                    height={160}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="default" className="bg-black/50 text-white backdrop-blur-sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      Live now
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-text-secondary hover:text-champagne-gold transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-inter">{activity.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-text-secondary hover:text-champagne-gold transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-inter">{activity.comments}</span>
                    </button>
                    <button className="text-text-secondary hover:text-champagne-gold transition-colors">
                      <Share className="w-5 h-5" />
                    </button>
                  </div>
                  <Button variant="secondary" size="sm">
                    Join Them
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      case 'photo':
        return (
          <Card key={activity.id}>
            <div className="flex items-start gap-4">
              <Image
                src={activity.user.avatar}
                alt={activity.user.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-lato font-semibold text-text-primary">{activity.user.name}</span>
                  <span className="text-text-tertiary font-inter text-sm">shared a photo from</span>
                  <span className="font-lato font-semibold text-champagne-gold">{activity.content.restaurant}</span>
                </div>
                <p className="text-text-tertiary font-inter text-sm mb-3">{activity.timestamp}</p>
                <div className="relative rounded-xl overflow-hidden mb-3">
                  <Image
                    src={activity.content.image}
                    alt={activity.content.dish}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
                      <p className="text-white font-lato font-semibold">{activity.content.dish}</p>
                      <p className="text-gray-300 font-inter text-sm">at {activity.content.restaurant}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-text-secondary hover:text-champagne-gold transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-inter">{activity.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-text-secondary hover:text-champagne-gold transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-inter">{activity.comments}</span>
                  </button>
                  <button className="text-text-secondary hover:text-champagne-gold transition-colors">
                    <Share className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        );
      case 'group-plan':
        return (
          <Card key={activity.id} className="border-royal-purple/30">
            <div className="flex items-start gap-4">
              <Image
                src={activity.user.avatar}
                alt={activity.user.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-lato font-semibold text-text-primary">{activity.user.name}</span>
                  <span className="text-text-tertiary font-inter text-sm">is planning</span>
                  <span className="font-lato font-semibold text-royal-purple">{activity.content.eventName}</span>
                </div>
                <p className="text-text-tertiary font-inter text-sm mb-3">{activity.timestamp}</p>
                <div className="bg-royal-purple/10 rounded-xl p-4 mb-3 border border-royal-purple/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-royal-purple" />
                      <span className="text-text-primary font-inter">{activity.content.members} people invited</span>
                    </div>
                    <Badge variant="purple" size="sm">{activity.content.status}</Badge>
                  </div>
                  <p className="text-text-secondary font-inter text-sm">Choosing between 3 restaurants</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-text-secondary hover:text-champagne-gold transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-inter">{activity.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-text-secondary hover:text-champagne-gold transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-inter">{activity.comments}</span>
                    </button>
                  </div>
                  <Button variant="primary" size="sm">
                    Vote Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      case 'review':
        return (
          <Card key={activity.id}>
            <div className="flex items-start gap-4">
              <Image
                src={activity.user.avatar}
                alt={activity.user.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-lato font-semibold text-text-primary">{activity.user.name}</span>
                  <span className="text-text-tertiary font-inter text-sm">reviewed</span>
                  <span className="font-lato font-semibold text-champagne-gold">{activity.content.restaurant}</span>
                </div>
                <p className="text-text-tertiary font-inter text-sm mb-3">{activity.timestamp}</p>
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < activity.content.rating ? 'text-champagne-gold' : 'text-surface-elevated'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-text-primary font-lato font-semibold">{activity.content.rating}/5</span>
                  </div>
                  <p className="text-text-primary font-inter leading-relaxed">{activity.content.review}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-text-secondary hover:text-champagne-gold transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-inter">{activity.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-text-secondary hover:text-champagne-gold transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-inter">{activity.comments}</span>
                  </button>
                  <button className="text-text-secondary hover:text-champagne-gold transition-colors">
                    <Share className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-midnight-navy text-text-primary pb-32">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-crimson font-bold text-text-primary">Food Social</h1>
            <p className="text-text-secondary font-inter">See what your friends are enjoying</p>
          </div>
          <Button variant="primary" icon={Plus} size="sm">
            Add Friends
          </Button>
        </motion.div>

        {/* Live Activity Banner */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-success-green/10 to-social-blue/10 border-success-green/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {activeFriends.map((friend) => (
                    <Image
                      key={friend.id}
                      src={friend.avatar}
                      alt={friend.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-midnight-navy object-cover"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-text-primary font-lato font-semibold">3 friends are dining now</p>
                  <p className="text-text-secondary font-inter text-sm">Tap to see where they are</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-success-green rounded-full animate-pulse"></div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <div className="px-6 space-y-6">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            {renderActivity(activity)}
          </motion.div>
        ))}
      </div>

      {/* Friend Suggestions */}
      <motion.div
        className="px-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-crimson font-bold text-text-primary mb-4">Discover Food Friends</h2>
        <Card>
          <div className="space-y-4">
            {[
              { name: 'Maria Garcia', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg', mutualFriends: 5 },
              { name: 'John Smith', avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg', mutualFriends: 3 },
            ].map((suggestion) => (
              <div key={suggestion.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={suggestion.avatar}
                    alt={suggestion.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-lato font-semibold text-text-primary">{suggestion.name}</p>
                    <p className="text-sm font-inter text-text-secondary">{suggestion.mutualFriends} mutual friends</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SocialScreen;