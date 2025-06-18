import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

interface PlaceholderScreenProps {
  title: string;
  description?: string;
}

/**
 * PlaceholderScreen is a reusable component for navigation scaffolding.
 */
export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { paddingHorizontal: width * 0.1 }]}> 
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
}); 