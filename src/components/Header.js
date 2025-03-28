import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';

const Header = ({ title, onBack, showBack = true }) => {
  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    ...Theme.shadows.sm,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  rightPlaceholder: {
    width: 24,
    height: 24,
  }
});

export default Header; 