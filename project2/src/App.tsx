import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from './components/layout/BottomNavigation';
import DiscoverScreen from './screens/DiscoverScreen';
import ExploreScreen from './screens/ExploreScreen';
import InsiderScreen from './screens/InsiderScreen';
import SocialScreen from './screens/SocialScreen';
import ProfileScreen from './screens/ProfileScreen';
import AIAssistant from './components/ai/AIAssistant';

function App() {
  const [activeTab, setActiveTab] = useState('discover');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DiscoverScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-midnight-navy">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.4 
          }}
        >
          {renderActiveScreen()}
        </motion.div>
      </AnimatePresence>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <AIAssistant />
    </div>
  );
}

export default App;