import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../../supabase';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');

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
            style={styles.menuButton} 
            onPress={() => navigation.navigate('MenuDrawer')}
          >
            <Ionicons name="menu" size={28} color={Theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={36} color={Theme.colors.primary} />
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
              <Ionicons name="warning" size={28} color={Theme.colors.surface} />
              <Text style={styles.panicButtonText}>PANIC MODE</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.cardsContainer}>
            <Card 
              title="Emergency Contacts" 
              subtitle="Manage your trusted contacts"
              icon="call"
              iconColor={Theme.colors.primary}
              onPress={() => navigation.navigate('EmergencyContacts')}
              style={styles.card}
            />
            
            <Card 
              title="Report Incident" 
              subtitle="File a formal complaint"
              icon="document-text"
              iconColor={Theme.colors.warning}
              onPress={() => navigation.navigate('IncidentReporting')}
              style={styles.card}
            />
            
            <Card 
              title="Fake Call" 
              subtitle="Simulate an incoming call"
              icon="call"
              iconColor={Theme.colors.success}
              onPress={() => navigation.navigate('FakeCall')}
              style={styles.card}
            />
            
            <Card 
              title="Safety Tips" 
              subtitle="Learn how to stay safe"
              icon="shield-checkmark"
              iconColor={Theme.colors.info}
              onPress={() => navigation.navigate('SafetyTips')}
              style={styles.card}
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

        {/* Weather Alert Section - New Feature */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Alerts</Text>
          <Card 
            title="Local Weather Alerts" 
            subtitle="Stay informed about weather conditions"
            icon="cloud"
            iconColor={Theme.colors.info}
            onPress={() => navigation.navigate('WeatherAlerts')}
            style={styles.card}
          >
            <Text style={styles.weatherAlertText}>
              Weather can impact your safety. Get real-time updates about severe weather conditions in your area.
            </Text>
          </Card>
        </View>
      </ScrollView>
      
      {/* Durga AI Floating Button */}
      <TouchableOpacity 
        style={styles.durgaAiButton}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color={Theme.colors.surface} />
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
  menuButton: {
    marginRight: Theme.spacing.md,
    padding: Theme.spacing.xs,
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
    flexDirection: 'column',
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
  weatherAlertText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
    marginTop: Theme.spacing.sm,
  },
  durgaAiButton: {
    position: 'absolute',
    bottom: Theme.spacing.lg,
    right: Theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.md,
  },
});

export default HomeScreen;