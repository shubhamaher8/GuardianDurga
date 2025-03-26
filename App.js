import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';

import Register from './Register.js';
import Home from './Home.js';
import SafetyTips from './SafetyTips.js';
import Contact from './Contact.js';
import Dashboard from './Dashboard.js';
import SOS from './SOS.js';
import LiveLocation from './LiveLocation.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    };

    getLocation();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        {!isLoggedIn ? (
          <Stack.Screen name="Register">
            {props => <Register {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Dashboard">
              {props => <Dashboard {...props} location={location} />}
            </Stack.Screen>
            <Stack.Screen name="LiveLocation" component={LiveLocation} />
            <Stack.Screen name="SOS">
              {props => <SOS {...props} location={location} />}
            </Stack.Screen>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SafetyTips" component={SafetyTips} />
            <Stack.Screen name="Contact" component={Contact} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
