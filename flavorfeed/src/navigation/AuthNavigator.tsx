import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={() => <PlaceholderScreen title="Welcome" description="Welcome to FlavorFeed!" />} />
      <Stack.Screen name="Login" component={() => <PlaceholderScreen title="Login" description="Login to your account." />} />
      <Stack.Screen name="Signup" component={() => <PlaceholderScreen title="Signup" description="Create a new account." />} />
    </Stack.Navigator>
  );
} 