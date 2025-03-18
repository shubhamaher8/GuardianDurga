import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './Register';

// First, make sure to install these packages:
// npx expo install @react-navigation/native
// npx expo install @react-navigation/native-stack
// npx expo install react-native-screens react-native-safe-area-context

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{ headerShown: false }}
        />
        {/* Add more screens here later */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}