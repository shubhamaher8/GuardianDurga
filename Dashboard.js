import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Women Safety Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SOS')}>
        <Text style={styles.buttonText}>🚨 Emergency Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LiveLocation')}>
        <Text style={styles.buttonText}>📍 Live Location Sharing</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SafeZones')}>
        <Text style={styles.buttonText}>🛡️ Nearby Safe Zones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chatbot')}>
        <Text style={styles.buttonText}>🤖 AI Safety Chatbot</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CrimeReports')}>
        <Text style={styles.buttonText}>📢 Crime Reports & Alerts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Helplines')}>
        <Text style={styles.buttonText}>📞 Women Safety Helplines</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    width: '90%',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
