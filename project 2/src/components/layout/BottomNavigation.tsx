import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Map, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'explore', label: 'Explore', icon: Map },
  { id: 'profile', label: 'Profile', icon: User },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-surface-elevated/95 backdrop-blur-lg border-t border-surface-card safe-area-inset-bottom">
        <div className="flex items-center justify-around px-4 sm:px-8 py-2 sm:py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition-colors duration-200 ${
                  isActive ? 'text-champagne-gold' : 'text-text-tertiary hover:text-text-secondary'
                }`}
                onClick={() => onTabChange(tab.id)}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  {isActive && (
                    <motion.div
                      className="absolute -inset-1 bg-champagne-gold/20 rounded-full -z-10"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </div>
                <span className="text-xs font-lato font-medium mt-0.5 sm:mt-1">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;