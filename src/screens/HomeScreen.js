import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={{ uri: 'https://i.ibb.co/N6Fj0t7w/background-2726039-960-720.png' }} 
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: 'https://i.pravatar.cc/200' }} style={styles.profileImage} />
          <Text style={styles.title}>Hi, Username</Text>
          <Text style={styles.subtitle}>Safety In Your Hands</Text>
        </View>

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} onPress={() => navigation.navigate('PanicConfirmation')}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        {/* Quick Access Buttons */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={[styles.gridButton, styles.purple]} onPress={() => navigation.navigate('EmergencyContacts')}>
            <Ionicons name="call" size={28} color="white" />
            <Text style={styles.buttonText}>Emergency Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridButton, styles.orange]} onPress={() => navigation.navigate('IncidentReporting')}>
            <Ionicons name="warning" size={28} color="white" />
            <Text style={styles.buttonText}>Report Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridButton, styles.blue]} onPress={() => navigation.navigate('FakeCall')}>
            <Ionicons name="call-outline" size={28} color="white" />
            <Text style={styles.buttonText}>Fake Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridButton, styles.yellow]} onPress={() => navigation.navigate('SafetyTips')}>
            <Ionicons name="book" size={28} color="white" />
            <Text style={styles.buttonText}>Safety Tips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridButton, styles.green]} onPress={() => navigation.navigate('LiveLocation')}>
            <Ionicons name="location" size={28} color="white" />
            <Text style={styles.buttonText}>Live Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridButton, styles.red]} onPress={() => navigation.navigate('SafetyZones')}>
            <Ionicons name="shield" size={28} color="white" />
            <Text style={styles.buttonText}>Safety Zones</Text>
          </TouchableOpacity>
        </View>

        {/* Chatbot (Durga AI) */}
        <TouchableOpacity style={styles.chatbotButton} onPress={() => navigation.navigate('Chatbot')}>
          <Ionicons name="chatbubble-ellipses" size={28} color="white" />
        </TouchableOpacity>

        {/* End Bar */}
        <View style={styles.endBar}>
          <TouchableOpacity style={styles.endBarButton} onPress={() => navigation.navigate('Community')}>
            <Ionicons name="people" size={24} color="white" />
            <Text style={styles.endBarText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endBarButton} onPress={() => navigation.navigate('ShareIncident')}>
            <Ionicons name="share" size={24} color="white" />
            <Text style={styles.endBarText}>Share Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endBarButton} onPress={() => navigation.navigate('HelpOthers')}>
            <Ionicons name="heart" size={24} color="white" />
            <Text style={styles.endBarText}>Help Others</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Slight overlay for readability
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
  },
  sosButton: {
    backgroundColor: '#FF3B3B',
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sosText: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
  },
  gridContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridButton: {
    width: '45%',
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  purple: { backgroundColor: '#6A1B9A' },
  orange: { backgroundColor: '#F57C00' },
  blue: { backgroundColor: '#0288D1' },
  yellow: { backgroundColor: '#FBC02D' },
  green: { backgroundColor: '#388E3C' },
  red: { backgroundColor: '#D32F2F' },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  chatbotButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#6200EA',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  endBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#333',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
  },
  endBarButton: {
    alignItems: 'center',
  },
  endBarText: {
    color: '#FFF',
    fontSize: 12,
  },
});

export default HomeScreen;
