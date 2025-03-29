import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import { scale } from '../utils/responsive';

const Header = ({ 
  title, 
  onBack, 
  showBack = true, 
  rightComponent = null,
  backgroundColor = Theme.colors.surface 
}) => {
  return (
    <SafeAreaView style={{ backgroundColor }}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View style={[styles.header, { backgroundColor }]}>
        {showBack ? (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons 
              name="arrow-back" 
              size={Theme.controlSizes.iconSize.medium} 
              color={Theme.colors.primary} 
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        
        {rightComponent || <View style={styles.placeholder} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    height: scale(56),
    ...Theme.shadows.sm,
  },
  backButton: {
    padding: Theme.spacing.xs,
    width: scale(40),
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  placeholder: {
    width: scale(40),
  }
});

export default Header; 