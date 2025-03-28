import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import { scale } from '../utils/responsive';

import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import FakeCallScreen from '../screens/FakeCallScreen';
import FakeCallSetupScreen from '../screens/FakeCallSetupScreen';
import DurgaAiScreen from '../screens/DurgaAiScreen';
import EmergencyContactsScreen from '../screens/EmergencyContactsScreen';
import FileAComplaintScreen from '../screens/FileAComplaintScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SafetyTipsScreen from '../screens/SafetyTipsScreen';
import LocationSharingScreen from '../screens/LocationSharingScreen';
import PanicConfirmationScreen from '../screens/PanicConfirmationScreen';
import AddEmergencyContactScreen from '../screens/AddEmergencyContactScreen';
import ComplaintsListScreen from '../screens/ComplaintsListScreen';
import ComplaintDetailsScreen from '../screens/ComplaintDetailsScreen';

const Stack = createStackNavigator();

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: Theme.colors.surface,
    shadowColor: 'transparent',
    elevation: 0,
    height: scale(56),
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
  cardStyle: {
    backgroundColor: Theme.colors.background
  },
  headerBackImage: () => (
    <Ionicons name="arrow-back" size={Theme.controlSizes.iconSize.medium} color={Theme.colors.primary} />
  )
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
        options={{ title: "My Profile" }}
      />
      <Stack.Screen 
        name="ComplaintsList" 
        component={ComplaintsListScreen} 
        options={{ title: "My Complaints" }}
      />
      <Stack.Screen 
        name="ComplaintDetails" 
        component={ComplaintDetailsScreen} 
        options={{ title: "Complaint Details" }}
      />
      <Stack.Screen 
        name="PanicConfirmation" 
        component={PanicConfirmationScreen} 
        options={{ title: "Confirm Emergency" }}
      />
      <Stack.Screen 
        name="FileAComplaint" 
        component={FileAComplaintScreen} 
        options={{ title: "File a Complaint" }}
      />
      <Stack.Screen 
        name="IncidentReporting" 
        component={FileAComplaintScreen} 
        options={{ title: "Report Incident" }}
      />
      <Stack.Screen 
        name="EmergencyContacts" 
        component={EmergencyContactsScreen} 
        options={{ title: "Emergency Contacts" }}
      />
      <Stack.Screen 
        name="AddEmergencyContact" 
        component={AddEmergencyContactScreen} 
        options={{ title: "Add Contact" }}
      />
      <Stack.Screen 
        name="FakeCallSetup" 
        component={FakeCallSetupScreen} 
        options={{ title: "Fake Call Setup" }}
      />
      <Stack.Screen 
        name="FakeCall" 
        component={FakeCallScreen} 
        options={{ 
          title: "Incoming Call",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="SafetyTips" 
        component={SafetyTipsScreen} 
        options={{ title: "Safety Tips" }}
      />
      <Stack.Screen 
        name="Chatbot" 
        component={DurgaAiScreen} 
        options={{ title: "Durga AI Assistant" }}
      />
      <Stack.Screen 
        name="LocationSharing" 
        component={LocationSharingScreen} 
        options={{ title: "Share Location" }}
      />
    </Stack.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ 
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
        cardStyle: {
          backgroundColor: Theme.colors.background
        }
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{
          animationEnabled: false,
          gestureEnabled: false
        }}
      />
      <Stack.Screen name="Register" component={Register} />
      
      {/* Main App */}
      <Stack.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          animationEnabled: false,
          gestureEnabled: false
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;