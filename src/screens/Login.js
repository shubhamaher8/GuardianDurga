import React, { useState } from 'react';
import { 
  View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Platform, Dimensions 
} from 'react-native';
import { supabase } from '../../supabase';

const { width } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (email === '' || password === '') {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert(error.message);
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Circular Profile Image */}
      <Image 
        source={{ uri: 'https://i.pravatar.cc/200' }} 
        style={styles.profileImage} 
      />

      <Text style={styles.welcomeText}>Welcome Back</Text>
      <Text style={styles.subText}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <View style={styles.row}>
        <TouchableOpacity>
          <Text style={styles.rememberMe}>Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={signInWithEmail} disabled={loading}>
        <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'LOGIN'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Don't have an account? <Text style={styles.signUp}>Sign up</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4267B2',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120, // Increased size
    height: 120,
    borderRadius: 60, // Circular shape
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 20,
  },
  input: {
    width: Platform.OS === 'web' ? '80%' : '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: Platform.OS === 'web' ? 10 : 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: Platform.OS === 'web' ? 14 : 16,
  },
  row: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rememberMe: {
    color: '#fff',
    fontSize: 14,
  },
  forgotPassword: {
    color: '#FFD700',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#1C1C1C',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 14,
  },
  signUp: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

export default Login;
