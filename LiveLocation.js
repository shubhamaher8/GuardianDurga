import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function LiveLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLoading(false);
    })();
  }, []);

  const shareLocation = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const locationMessage = `📍 My Live Location: https://www.google.com/maps?q=${latitude},${longitude}`;
      Alert.alert('Share this Location', locationMessage);
    } else {
      Alert.alert('Error', 'Location not available yet.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Live Location Sharing</Text>
      {loading ? <ActivityIndicator size="large" color="#ff4d4d" /> : null}
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      {location ? (
        <Text style={styles.locationText}>
          Latitude: {location.coords.latitude} {"\n"}
          Longitude: {location.coords.longitude}
        </Text>
      ) : (
        !loading && <Text style={styles.errorText}>Location not available.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={shareLocation}>
        <Text style={styles.buttonText}>📤 Share Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff4d4d',
  },
  locationText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
