import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SafetyZones = ({ navigation }) => {
  // State for safety zones
  const [zones, setZones] = useState([
    { id: '1', name: 'City Hospital', location: 'Downtown' },
    { id: '2', name: 'Police Station', location: 'Main Street' },
    { id: '3', name: 'Community Shelter', location: 'West End' },
  ]);

  // Function to add a new zone manually
  const addZone = () => {
    Alert.prompt(
      "Add Safety Zone",
      "Enter the name and location of the safety zone (separated by a comma)",
      (text) => {
        const [name, location] = text.split(',');
        if (name && location) {
          setZones([...zones, { id: (zones.length + 1).toString(), name: name.trim(), location: location.trim() }]);
        } else {
          Alert.alert("Invalid Input", "Please enter both name and location separated by a comma.");
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Note about Map Issues */}
      <Text style={styles.note}>
        ⚠️ Due to technical issues, maps are not currently integrated. This page provides a list of safety zones instead.
      </Text>

      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#333" />
      </TouchableOpacity>

      {/* Page Title */}
      <Text style={styles.title}>Safety Zones</Text>

      {/* List of Safety Zones */}
      <FlatList
        data={zones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.zoneItem}>
            <Ionicons name="shield-checkmark" size={24} color="green" />
            <View style={styles.zoneInfo}>
              <Text style={styles.zoneName}>{item.name}</Text>
              <Text style={styles.zoneLocation}>{item.location}</Text>
            </View>
          </View>
        )}
      />

      {/* Add Safety Zone Button */}
      <TouchableOpacity style={styles.addButton} onPress={addZone}>
        <Ionicons name="add-circle" size={60} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  note: {
    fontSize: 14,
    color: '#d9534f',
    marginBottom: 10,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  zoneInfo: {
    marginLeft: 15,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  zoneLocation: {
    fontSize: 14,
    color: '#777',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default SafetyZones;
