import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase';
import Theme from '../theme/theme';

const DrawerContent = (props) => {
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
  
  const handleSignOut = async () => {
    try {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign Out', 
            style: 'destructive',
            onPress: async () => {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      {/* Header with user info */}
      <View style={styles.userSection}>
        <View style={styles.userIconContainer}>
          <Ionicons name="person" size={40} color={Theme.colors.primary} />
        </View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Menu Items */}
      <View style={styles.drawerItems}>
        <DrawerItem
          label="Home"
          icon={({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          )}
          onPress={() => props.navigation.navigate('Home')}
          labelStyle={styles.drawerItemLabel}
          activeTintColor={Theme.colors.primary}
          style={styles.drawerItem}
        />
        
        <DrawerItem
          label="My Profile"
          icon={({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Profile');
          }}
          labelStyle={styles.drawerItemLabel}
          activeTintColor={Theme.colors.primary}
          style={styles.drawerItem}
        />
        
        <DrawerItem
          label="Emergency Contacts"
          icon={({ color, size }) => (
            <Ionicons name="call-outline" color={color} size={size} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('EmergencyContacts');
          }}
          labelStyle={styles.drawerItemLabel}
          activeTintColor={Theme.colors.primary}
          style={styles.drawerItem}
        />
        
        <DrawerItem
          label="Safety Tips"
          icon={({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" color={color} size={size} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('SafetyTips');
          }}
          labelStyle={styles.drawerItemLabel}
          activeTintColor={Theme.colors.primary}
          style={styles.drawerItem}
        />
        
        <DrawerItem
          label="Weather Alerts"
          icon={({ color, size }) => (
            <Ionicons name="cloud-outline" color={color} size={size} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('WeatherAlerts');
          }}
          labelStyle={styles.drawerItemLabel}
          activeTintColor={Theme.colors.primary}
          style={styles.drawerItem}
        />
        
        <DrawerItem
          label="Talk to Durga AI"
          icon={({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Chatbot');
          }}
          labelStyle={styles.drawerItemLabel}
          activeTintColor={Theme.colors.primary}
          style={styles.drawerItem}
        />
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Bottom actions */}
      <View style={styles.bottomSection}>
        <DrawerItem
          label="Settings"
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            // Navigate to settings when implemented
            Alert.alert('Coming Soon', 'Settings page will be available soon!');
          }}
          labelStyle={styles.drawerItemLabel}
          activeTintColor={Theme.colors.primary}
          style={styles.drawerItem}
        />
        
        <DrawerItem
          label="Sign Out"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" color={Theme.colors.danger} size={size} />
          )}
          onPress={handleSignOut}
          labelStyle={[styles.drawerItemLabel, { color: Theme.colors.danger }]}
          style={styles.drawerItem}
        />
      </View>
      
      {/* App version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Guardian Durga v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 0,
  },
  userSection: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
  },
  userIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  username: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  email: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.sm,
  },
  drawerItems: {
    marginTop: Theme.spacing.sm,
  },
  drawerItem: {
    borderRadius: Theme.borderRadius.md,
  },
  drawerItemLabel: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '500',
  },
  bottomSection: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: Theme.spacing.md,
  },
  versionContainer: {
    padding: Theme.spacing.md,
    alignItems: 'center',
  },
  versionText: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.textLight,
  },
});

export default DrawerContent; 