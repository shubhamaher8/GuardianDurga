import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Contact = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.text}>📞 Women Helpline: 1091</Text>
      <Text style={styles.text}>📧 Email: support@guardiandurga.com</Text>
      <Text style={styles.text}>📍 Location: Delhi, India</Text>
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

export default Contact;
