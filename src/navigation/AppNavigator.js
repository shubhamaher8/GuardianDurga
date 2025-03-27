import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import FakeCallScreen from '../screens/FakeCallScreen';
import DurgaAiScreen from '../screens/DurgaAiScreen';
import EmergencyContactsScreen from '../screens/EmergencyContactsScreen';
import FileAComplaintScreen from '../screens/FileAComplaintScreen';
import LiveLocation from '../screens/LiveLocation';
import SafetyZones from '../screens/SafetyZones';

// Placeholder screens for missing implementations
const Menu = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Menu Screen (Placeholder)</Text>
    </View>
);

const PanicConfirmation = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Panic Confirmation Screen (Placeholder)</Text>
    </View>
);

const SafetyTips = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Safety Tips Screen (Placeholder)</Text>
    </View>
);

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
      <Stack.Screen name="LiveLocation" component={LiveLocation} options={{ headerShown: false }} />
      <Stack.Screen name="SafetyZones" component={SafetyZones} options={{ headerShown: false }} />
      <Stack.Screen name="PanicConfirmation" component={PanicConfirmation} options={{ headerShown: false }}/>
      <Stack.Screen name="IncidentReporting" component={FileAComplaintScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="FakeCall" component={FakeCallScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="SafetyTips" component={SafetyTips} options={{ headerShown: false }}/>
      <Stack.Screen name="Chatbot" component={DurgaAiScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;