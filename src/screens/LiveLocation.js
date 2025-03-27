import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';

const LiveLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to use this feature.');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const sendLocationViaSMS = async () => {
    if (!location) {
      Alert.alert('Location not available', 'Try again later.');
      return;
    }
    const message = `Emergency! My live location is: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    const isAvailable = await SMS.isAvailableAsync();

    if (isAvailable) {
      await SMS.sendSMSAsync(['911', '1234567890'], message);
    } else {
      Alert.alert('SMS Not Available', 'Your device does not support SMS sending.');
    }
  };

  const callEmergencyContact = () => {
    const phoneNumber = 'tel:1234567890'; // Replace with actual emergency contact number
    Linking.openURL(phoneNumber);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Location Tracking</Text>
      {location ? (
        <Text style={styles.locationText}>
          Latitude: {location.latitude}{'\n'}
          Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.loadingText}>Fetching location...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={sendLocationViaSMS}>
        <Ionicons name="chatbubble" size={24} color="white" />
        <Text style={styles.buttonText}>Send Location via SMS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={callEmergencyContact}>
        <Ionicons name="call" size={24} color="white" />
        <Text style={styles.buttonText}>Call Emergency Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  locationText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  loadingText: { fontSize: 16, color: 'red', marginBottom: 20 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontSize: 16, marginLeft: 10 },
});

export default LiveLocation;
