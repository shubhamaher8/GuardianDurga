import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  BackHandler, 
  SafeAreaView, 
  StatusBar,
  Vibration,
  Animated,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import { scale, wp, hp, moderateScale, screenDimensions } from '../utils/responsive';

// We're removing the hardcoded caller profiles since they're now managed in the setup screen

const FakeCallScreen = ({ navigation, route }) => {
  // Get the selected caller profile from route params
  const callerProfile = route.params?.callerProfile;
  
  // If no caller profile is provided, go back to setup screen
  useEffect(() => {
    if (!callerProfile) {
      Alert.alert(
        'Error',
        'No caller profile selected. Please configure your fake call first.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [callerProfile]);
  
  const [incomingCallMode, setIncomingCallMode] = useState(true);
  const [callTimer, setCallTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Start pulse animation for incoming call
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Start slide animation for answer/decline buttons
  const startSlideAnimation = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Start call timer when call is answered
  const startCallTimer = () => {
    const interval = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Format timer to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Answer the call
  const handleAnswerCall = () => {
    Vibration.cancel();
    setIncomingCallMode(false);
    startCallTimer();
  };

  // Decline or end call
  const handleEndCall = () => {
    Vibration.cancel();
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    navigation.goBack();
  };

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      // If in active call mode, ask for confirmation
      if (!incomingCallMode) {
        Alert.alert(
          'End Call',
          'Are you sure you want to end this call?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'End Call', style: 'destructive', onPress: handleEndCall }
          ]
        );
        return true;
      }
      
      // If in incoming call mode, just go back
      Vibration.cancel();
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [incomingCallMode]);

  // Start animations and vibration when screen loads
  useEffect(() => {
    // Start playing immediately when the screen opens
    const timer = setTimeout(() => {
      // Vibration pattern
      Vibration.vibrate([500, 1000, 500, 1000], true);
      
      // Start animations
      startPulseAnimation();
      startSlideAnimation();
    }, 500);

    return () => {
      clearTimeout(timer);
      Vibration.cancel();
      
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  // If no caller profile is available, show loading screen
  if (!callerProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primaryDark} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading call...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primaryDark} />
      
      {/* Incoming Call UI */}
      {incomingCallMode ? (
        <View style={styles.incomingCallContainer}>
          <View style={styles.callerInfo}>
            <Animated.View style={[
              styles.avatarContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}>
              <View style={[styles.callerAvatar, {backgroundColor: callerProfile.iconColor + '20'}]}>
                <Ionicons 
                  name={callerProfile.icon} 
                  size={Theme.controlSizes.iconSize.xlarge} 
                  color={callerProfile.iconColor} 
                />
              </View>
            </Animated.View>
            
            <Text style={styles.callerName}>{callerProfile.name}</Text>
            <Text style={styles.callStatus}>Incoming Call...</Text>
          </View>
          
          <Animated.View style={[
            styles.callActions,
            { 
              transform: [{ 
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0]
                }) 
              }],
              opacity: slideAnim
            }
          ]}>
            {/* Decline Button */}
            <TouchableOpacity
              style={[styles.callButton, styles.declineButton]}
              onPress={handleEndCall}
            >
              <Ionicons name="call" size={Theme.controlSizes.iconSize.large} color={Theme.colors.surface} style={styles.declineIcon} />
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
            
            {/* Answer Button */}
            <TouchableOpacity
              style={[styles.callButton, styles.answerButton]}
              onPress={handleAnswerCall}
            >
              <Ionicons name="call" size={Theme.controlSizes.iconSize.large} color={Theme.colors.surface} />
              <Text style={styles.buttonText}>Answer</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        /* Active Call UI */
        <View style={styles.activeCallContainer}>
          <View style={styles.activeCallHeader}>
            <Text style={styles.callTimerText}>{formatTime(callTimer)}</Text>
            <Text style={styles.onCallText}>ON CALL</Text>
          </View>
          
          <View style={styles.activeCallerInfo}>
            <View style={[styles.activeCallerAvatar, {backgroundColor: callerProfile.iconColor + '20'}]}>
              <Ionicons 
                name={callerProfile.icon} 
                size={Theme.controlSizes.iconSize.large} 
                color={callerProfile.iconColor} 
              />
            </View>
            <Text style={styles.activeCallerName}>{callerProfile.name}</Text>
          </View>
          
          <View style={styles.callControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="volume-high" size={Theme.controlSizes.iconSize.medium} color={Theme.colors.surface} />
              <Text style={styles.controlText}>Speaker</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="mic-off" size={Theme.controlSizes.iconSize.medium} color={Theme.colors.surface} />
              <Text style={styles.controlText}>Mute</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="keypad" size={Theme.controlSizes.iconSize.medium} color={Theme.colors.surface} />
              <Text style={styles.controlText}>Keypad</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={32} color={Theme.colors.surface} style={styles.endCallIcon} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primaryDark,
  },
  // Incoming Call Styles
  incomingCallContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Theme.spacing.xl,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: hp(10),
  },
  avatarContainer: {
    padding: Theme.spacing.sm,
    borderRadius: scale(100),
    backgroundColor: `${Theme.colors.surface}30`,
    marginBottom: Theme.spacing.lg,
  },
  callerAvatar: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  callerName: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: Theme.colors.surface,
    marginBottom: Theme.spacing.sm,
  },
  callStatus: {
    fontSize: Theme.fontSizes.lg,
    color: `${Theme.colors.surface}90`,
  },
  callActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: hp(5),
  },
  callButton: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: Theme.colors.danger,
  },
  answerButton: {
    backgroundColor: Theme.colors.success,
  },
  declineIcon: {
    transform: [{ rotate: '135deg' }],
  },
  buttonText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.surface,
    marginTop: Theme.spacing.xs,
  },
  
  // Active Call Styles
  activeCallContainer: {
    flex: 1,
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  activeCallHeader: {
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  callTimerText: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: 'bold',
    color: Theme.colors.surface,
  },
  onCallText: {
    fontSize: Theme.fontSizes.sm,
    color: `${Theme.colors.surface}80`,
    marginTop: Theme.spacing.xs,
  },
  activeCallerInfo: {
    alignItems: 'center',
    marginTop: hp(10),
  },
  activeCallerAvatar: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCallerName: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: 'bold',
    color: Theme.colors.surface,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: hp(15),
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: `${Theme.colors.surface}20`,
  },
  controlText: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.surface,
    marginTop: Theme.spacing.xs,
  },
  endCallButton: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    backgroundColor: Theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  },
  endCallIcon: {
    transform: [{ rotate: '135deg' }],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: 'bold',
    color: Theme.colors.surface,
  },
});

export default FakeCallScreen;