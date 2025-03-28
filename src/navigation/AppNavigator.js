import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Theme from '../theme/theme';

import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import FakeCallScreen from '../screens/FakeCallScreen';
import DurgaAiScreen from '../screens/DurgaAiScreen';
import EmergencyContactsScreen from '../screens/EmergencyContactsScreen';
import FileAComplaintScreen from '../screens/FileAComplaintScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SafetyTipsScreen from '../screens/SafetyTipsScreen';
import LocationSharingScreen from '../screens/LocationSharingScreen';
import PanicConfirmationScreen from '../screens/PanicConfirmationScreen';
import AddEmergencyContactScreen from '../screens/AddEmergencyContactScreen';
import WeatherAlertsScreen from '../screens/WeatherAlertsScreen';
import DrawerContent from '../components/DrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: Theme.colors.surface,
    shadowColor: 'transparent',
    elevation: 0,
  },
  headerTitleStyle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  headerTintColor: Theme.colors.primary,
  headerBackTitleVisible: false,
  headerLeftContainerStyle: {
    paddingLeft: Theme.spacing.md,
  },
  headerRightContainerStyle: {
    paddingRight: Theme.spacing.md,
  },
};

// Home stack with all screens accessible from home
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: "My Profile",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
      <Stack.Screen 
        name="PanicConfirmation" 
        component={PanicConfirmationScreen} 
        options={{ 
          title: "Confirm Emergency",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
      <Stack.Screen 
        name="IncidentReporting" 
        component={FileAComplaintScreen} 
        options={{ 
          title: "Report Incident",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
      <Stack.Screen 
        name="EmergencyContacts" 
        component={EmergencyContactsScreen} 
        options={{ 
          title: "Emergency Contacts",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
      <Stack.Screen 
        name="AddEmergencyContact" 
        component={AddEmergencyContactScreen} 
        options={{ 
          title: "Add Contact",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
      <Stack.Screen 
        name="FakeCall" 
        component={FakeCallScreen} 
        options={{ 
          title: "Fake Call",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
      <Stack.Screen 
        name="SafetyTips" 
        component={SafetyTipsScreen} 
        options={{ 
          title: "Safety Tips",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
      <Stack.Screen 
        name="Chatbot" 
        component={DurgaAiScreen} 
        options={{ 
          title: "Durga AI Assistant",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
      <Stack.Screen 
        name="LocationSharing" 
        component={LocationSharingScreen} 
        options={{ 
          title: "Share Location",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
      <Stack.Screen 
        name="WeatherAlerts" 
        component={WeatherAlertsScreen} 
        options={{ 
          title: "Weather Alerts",
          headerBackImage: () => (
            <Ionicons name="arrow-back" size={24} color={Theme.colors.primary} />
          )
        }}
      />
    </Stack.Navigator>
  );
};

// Drawer Navigator - Main Navigation
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Theme.colors.surface,
          width: 280,
        },
        drawerLabelStyle: {
          color: Theme.colors.text,
          fontSize: Theme.fontSizes.md,
        },
        drawerActiveTintColor: Theme.colors.primary,
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      
      {/* Main App (with Drawer) */}
      <Stack.Screen name="MenuDrawer" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;