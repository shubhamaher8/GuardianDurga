import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
return (
<View style={styles.container}>
{/* Header Section */}
<View style={styles.header}>
<Text style={styles.title}>Guardian Durga</Text>
<Text style={styles.subtitle}>Safety In Your Hands</Text>
</View>

{/* Welcome Message */}
<Text style={styles.welcomeMessage}>Hi Username,</Text>

{/* Panic Button */}
<TouchableOpacity style={styles.panicButton} onPress={() => navigation.navigate('PanicConfirmation')}>
<Text style={styles.panicButtonText}>Panic Mode</Text>
</TouchableOpacity>

{/* Quick Access Buttons */}
<View style={styles.quickAccessContainer}>
{/* Emergency Contact */}
<TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('EmergencyContacts')}>
<Text style={styles.buttonText}>Emergency Contact</Text>
</TouchableOpacity>

{/* Report Incident */}
<TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('IncidentReporting')}>
<Text style={styles.buttonText}>Report Incident</Text>
</TouchableOpacity>

{/* Fake Calling */}
<TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('FakeCall')}>
<Text style={styles.buttonText}>Fake Calling</Text>
</TouchableOpacity>

{/* Safety Tips */}
<TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('SafetyTips')}>
<Text style={styles.buttonText}>Safety Tips</Text>
</TouchableOpacity>
</View>

{/* Chatbot (Durga) */}
<TouchableOpacity style={styles.durgaButton} onPress={() => navigation.navigate('Chatbot')}>
<Text style={styles.durgaButtonText}>Durga AI</Text>
</TouchableOpacity>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#00FFFF',
alignItems: 'center',
justifyContent: 'flex-start',
padding: 20,
},
header: {
marginTop: 20,
marginBottom: 30,
},
title: {
fontSize: 20,
fontWeight: 'bold',
color: '#000000',
},
subtitle: {
fontSize: 14,
color: '#000000',
},
welcomeMessage: {
fontSize: 18,
marginBottom: 20,
color: '#000000',
},
panicButton: {
width: 100,
height: 100,
borderRadius: 50,
backgroundColor: '#FF0000',
justifyContent: 'center',
alignItems: 'center',
marginBottom: 20,
},
panicButtonText: {
fontSize: 16,
color: '#FFFFFF',
},
quickAccessContainer: {
flexDirection: 'row',
justifyContent: 'space-around',
marginBottom: 20,
},
quickAccessButton: {
width: 100,
height: 50,
backgroundColor: '#90EE90',
justifyContent: 'center',
alignItems: 'center',
marginHorizontal: 10,
},
buttonText: {
fontSize: 14,
color: '#000000',
},
durgaButton: {
width: 70,
height: 70,
backgroundColor: '#FF00FF',
justifyContent: 'center',
alignItems: 'center',
position: 'absolute',
bottom: 20,
right: 20,
},
durgaButtonText: {
fontSize: 14,
color: '#FFFFFF',
},
});

export default HomeScreen;