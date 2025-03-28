import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { supabase } from '../../supabase';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        if (userData?.user) {
          setUser(userData.user);
          
          // Fetch profile data from a profile table (in a real app)
          // For now we'll use dummy data
          setName('Jane Doe');
          setPhone('+91 98765 43210');
          setAddress('123 Safety Street, Secure City');
          setEmergencyContact('Mom: +91 98765 43211');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleSignOut = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error signing out', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveProfile = () => {
    // In a real app, you would save this to your user profile table
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setEditing(false);
      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    }, 1000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={60} color={Theme.colors.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={24} color={Theme.colors.surface} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
        
        {/* Profile Information */}
        <Card style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            
            {!editing ? (
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => setEditing(true)}
              >
                <Ionicons name="create-outline" size={20} color={Theme.colors.primary} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          
          {!editing ? (
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={20} color={Theme.colors.textLight} />
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{name}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={20} color={Theme.colors.textLight} />
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{phone}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={20} color={Theme.colors.textLight} />
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{address}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={20} color={Theme.colors.textLight} />
                <Text style={styles.infoLabel}>Emergency Contact</Text>
                <Text style={styles.infoValue}>{emergencyContact}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.editContainer}>
              <Input
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                icon="person-outline"
              />
              
              <Input
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                icon="call-outline"
              />
              
              <Input
                label="Address"
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                multiline
                icon="location-outline"
              />
              
              <Input
                label="Emergency Contact"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                placeholder="Enter emergency contact details"
                icon="people-outline"
              />
              
              <View style={styles.actionButtons}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => setEditing(false)}
                  style={styles.cancelButton}
                />
                
                <Button
                  title="Save"
                  onPress={handleSaveProfile}
                  loading={loading}
                  style={styles.saveButton}
                />
              </View>
            </View>
          )}
        </Card>
        
        {/* Additional Options */}
        <Card style={styles.optionsCard}>
          <Text style={styles.cardTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="notifications-outline" size={24} color={Theme.colors.text} />
            <Text style={styles.optionText}>Notification Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color={Theme.colors.text} />
            <Text style={styles.optionText}>Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="help-circle-outline" size={24} color={Theme.colors.text} />
            <Text style={styles.optionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="information-circle-outline" size={24} color={Theme.colors.text} />
            <Text style={styles.optionText}>About Guardian Durga</Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textLight} />
          </TouchableOpacity>
        </Card>
        
        {/* Sign Out Button */}
        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleSignOut}
          loading={loading}
          fullWidth
          style={styles.signOutButton}
        />
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Theme.colors.primary,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.surface,
  },
  userName: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  userEmail: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  infoCard: {
    marginBottom: Theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  cardTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.xs,
  },
  infoContainer: {
    marginTop: Theme.spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  infoLabel: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    width: 150,
    marginLeft: Theme.spacing.md,
  },
  infoValue: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    flex: 1,
  },
  editContainer: {
    marginTop: Theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
  optionsCard: {
    marginBottom: Theme.spacing.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  optionText: {
    flex: 1,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.md,
  },
  signOutButton: {
    marginVertical: Theme.spacing.lg,
  },
});

export default ProfileScreen;
