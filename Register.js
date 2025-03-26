import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Registration = ({ setIsLoggedIn }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    console.log('User Registered:', email);
    setIsLoggedIn(true);
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={require('./DAI.jpg')} style={styles.logo} />

        {/* Overview Section - Same as before */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Welcome to GuardianDurga</Text>
          <Text style={styles.aboutText}>
            Your safety is our priority! GuardianDurga is a smart safety platform providing real-time alerts,
            community support, and emergency help at your fingertips.
          </Text>
          <Text style={styles.aboutText}>Together, we create a safer world! 🌍</Text>
        </View>

        {/* Compact Registration Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section - Same as before */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureBox}>
            <Image source={require('./DAI.jpg')} style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Real-Time GPS Tracking</Text>
            <Text style={styles.featureText}>Live location sharing with geo-fencing alerts.</Text>
          </View>

          <View style={styles.featureBox}>
            <Image source={require('./DAI.jpg')} style={styles.featureIcon} />
            <Text style={styles.featureTitle}>AI-Powered Chatbot (Durga)</Text>
            <Text style={styles.featureText}>Real-time assistance, legal advice, self-defense tips.</Text>
          </View>

          <View style={styles.featureBox}>
            <Image source={require('./DAI.jpg')} style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Panic Mode with Alerts</Text>
            <Text style={styles.featureText}>Silent activation triggers recording & alerts.</Text>
          </View>

          <View style={styles.featureBox}>
            <Image source={require('./DAI.jpg')} style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Emergency Contact Integration</Text>
            <Text style={styles.featureText}>Quick access to predefined emergency contacts.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 20,
  },
  container: {
    width: '90%',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  aboutContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  aboutText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    width: '80%',  /* Compact Width */
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff4d4d',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureBox: {
    width: '45%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
  },
  featureIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  featureText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});

export default Registration;
