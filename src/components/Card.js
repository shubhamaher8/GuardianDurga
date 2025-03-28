import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import { scale } from '../utils/responsive';

const Card = ({ 
  children, 
  style,
  title = null,
  subtitle = null,
  icon = null,
  iconColor = Theme.colors.primary,
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
      {(title || subtitle || icon) && (
        <View style={styles.cardHeader}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
              <Ionicons 
                name={icon} 
                size={Theme.controlSizes.iconSize.medium} 
                color={iconColor} 
              />
            </View>
          )}
          
          {(title || subtitle) && (
            <View style={[styles.textContainer, icon && styles.textContainerWithIcon]}>
              {title && <Text style={styles.title}>{title}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          )}
        </View>
      )}
      
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: title => title ? Theme.spacing.sm : 0,
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  textContainerWithIcon: {
    paddingVertical: Theme.spacing.xs,
  },
  title: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs / 2,
  },
});

export default Card; 