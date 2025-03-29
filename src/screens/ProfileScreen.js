import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { supabase } from '../../supabase';
import { getUserProfile, updateUserProfile } from '../utils/supabaseHelpers';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Fetch user profile data
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData?.user) {
        setUser(userData.user);
        
        // Get profile data
        const profileData = await getUserProfile(userData.user.id);
        
        if (profileData) {
          setUsername(profileData.username || '');
          setFullName(profileData.full_name || '');
          setPhoneNumber(profileData.phone_number || '');
          setAddress(profileData.address || '');
          setEmail(profileData.email || userData.user.email);
          setProfileImageUrl(profileData.profile_image_url || null);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  // Validate form before updating
  const validateForm = () => {
    // Add validation logic if needed
    return true;
  };
  
  // Update user profile
  const handleUpdateProfile = async () => {
    if (!validateForm()) return;
    
    setUpdating(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData?.user) {
        // Update profile
        await updateUserProfile(userData.user.id, {
          full_name: fullName,
          phone_number: phoneNumber,
          address: address,
          profile_image_url: profileImageUrl,
        });
        
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    } else {
      navigation.navigate('Login');
    }
  };
  
  // ProfileDetailsContainer component with navigation options
  const ProfileDetailsContainer = ({ navigation, fullName, phoneNumber, address, handleSignOut }) => (
    <View style={styles.profileDetailsContainer}>
      <View style={styles.profileDetail}>
        <Ionicons name="person-outline" size={24} color={Theme.colors.primary} />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>Full Name</Text>
          <Text style={styles.detailValue}>{fullName || 'Not set'}</Text>
        </View>
      </View>
      
      <View style={styles.profileDetail}>
        <Ionicons name="call-outline" size={24} color={Theme.colors.primary} />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>Phone Number</Text>
          <Text style={styles.detailValue}>{phoneNumber || 'Not set'}</Text>
        </View>
      </View>
      
      <View style={styles.profileDetail}>
        <Ionicons name="location-outline" size={24} color={Theme.colors.primary} />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>Address</Text>
          <Text style={styles.detailValue}>{address || 'Not set'}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.navigationOption}
        onPress={() => navigation.navigate('ComplaintsList')}
      >
        <Ionicons name="document-text-outline" size={24} color={Theme.colors.primary} />
        <View style={styles.detailContent}>
          <Text style={styles.optionTitle}>My Complaints</Text>
          <Text style={styles.optionDescription}>View your filed complaints history</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Theme.colors.textLight} />
      </TouchableOpacity>
      
      <Button
        title="Sign Out"
        variant="outline"
        onPress={handleSignOut}
        leftIcon="log-out-outline"
        style={styles.signOutButton}
      />
    </View>
  );
  
  // Rest of your component
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {profileImageUrl ? (
              <Image 
                source={{ uri: profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color={Theme.colors.primary} />
              </View>
            )}
          </View>
          
          <Text style={styles.username}>{username || 'User'}</Text>
          <Text style={styles.email}>{email}</Text>
          
          {!isEditing && (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={18} color={Theme.colors.primary} />
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.profileContent}>
          {isEditing ? (
            <View style={styles.editFormContainer}>
              <Input
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                icon="person-outline"
              />
              
              <Input
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                icon="call-outline"
              />
              
              <Input
                label="Address"
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                icon="location-outline"
              />
              
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  onPress={() => setIsEditing(false)}
                  variant="outline"
                  style={styles.cancelButton}
                />
                
                <Button
                  title="Save"
                  onPress={handleUpdateProfile}
                  loading={updating}
                  style={styles.saveButton}
                />
              </View>
            </View>
          ) : (
            <ProfileDetailsContainer 
              navigation={navigation} 
              fullName={fullName} 
              phoneNumber={phoneNumber} 
              address={address}
              handleSignOut={handleSignOut}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  profileImageContainer: {
    marginBottom: Theme.spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  email: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    padding: Theme.spacing.sm,
  },
  editText: {
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.xs,
  },
  profileContent: {
    padding: Theme.spacing.lg,
  },
  profileDetailsContainer: {
    gap: Theme.spacing.lg,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    shadowColor: Theme.colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  detailContent: {
    marginLeft: Theme.spacing.md,
    flex: 1,
  },
  detailLabel: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
  },
  detailValue: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    fontWeight: '500',
    marginTop: 2,
  },
  editFormContainer: {
    gap: Theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  signOutButton: {
    marginTop: Theme.spacing.xl,
  },
  navigationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    shadowColor: Theme.colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginTop: Theme.spacing.md,
  },
  optionTitle: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    marginTop: 2,
  },
});

export default ProfileScreen;
