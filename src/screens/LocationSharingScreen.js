import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import Button from '../components/Button';
import Card from '../components/Card';

const LocationSharingScreen = () => {
  const [loading, setLoading] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [sharingDuration, setSharingDuration] = useState('1 hour');
  
  // Sample emergency contacts
  const contacts = [
    { id: '1', name: 'Mom', phone: '+91 98765 43210', selected: true },
    { id: '2', name: 'Dad', phone: '+91 98765 43211', selected: true },
    { id: '3', name: 'Sister', phone: '+91 98765 43212', selected: false },
    { id: '4', name: 'Best Friend', phone: '+91 98765 43213', selected: false },
    { id: '5', name: 'Roommate', phone: '+91 98765 43214', selected: false },
  ];
  
  // Duration options
  const durations = ['15 minutes', '30 minutes', '1 hour', '2 hours', '4 hours', '8 hours'];
  
  useEffect(() => {
    // Initialize selected contacts
    setSelectedContacts(contacts.filter(contact => contact.selected));
    
    // Simulate checking for location permissions
    setTimeout(() => {
      setLocationPermissionGranted(true);
    }, 500);
  }, []);
  
  const toggleContact = (contactId) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId ? { ...contact, selected: !contact.selected } : contact
    );
    setSelectedContacts(updatedContacts.filter(contact => contact.selected));
  };
  
  const requestLocationPermission = () => {
    // In a real app, you would request actual location permissions
    setLoading(true);
    setTimeout(() => {
      setLocationPermissionGranted(true);
      setLoading(false);
    }, 1000);
  };
  
  const shareLocation = () => {
    if (selectedContacts.length === 0) {
      Alert.alert('Select Contacts', 'Please select at least one contact to share your location with.');
      return;
    }
    
    setLoading(true);
    
    // Simulate location sharing process
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Location Shared',
        `Your location has been shared with ${selectedContacts.length} contact(s) for ${sharingDuration}.`,
        [{ text: 'OK' }]
      );
    }, 1500);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={48} color={Theme.colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Share Your Location</Text>
          <Text style={styles.headerDescription}>
            Keep your trusted contacts updated on your whereabouts for added security
          </Text>
        </View>
        
        {!locationPermissionGranted ? (
          <Card style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Location Permission Required</Text>
            <Text style={styles.permissionDescription}>
              To share your location, Guardian Durga needs permission to access your device's location.
            </Text>
            <Button
              title="Grant Permission"
              onPress={requestLocationPermission}
              loading={loading}
              style={styles.permissionButton}
            />
          </Card>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sharing Duration</Text>
              <View style={styles.durationContainer}>
                {durations.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationOption,
                      sharingDuration === duration && styles.durationOptionActive
                    ]}
                    onPress={() => setSharingDuration(duration)}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        sharingDuration === duration && styles.durationTextActive
                      ]}
                    >
                      {duration}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Contacts</Text>
              <Text style={styles.sectionDescription}>
                Choose who you want to share your location with
              </Text>
              
              {contacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactItem}
                  onPress={() => toggleContact(contact.id)}
                >
                  <View style={styles.contactInfo}>
                    <View style={[
                      styles.contactIcon,
                      { backgroundColor: contact.selected ? Theme.colors.primary : Theme.colors.border }
                    ]}>
                      <Text style={styles.contactInitial}>{contact.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.contactDetails}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                  </View>
                  <Switch
                    value={contact.selected}
                    onValueChange={() => toggleContact(contact.id)}
                    trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
                    thumbColor={Theme.colors.surface}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.actionContainer}>
              <Button
                title="Share Location"
                onPress={shareLocation}
                loading={loading}
                fullWidth
                style={styles.shareButton}
              />
              
              <Text style={styles.disclaimer}>
                Your location will be shared for {sharingDuration} and will automatically stop afterward.
                You can stop sharing at any time.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  headerDescription: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    textAlign: 'center',
    maxWidth: '80%',
  },
  permissionCard: {
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  permissionTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  permissionDescription: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  permissionButton: {
    minWidth: 200,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  sectionDescription: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    marginBottom: Theme.spacing.md,
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.sm,
  },
  durationOption: {
    width: '48%',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  durationOptionActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: `${Theme.colors.primary}10`,
  },
  durationText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  durationTextActive: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInitial: {
    fontSize: Theme.fontSizes.md,
    fontWeight: 'bold',
    color: Theme.colors.surface,
  },
  contactDetails: {
    marginLeft: Theme.spacing.md,
  },
  contactName: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '500',
    color: Theme.colors.text,
  },
  contactPhone: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
  },
  actionContainer: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  shareButton: {
    marginBottom: Theme.spacing.md,
  },
  disclaimer: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
});

export default LocationSharingScreen;
