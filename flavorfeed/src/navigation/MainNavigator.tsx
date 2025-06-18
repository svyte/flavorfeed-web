import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={() => <PlaceholderScreen title="Home" description="Discover restaurants and food experiences." />} />
      <Tab.Screen name="Search" component={() => <PlaceholderScreen title="Search" description="Find your next meal." />} />
      <Tab.Screen name="Profile" component={() => <PlaceholderScreen title="Profile" description="Manage your account and preferences." />} />
    </Tab.Navigator>
  );
} 