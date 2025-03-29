import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import { scale } from '../utils/responsive';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  leftIcon = null,
  rightIcon = null,
  loading = false,
  disabled = false,
  fullWidth = false,
  style = {}
}) => {
  // Get button colors based on variant
  const getButtonStyle = () => {
    switch(variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: Theme.colors.secondary,
        };
      case 'danger':
        return {
          backgroundColor: Theme.colors.danger,
        };
      default:
        return {
          backgroundColor: Theme.colors.primary,
        };
    }
  };
  
  // Get text color based on variant
  const getTextStyle = () => {
    switch(variant) {
      case 'outline':
        return {
          color: Theme.colors.primary,
        };
      default:
        return {
          color: Theme.colors.surface,
        };
    }
  };
  
  // Get button size
  const getSizeStyle = () => {
    switch(size) {
      case 'small':
        return {
          paddingVertical: Theme.spacing.xs,
          paddingHorizontal: Theme.spacing.md,
          minHeight: scale(36),
        };
      case 'large':
        return {
          paddingVertical: Theme.spacing.md,
          paddingHorizontal: Theme.spacing.lg,
          minHeight: scale(56),
        };
      default:
        return {
          paddingVertical: Theme.spacing.sm,
          paddingHorizontal: Theme.spacing.lg,
          minHeight: Theme.controlSizes.buttonHeight,
        };
    }
  };
  
  // Get icon size based on button size
  const getIconSize = () => {
    switch(size) {
      case 'small':
        return Theme.controlSizes.iconSize.small;
      case 'large':
        return Theme.controlSizes.iconSize.medium;
      default:
        return Theme.controlSizes.iconSize.small;
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? Theme.colors.primary : Theme.colors.surface} 
        />
      ) : (
        <>
          {leftIcon && (
            <Ionicons 
              name={leftIcon} 
              size={getIconSize()} 
              color={getTextStyle().color} 
              style={{ marginRight: Theme.spacing.xs }}
            />
          )}
          
          <Text style={[
            styles.buttonText, 
            getTextStyle(),
            size === 'small' && { fontSize: Theme.fontSizes.sm },
            size === 'large' && { fontSize: Theme.fontSizes.lg },
            disabled && styles.disabledText
          ]}>
            {title}
          </Text>
          
          {rightIcon && (
            <Ionicons 
              name={rightIcon} 
              size={getIconSize()} 
              color={getTextStyle().color} 
              style={{ marginLeft: Theme.spacing.xs }}
            />
          )}
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
    borderRadius: Theme.borderRadius.md,
  },
  buttonText: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    backgroundColor: Theme.colors.disabledBackground,
    borderColor: Theme.colors.border,
  },
  disabledText: {
    color: Theme.colors.disabledText,
  }
});

export default Button; 