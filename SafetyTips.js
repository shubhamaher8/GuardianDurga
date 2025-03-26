import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SafetyTips = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safety Tips</Text>
      <Text style={styles.text}>🔹 Always share your location with trusted contacts.</Text>
      <Text style={styles.text}>🔹 Carry a whistle or safety alarm.</Text>
      <Text style={styles.text}>🔹 Be aware of your surroundings at all times.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d9534f',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
  },
});

export default SafetyTips;
