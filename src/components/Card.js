import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Theme from '../theme/theme';

const Card = ({ 
  children, 
  style, 
  onPress = null, 
  elevation = 'sm',
  borderRadius = 'md',
  padding = true 
}) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      style={[
        styles.card,
        Theme.shadows[elevation],
        { borderRadius: Theme.borderRadius[borderRadius] },
        padding && styles.padding,
        style
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    overflow: 'hidden',
    width: '100%',
  },
  padding: {
    padding: Theme.spacing.md,
  },
});

export default Card; 