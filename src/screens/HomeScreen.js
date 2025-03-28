import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../../supabase';
import { scale, wp, hp, moderateScale, screenDimensions, listenOrientationChange } from '../utils/responsive';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [orientation, setOrientation] = useState(screenDimensions.isPortrait() ? 'portrait' : 'landscape');

  // Listen for orientation changes
  useEffect(() => {
    const subscription = listenOrientationChange(({ window }) => {
      setOrientation(window.height > window.width ? 'portrait' : 'landscape');
    });
    
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          
          // Try to get username from profiles table
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', data.user.id)
            .single();
            
          if (profileData?.username) {
            setUsername(profileData.username);
          } else {
            // Fallback to email username part
            setUsername(data.user.email?.split('@')[0] || 'User');
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    getUserInfo();
  }, []);

  // Calculate the number of cards per row based on orientation
  const cardsPerRow = orientation === 'landscape' ? 2 : 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {username}</Text>
          <Text style={styles.welcomeText}>Welcome to Guardian Durga</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={Theme.controlSizes.iconSize.large} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Emergency Section */}
        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>Emergency</Text>
          <TouchableOpacity 
            style={styles.panicButton} 
            onPress={() => navigation.navigate('PanicConfirmation')}
          >
            <View style={styles.panicButtonContent}>
              <Ionicons name="warning" size={Theme.controlSizes.iconSize.medium} color={Theme.colors.surface} />
              <Text style={styles.panicButtonText}>PANIC MODE</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={[styles.cardsContainer, { flexDirection: orientation === 'landscape' ? 'row' : 'column' }]}>
            <Card 
              title="Emergency Contacts" 
              subtitle="Manage your trusted contacts"
              icon="call"
              iconColor={Theme.colors.primary}
              onPress={() => navigation.navigate('EmergencyContacts')}
              style={[styles.card, orientation === 'landscape' && { width: wp(42), marginRight: wp(2) }]}
            />
            
            <Card 
              title="File Complaint" 
              subtitle="Report an incident"
              icon="document-text"
              iconColor={Theme.colors.warning}
              onPress={() => navigation.navigate('FileAComplaint')}
              style={[styles.card, orientation === 'landscape' && { width: wp(42), marginLeft: wp(2) }]}
            />
            
            <Card 
              title="My Complaints" 
              subtitle="View your complaint history"
              icon="list"
              iconColor={Theme.colors.info}
              onPress={() => navigation.navigate('ComplaintsList')}
              style={[styles.card, orientation === 'landscape' && { width: wp(42), marginRight: wp(2) }]}
            />
            
            <Card 
              title="Fake Call" 
              subtitle="Simulate an incoming call"
              icon="call"
              iconColor={Theme.colors.success}
              onPress={() => navigation.navigate('FakeCallSetup')}
              style={[styles.card, orientation === 'landscape' && { width: wp(42), marginLeft: wp(2) }]}
            />
            
            <Card 
              title="Safety Tips" 
              subtitle="Learn how to stay safe"
              icon="shield-checkmark"
              iconColor={Theme.colors.info}
              onPress={() => navigation.navigate('SafetyTips')}
              style={[styles.card, orientation === 'landscape' && { width: wp(42), marginRight: wp(2) }]}
            />
          </View>
        </View>
        
        {/* Location Sharing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Sharing</Text>
          <Card style={styles.locationCard}>
            <View style={styles.locationCardContent}>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationTitle}>Share Your Location</Text>
                <Text style={styles.locationSubtitle}>Let trusted contacts know where you are</Text>
              </View>
              <Button 
                title="Share" 
                variant="outline"
                size="small"
                onPress={() => navigation.navigate('LocationSharing')}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
      
      {/* Durga AI Floating Button */}
      <TouchableOpacity 
        style={styles.durgaAiButton}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Ionicons name="chatbubble-ellipses" size={Theme.controlSizes.iconSize.medium} color={Theme.colors.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    ...Theme.shadows.sm,
  },
  greeting: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  welcomeText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: Theme.spacing.xs,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  emergencySection: {
    marginBottom: Theme.spacing.lg,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  panicButton: {
    backgroundColor: Theme.colors.danger,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  panicButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panicButtonText: {
    color: Theme.colors.surface,
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    marginLeft: Theme.spacing.md,
  },
  cardsContainer: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: Theme.spacing.md,
  },
  locationCard: {
    marginTop: Theme.spacing.xs,
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  locationSubtitle: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  durgaAiButton: {
    position: 'absolute',
    bottom: Theme.spacing.lg,
    right: Theme.spacing.lg,
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: Theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.md,
  },
});

export default HomeScreen;