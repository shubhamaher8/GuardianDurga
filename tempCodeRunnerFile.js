import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './Register.js';
import Home from './Home.js';
import SafetyTips from './SafetyTips.js';
import Contact from './Contact.js';
import Dashboard from './Dashboard.js';
import SOS from './SOS.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        {!isLoggedIn ? (
          <Stack.Screen name="Register">
            {props => <Register {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: true }} />
            <Stack.Screen name="SOS" component={SOS} options={{ headerShown: true }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: true }} />
            <Stack.Screen name="SafetyTips" component={SafetyTips} options={{ headerShown: true }} />
            <Stack.Screen name="Contact" component={Contact} options={{ headerShown: true }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
