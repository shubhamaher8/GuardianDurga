import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import { scale, moderateScale } from '../utils/responsive';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 4,
  autoCapitalize = 'sentences',
  icon = null,
  rightIcon = null,
  onRightIconPress = null,
  style = {},
  error = null
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer, 
        multiline && styles.multilineContainer,
        error && styles.inputError
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={Theme.controlSizes.iconSize.small} 
            color={Theme.colors.textLight} 
            style={styles.icon}
          />
        )}
        
        <TextInput 
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Theme.colors.disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          autoCapitalize={autoCapitalize}
          style={[
            styles.input, 
            multiline && styles.multilineInput,
            icon && styles.inputWithIcon,
            rightIcon && styles.inputWithRightIcon
          ]}
        />
        
        {rightIcon && (
          <TouchableOpacity 
            onPress={onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons 
              name={rightIcon} 
              size={Theme.controlSizes.iconSize.small} 
              color={Theme.colors.textLight} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    minHeight: Theme.controlSizes.inputHeight,
  },
  multilineContainer: {
    minHeight: scale(100),
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    minHeight: Theme.controlSizes.inputHeight,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: scale(100),
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  icon: {
    marginLeft: Theme.spacing.md,
  },
  rightIcon: {
    marginRight: Theme.spacing.md,
    padding: Theme.spacing.xs,
  },
  inputError: {
    borderColor: Theme.colors.danger,
  },
  errorText: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.danger,
    marginTop: Theme.spacing.xs,
  },
});

export default Input; 