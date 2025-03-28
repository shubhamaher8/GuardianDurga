import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../../supabase';
import Theme from '../theme/theme';
import Input from '../components/Input';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
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
    }
    
    return isValid;
  };

  async function signInWithEmail() {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        alert(error.message);
      } else {
        navigation.navigate('MenuDrawer');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  
  // For development - auto login
  const skipLogin = () => {
    navigation.navigate('MenuDrawer');
  };

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
            <Text style={styles.title}>Welcome Back</Text>
            
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
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              icon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={passwordError}
            />
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <Button
              title="Sign In"
              onPress={signInWithEmail}
              loading={loading}
              fullWidth
              style={styles.loginButton}
            />
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            
            {/* Dev button to skip login */}
            <TouchableOpacity 
              style={styles.devButton} 
              onPress={skipLogin}
            >
              <Text style={styles.devButtonText}>DEV: Skip Login</Text>
            </TouchableOpacity>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Theme.spacing.lg,
  },
  forgotPasswordText: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSizes.sm,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: Theme.spacing.lg,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  signupText: {
    color: Theme.colors.textLight,
    fontSize: Theme.fontSizes.sm,
    marginRight: Theme.spacing.xs,
  },
  signupLink: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  devButton: {
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
  },
  devButtonText: {
    color: Theme.colors.textLight,
    fontSize: Theme.fontSizes.xs,
  },
});

export default Login;