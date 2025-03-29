import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Switch, Alert, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Theme from '../theme/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { supabase } from '../../supabase';
import { 
  getSavedContacts, 
  saveContact, 
  deleteContact, 
  saveLocationSharing, 
  stopLocationSharing,
  updateSharedLocation
} from '../utils/supabaseHelpers';

const LocationSharingScreen = () => {
  const [loading, setLoading] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [sharingDuration, setSharingDuration] = useState('1 hour');
  const [modalVisible, setModalVisible] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [contacts, setContacts] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activeSharingId, setActiveSharingId] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Duration options
  const durations = ['15 minutes', '30 minutes', '1 hour', '2 hours', '4 hours', '8 hours'];
  
  useEffect(() => {
    // Check for Supabase auth session
    const getUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
        fetchContacts(data.session.user.id);
      } else {
        // Handle not logged in state
        Alert.alert('Authentication Required', 'Please login to use location sharing features.');
      }
    };
    
    getUserSession();
    checkLocationPermission();
  }, [refreshKey]);
  
  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setLocationPermissionGranted(true);
      // Get current location
      getCurrentLocation();
    } else {
      setLocationPermissionGranted(false);
    }
  };
  
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Failed to get your current location. Please try again.');
    }
  };
  
  const fetchContacts = async (uid) => {
    if (!uid) {
      console.error('No user ID provided for fetching contacts');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching contacts for user:', uid);
      
      const contactsData = await getSavedContacts(uid);
      console.log('Contacts data received:', contactsData);
      
      if (!contactsData) {
        console.error('No contacts data returned');
        setContacts([]);
        return;
      }
      
      // Convert to the format used in this component
      const formattedContacts = contactsData.map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        selected: false
      }));
      
      console.log('Formatted contacts:', formattedContacts);
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', `Failed to load your contacts: ${error.message}`);
      setContacts([]); // Set empty array to prevent undefined errors
    } finally {
      setLoading(false);
    }
  };
  
  const toggleContact = (contactId) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId ? { ...contact, selected: !contact.selected } : contact
    );
    setContacts(updatedContacts);
    setSelectedContacts(updatedContacts.filter(contact => contact.selected));
  };

  const addContact = async () => {
    // Validate inputs
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Invalid Input', 'Please enter both name and phone number.');
      return;
    }
    
    if (!userId) {
      Alert.alert('Not Logged In', 'You must be logged in to add contacts.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Save to Supabase
      const result = await saveContact(userId, {
        name: newContactName.trim(),
        phone: newContactPhone.trim()
      });
      
      console.log('Contact save result:', result);
      
      if (result && result.length > 0) {
        // Create contact object with the returned ID
        const newContact = {
          id: result[0].id,
          name: newContactName.trim(),
          phone: newContactPhone.trim(),
          selected: true
        };
        
        // Add to contacts list
        const updatedContacts = [...contacts, newContact];
        setContacts(updatedContacts);
        setSelectedContacts(updatedContacts.filter(contact => contact.selected));
        
        // Reset modal and form
        setNewContactName('');
        setNewContactPhone('');
        setModalVisible(false);
        
        Alert.alert('Success', 'Contact added successfully.');
      } else {
        // Handle case where contact was added but no data was returned
        setNewContactName('');
        setNewContactPhone('');
        setModalVisible(false);
        setRefreshKey(prev => prev + 1); // Force refresh to get the new contact
        Alert.alert('Success', 'Contact added successfully. Refreshing list...');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      Alert.alert('Error', 'Failed to add the contact. Please try again.');
      
      // Even if there's an error, try to refresh contacts
      setRefreshKey(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteContact = async (contactId) => {
    // Ask for confirmation
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // Delete from Supabase
              await deleteContact(contactId);
              
              // Update local state
              const updatedContacts = contacts.filter(contact => contact.id !== contactId);
              setContacts(updatedContacts);
              setSelectedContacts(updatedContacts.filter(contact => contact.selected));
              
              // Force refresh
              setRefreshKey(prev => prev + 1);
              
              Alert.alert('Success', 'Contact deleted successfully.');
            } catch (error) {
              console.error('Error deleting contact:', error);
              Alert.alert('Error', `Failed to delete the contact: ${error.message}`);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermissionGranted(true);
        getCurrentLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to share your location.');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission. Please try again.');
    }
  };
  
  const shareLocation = async () => {
    if (selectedContacts.length === 0) {
      Alert.alert('Select Contacts', 'Please select at least one contact to share your location with.');
      return;
    }
    
    if (!currentLocation) {
      Alert.alert('Location Not Available', 'Your current location is not available. Please try again.');
      getCurrentLocation();
      return;
    }
    
    try {
      setLoading(true);
      
      // We'll use the simplified contact structure defined in supabaseHelpers.js
      const result = await saveLocationSharing(userId, {
        contacts: selectedContacts,
        duration: sharingDuration,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      });
      
      if (result && result.length > 0) {
        setActiveSharingId(result[0].id);
        setIsSharing(true);
        
        // Setup a timer to stop sharing after the duration expires
        setupSharingTimer(sharingDuration, result[0].id);
        
        Alert.alert(
          'Location Shared',
          `Your location has been shared with ${selectedContacts.length} contact(s) for ${sharingDuration}.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to share your location. Please try again.');
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      
      // Provide a user-friendly error message based on the error type
      if (error.message && error.message.includes('stack depth limit exceeded')) {
        Alert.alert('Error', 'Too many contacts selected. Please select fewer contacts and try again.');
      } else if (error.code === '54001') {
        Alert.alert('Error', 'Database error. Please select fewer contacts and try again.');
      } else {
        Alert.alert('Error', 'Failed to share your location. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const stopSharing = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      await stopLocationSharing(userId);
      setIsSharing(false);
      setActiveSharingId(null);
      Alert.alert('Sharing Stopped', 'Your location is no longer being shared.');
    } catch (error) {
      console.error('Error stopping location sharing:', error);
      Alert.alert('Error', `Failed to stop location sharing: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const setupSharingTimer = (duration, sharingId) => {
    // Parse the duration string to get milliseconds
    let timeInMs = 60 * 60 * 1000; // Default 1 hour
    
    if (duration.includes('minute')) {
      const minutes = parseInt(duration.split(' ')[0]);
      timeInMs = minutes * 60 * 1000;
    } else if (duration.includes('hour')) {
      const hours = parseInt(duration.split(' ')[0]);
      timeInMs = hours * 60 * 60 * 1000;
    }
    
    // Set a timeout to stop sharing after the duration
    setTimeout(() => {
      if (isSharing && activeSharingId === sharingId) {
        stopSharing();
      }
    }, timeInMs);
    
    // Also set up periodic location updates
    const updateInterval = setInterval(async () => {
      if (isSharing && activeSharingId === sharingId) {
        try {
          // Update current location
          const location = await Location.getCurrentPositionAsync({});
          setCurrentLocation(location.coords);
          
          // Update in database
          await updateSharedLocation(
            userId, 
            location.coords.latitude, 
            location.coords.longitude
          );
        } catch (error) {
          console.error('Error updating location:', error);
        }
      } else {
        // Clear interval if not sharing anymore
        clearInterval(updateInterval);
      }
    }, 60000); // Update every minute
    
    // Return cleanup function
    return () => clearInterval(updateInterval);
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
            {isSharing && (
              <View style={styles.activeSharing}>
                <Text style={styles.activeSharingText}>
                  Currently sharing your location with {selectedContacts.length} contact(s)
                </Text>
                <Button
                  title="Stop Sharing"
                  onPress={stopSharing}
                  loading={loading}
                  style={styles.stopSharingButton}
                />
              </View>
            )}
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sharing Duration</Text>
              <View style={styles.durationContainer}>
                {durations.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationOption,
                      sharingDuration === duration && styles.durationOptionActive,
                      isSharing && styles.disabled
                    ]}
                    onPress={() => !isSharing && setSharingDuration(duration)}
                    disabled={isSharing}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        sharingDuration === duration && styles.durationTextActive,
                        isSharing && styles.disabledText
                      ]}
                    >
                      {duration}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Select Contacts</Text>
                  <Text style={styles.sectionDescription}>
                    Choose who you want to share your location with
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.addButton, isSharing && styles.disabled]}
                  onPress={() => !isSharing && setModalVisible(true)}
                  disabled={isSharing}
                >
                  <Ionicons name="add-circle" size={24} color={isSharing ? Theme.colors.border : Theme.colors.primary} />
                  <Text style={[styles.addButtonText, isSharing && styles.disabledText]}>Add</Text>
                </TouchableOpacity>
              </View>
              
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading contacts...</Text>
                </View>
              ) : contacts.length === 0 ? (
                <Text style={styles.noContactsText}>
                  No contacts found. Add your trusted contacts to share your location with them.
                </Text>
              ) : (
                contacts.map((contact) => (
                  <View key={contact.id} style={styles.contactItem}>
                    <TouchableOpacity
                      style={styles.contactInfo}
                      onPress={() => !isSharing && toggleContact(contact.id)}
                      disabled={isSharing}
                    >
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
                    </TouchableOpacity>
                    <View style={styles.contactActions}>
                      <Switch
                        value={contact.selected}
                        onValueChange={() => !isSharing && toggleContact(contact.id)}
                        trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
                        thumbColor={Theme.colors.surface}
                        disabled={isSharing}
                      />
                      {!isSharing && (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteContact(contact.id)}
                        >
                          <Ionicons name="trash-outline" size={20} color={Theme.colors.error} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
            
            <View style={styles.actionContainer}>
              {!isSharing ? (
                <Button
                  title="Share Location"
                  onPress={shareLocation}
                  loading={loading}
                  fullWidth
                  style={styles.shareButton}
                  disabled={!contacts.some(contact => contact.selected)}
                />
              ) : (
                <Button
                  title="Stop Sharing"
                  onPress={stopSharing}
                  loading={loading}
                  fullWidth
                  style={styles.stopSharingButton}
                />
              )}
              
              <Text style={styles.disclaimer}>
                {!isSharing 
                  ? `Your location will be shared for ${sharingDuration} and will automatically stop afterward. You can stop sharing at any time.`
                  : `Your location is currently being shared and will automatically stop after the set duration. You can stop sharing at any time.`
                }
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Contact</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={newContactName}
                onChangeText={setNewContactName}
                placeholder="Enter contact name"
                placeholderTextColor={Theme.colors.textLight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={newContactPhone}
                onChangeText={setNewContactPhone}
                placeholder="Enter phone number"
                placeholderTextColor={Theme.colors.textLight}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addContactButton]}
                onPress={addContact}
                disabled={loading}
              >
                <Text style={styles.addContactButtonText}>{loading ? 'Adding...' : 'Add Contact'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
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
    marginBottom: 0,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  addButtonText: {
    color: Theme.colors.primary,
    fontWeight: '500',
    marginLeft: 4,
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
  loadingContainer: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    color: Theme.colors.textLight,
    fontSize: Theme.fontSizes.md,
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
    flex: 1,
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
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: Theme.spacing.sm,
    marginLeft: Theme.spacing.sm,
  },
  actionContainer: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  shareButton: {
    marginBottom: Theme.spacing.md,
  },
  stopSharingButton: {
    marginBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.error,
  },
  disclaimer: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Theme.spacing.md,
  },
  inputLabel: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: '500',
    color: Theme.colors.textLight,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.lg,
  },
  modalButton: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  cancelButton: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cancelButtonText: {
    color: Theme.colors.text,
    fontWeight: '500',
  },
  addContactButton: {
    backgroundColor: Theme.colors.primary,
  },
  addContactButtonText: {
    color: Theme.colors.surface,
    fontWeight: '500',
  },
  activeSharing: {
    backgroundColor: `${Theme.colors.primary}15`,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.lg,
    alignItems: 'center',
  },
  activeSharingText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.primary,
    fontWeight: '500',
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Theme.colors.textLight,
  },
  noContactsText: {
    textAlign: 'center',
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    padding: Theme.spacing.lg,
  },
});

export default LocationSharingScreen;
