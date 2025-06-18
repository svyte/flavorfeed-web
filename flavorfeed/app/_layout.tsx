import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthNavigator } from '../src/navigation/AuthNavigator';
import { MainNavigator } from '../src/navigation/MainNavigator';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isAuthenticated = false; // TODO: Replace with Zustand store selector

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
