import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';

const EmergencyContactsScreen = ({ navigation }) => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);

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

  const addMockContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { name: 'New Contact', phone: 'XXXX XXXX XXXX' },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow Above Title */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileIdContainer}>
        <Text style={styles.profileIdText}>Profile ID</Text>
        <Text style={styles.profileIdNumber}>XXXX XXXX XX4473</Text>
        <Text style={styles.verifiedText}>Verified</Text>
      </View>

      <ScrollView style={styles.contactList}>
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactCard}>
            <View style={styles.contactDetails}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addContactButton} onPress={addMockContact}>
        <Text style={styles.addContactText}>+ Add Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.aiDurgaButton} onPress={() => navigation.navigate('Chatbot')}>
        <Ionicons name="chatbubbles" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backArrow: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40, // Adjusted for space after back arrow
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIdContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileIdText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileIdNumber: {
    fontSize: 14,
    marginVertical: 5,
  },
  verifiedText: {
    fontSize: 14,
    color: '#28A745',
    fontWeight: 'bold',
  },
  contactList: {
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
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
    color: '#555',
  },
  editButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
  },
  addContactButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addContactText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  aiDurgaButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default EmergencyContactsScreen;
