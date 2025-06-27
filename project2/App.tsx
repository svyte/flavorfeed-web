import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import BottomNavigation from './components/layout/BottomNavigation';
import DiscoverScreen from './screens/DiscoverScreen';
import ExploreScreen from './screens/ExploreScreen';
import InsiderScreen from './screens/InsiderScreen';
import SocialScreen from './screens/SocialScreen';
import ProfileScreen from './screens/ProfileScreen';
import AIAssistant from './components/ai/AIAssistant';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <LoginScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/onboarding" element={
            <ProtectedRoute requireAuth={true} requireOnboarding={false}>
              <OnboardingScreen />
            </ProtectedRoute>
          } />
          
          {/* Main App Routes */}
          <Route path="/discover" element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <AppLayout initialTab="discover" />
            </ProtectedRoute>
          } />
          
          <Route path="/explore" element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <AppLayout initialTab="explore" />
            </ProtectedRoute>
          } />
          
          <Route path="/insider" element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <AppLayout initialTab="insider" />
            </ProtectedRoute>
          } />
          
          <Route path="/social" element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <AppLayout initialTab="social" />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute requireAuth={true} requireOnboarding={true}>
              <AppLayout initialTab="profile" />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/discover" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// App Layout with bottom navigation
function AppLayout({ initialTab }: { initialTab: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'insider':
        return <InsiderScreen />;
      case 'social':
        return <SocialScreen />;
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