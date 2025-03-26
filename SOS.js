import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SOS = () => {
  const handleSOSPress = () => {
    console.log("🚨 SOS Button Pressed!");
    // Yahan baad me emergency call + location sharing add karenge
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Emergency SOS</Text>

      {/* SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {/* Emergency Contacts & Helplines */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>⚠️ Tap SOS to alert emergency contacts</Text>
        <Text style={styles.helpline}>📞 Women Helpline: 1091</Text>
        <Text style={styles.helpline}>📞 Police: 100</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff4d4d',
  },
  sosButton: {
    backgroundColor: '#ff0000',
    padding: 50,
    borderRadius: 100,
    elevation: 10,
  },
  sosText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  helpline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
});

export default SOS;
