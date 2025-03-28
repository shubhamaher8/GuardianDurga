import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../../supabase';
import Theme from '../theme/theme';
import Input from '../components/Input';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setUsernameError('');
    
    // Validate username
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      isValid = false;
    }
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    return isValid;
  };

  async function signUpWithEmail() {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (error) {
        throw error;
      }
      
      if (data?.user) {
        try {
          // Create a profile entry in the profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: data.user.id, 
                username: username,
                email: email,
                created_at: new Date(),
                updated_at: new Date()
              }
            ]);
            
          if (profileError) {
            console.error('Error creating profile:', profileError.message || JSON.stringify(profileError));
          }
        } catch (profileInsertError) {
          console.error('Exception creating profile:', profileInsertError);
        }
        
        alert('Registration successful! Please check your email to verify your account.');
        navigation.navigate('Login');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="shield-checkmark" size={64} color={Theme.colors.primary} />
            </View>
            <Text style={styles.appName}>Guardian Durga</Text>
            <Text style={styles.tagline}>Safety In Your Hands</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            
            <Input
              label="Username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setUsernameError('');
              }}
              placeholder="Enter your username"
              autoCapitalize="none"
              icon="person-outline"
              error={usernameError}
            />
            
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              error={emailError}
            />
            
            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              icon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={passwordError}
            />
            
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
              }}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              icon="lock-closed-outline"
              rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              error={confirmPasswordError}
            />
            
            <Button
              title="Sign Up"
              onPress={signUpWithEmail}
              loading={loading}
              fullWidth
              style={styles.registerButton}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  logoPlaceholder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: `${Theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  appName: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  tagline: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  formContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  title: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: Theme.colors.textLight,
    fontSize: Theme.fontSizes.sm,
    marginRight: Theme.spacing.xs,
  },
  loginLink: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSizes.sm,
    fontWeight: 'bold',
  },
});

export default Register;