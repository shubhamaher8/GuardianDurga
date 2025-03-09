import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleNumberPress = (number) => {
    setPhoneNumber(phoneNumber + number);
  };

  const handleDial = () => {
    let phoneUrl = `tel:${phoneNumber}`;
    if (Platform.OS !== 'android') {
        phoneUrl = `telprompt:${phoneNumber}`;
    }
    Linking.openURL(phoneUrl);
  };

  const handleClear = () => {
    setPhoneNumber('');
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{phoneNumber}</Text>
      </View>
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((number) => (
          <TouchableOpacity
            key={number}
            style={styles.key}
            onPress={() => handleNumberPress(number.toString())}
          >
            <Text style={styles.keyText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.dialButton} onPress={handleDial}>
          <Text style={styles.dialButtonText}>Dial</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  display: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  displayText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'right',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  key: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  keyText: {
    fontSize: 24,
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
  },
  dialButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
  },
  dialButtonText: {
    color: 'white',
    fontSize: 18,
  },
  clearButton: {
     backgroundColor: 'red',
     padding: 15,
     borderRadius: 10,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
  }
});