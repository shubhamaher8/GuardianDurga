import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import { Audio } from 'expo-av';

const FakeCallScreen = ({ navigation }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop the ringtone when leaving the screen
  const stopRingtone = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setIsPlaying(false);
    }
  };

  // Handle back button press to stop the ringtone
  useEffect(() => {
    const backAction = () => {
      stopRingtone();
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation, sound]);

  // Automatically play the ringtone when the screen loads
  useEffect(() => {
    playRingtone();

    return () => {
      stopRingtone();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Caller Details */}
      <View style={styles.callerDetails}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image instead of local asset
          style={styles.callerAvatar}
        />
        <Text style={styles.callerName}>Mom</Text>
        <Text style={styles.callStatus}>Incoming Call...</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {/* Decline Button */}
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={() => {
            stopRingtone();
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>

        {/* Answer Button */}
        <TouchableOpacity
          style={[styles.button, styles.answerButton]}
          onPress={() => {
            stopRingtone();
            navigation.navigate('FakeCallActive'); // Navigate to a mock call screen
          }}
        >
          <Text style={styles.buttonText}>Answer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  callerDetails: {
    alignItems: 'center',
    marginBottom: 50,
  },
  callerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  callStatus: {
    fontSize: 18,
    color: '#8E44AD',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#FF0000',
  },
  answerButton: {
    backgroundColor: '#32CD32',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default FakeCallScreen;