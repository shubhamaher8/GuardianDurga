import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Contacts from 'expo-contacts';

const EmergencyContactsScreen = ({ navigation }) => {
  // State to store emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Fetch emergency contacts (mock data for now)
  const fetchEmergencyContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        const formattedContacts = data.map(contact => ({
          name: contact.name,
          phone: contact.phoneNumbers ? contact.phoneNumbers[0].number : '',
        }));
        setEmergencyContacts(formattedContacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Add a mock contact for demonstration
  const addMockContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { name: 'New Contact', phone: 'XXXX XXXX XXXX' },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>EMERGENCY CONTACTS</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        </TouchableOpacity>
      </View>

      {/* Profile ID */}
      <View style={styles.profileIdContainer}>
        <Text style={styles.profileIdText}>Profile ID</Text>
        <Text style={styles.profileIdNumber}>XXXX XXXX XX4473</Text>
        <Text style={styles.verifiedText}>Verified</Text>
      </View>

      {/* Contact List */}
      <View style={styles.contactList}>
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactCard}>
            <View style={styles.contactDetails}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>XXXX XXXX XXXX</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Contacts */}
      <TouchableOpacity style={styles.addContactButton} onPress={addMockContact}>
        <Text style={styles.addContactText}>+ Add Contacts</Text>
      </TouchableOpacity>

      {/* AI Durga Button */}
      <TouchableOpacity style={styles.aiDurgaButton} onPress={() => navigation.navigate('Chatbot')}>
        <Text style={styles.aiDurgaText}>AI DURGA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9E79F',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  settingsIcon: {
    width: 30,
    height: 30,
  },
  profileIdContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileIdText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileIdNumber: {
    fontSize: 14,
  },
  verifiedText: {
    fontSize: 14,
    color: '#008000',
  },
  contactList: {
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#FFC107',
  },
  editButtonText: {
    fontSize: 14,
    color: '#000000',
  },
  addContactButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  addContactText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiDurgaButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFC107',
    borderRadius: 50,
    padding: 10,
  },
  aiDurgaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default EmergencyContactsScreen;