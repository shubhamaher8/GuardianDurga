import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Theme from '../theme/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  fullWidth = false, 
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  style = {}
}) => {
  // Define styles based on the variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? Theme.colors.disabledBackground : Theme.colors.primary,
          borderColor: Theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? Theme.colors.disabledBackground : Theme.colors.secondary,
          borderColor: Theme.colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? Theme.colors.disabledBackground : Theme.colors.primary,
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? Theme.colors.disabledBackground : Theme.colors.danger,
          borderColor: Theme.colors.danger,
        };
      case 'success':
        return {
          backgroundColor: disabled ? Theme.colors.disabledBackground : Theme.colors.success,
          borderColor: Theme.colors.success,
        };
      default:
        return {
          backgroundColor: disabled ? Theme.colors.disabledBackground : Theme.colors.primary,
          borderColor: Theme.colors.primary,
        };
    }
  };

  // Define text color based on the variant
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return {
          color: disabled ? Theme.colors.disabledText : Theme.colors.primary,
        };
      default:
        return {
          color: disabled ? Theme.colors.disabledText : Theme.colors.surface,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        fullWidth && styles.fullWidth,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' ? Theme.colors.primary : Theme.colors.surface} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.buttonText, getTextStyle()]}>
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    minHeight: 48,
  },
  buttonText: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: Theme.spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button; 