import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  error,
  icon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  multiline = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer, 
        error && styles.inputError,
        multiline && styles.multilineContainer
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={Theme.colors.textLight} 
            style={styles.icon} 
          />
        )}
        
        <TextInput
          style={[
            styles.input, 
            icon && styles.inputWithIcon,
            rightIcon && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Theme.colors.textLight}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
        />
        
        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={20}
            color={Theme.colors.textLight}
            style={styles.rightIcon}
            onPress={onRightIconPress}
          />
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
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
  },
  multilineContainer: {
    minHeight: 100,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 100,
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