import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import Button from '../components/Button';

const PanicConfirmationScreen = ({ navigation }) => {
  const [countdown, setCountdown] = useState(5);
  const [panicActivated, setPanicActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Emergency phone numbers
  const POLICE_EMERGENCY_NUMBER = '911';  // Change as needed for your region
  const AMBULANCE_EMERGENCY_NUMBER = '911';  // Change as needed for your region
  
  // Function to make a phone call
  const makePhoneCall = (phoneNumber) => {
    let phoneUrl = Platform.OS === 'android' ? `tel:${phoneNumber}` : `telprompt:${phoneNumber}`;
    
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Phone Call Not Supported', 'Your device does not support making phone calls');
        }
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to make phone call');
        console.error('Error making phone call:', err);
      });
  };
  
  // Function to call police
  const callPolice = () => {
    Alert.alert(
      'Call Emergency Services',
      `Are you sure you want to call the police? (${POLICE_EMERGENCY_NUMBER})`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', style: 'destructive', onPress: () => makePhoneCall(POLICE_EMERGENCY_NUMBER) }
      ],
      { cancelable: true }
    );
  };
  
  // Function to call ambulance
  const callAmbulance = () => {
    Alert.alert(
      'Call Emergency Services',
      `Are you sure you want to call an ambulance? (${AMBULANCE_EMERGENCY_NUMBER})`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', style: 'destructive', onPress: () => makePhoneCall(AMBULANCE_EMERGENCY_NUMBER) }
      ],
      { cancelable: true }
    );
  };
  
  useEffect(() => {
    let timer;
    if (panicActivated && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (panicActivated && countdown === 0) {
      triggerPanicActions();
    }
    
    return () => clearTimeout(timer);
  }, [panicActivated, countdown]);
  
  const activatePanic = () => {
    setPanicActivated(true);
  };
  
  const cancelPanic = () => {
    setPanicActivated(false);
    setCountdown(5);
  };
  
  const triggerPanicActions = () => {
    setLoading(true);
    
    // Simulate sending alerts to emergency contacts
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Emergency Alerts Sent',
        'Your emergency contacts have been notified of your situation with your current location.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }, 2000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.danger} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="warning" size={80} color={Theme.colors.surface} />
          <Text style={styles.title}>Emergency Alert</Text>
          
          {!panicActivated ? (
            <Text style={styles.description}>
              Activating panic mode will alert your emergency contacts with your current location
            </Text>
          ) : (
            <Text style={styles.countdownText}>
              Sending alerts in <Text style={styles.countdownNumber}>{countdown}</Text>
            </Text>
          )}
        </View>
        
        {!panicActivated ? (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.emergencyOption, styles.panicButton]}
              onPress={activatePanic}
            >
              <Ionicons name="alert-circle" size={42} color={Theme.colors.surface} />
              <Text style={styles.panicButtonText}>ACTIVATE PANIC MODE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.emergencyOption, styles.cancelMainButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <View style={styles.emergencyOptions}>
              <TouchableOpacity 
                style={styles.emergencyOption}
                onPress={callPolice}
              >
                <Ionicons name="call" size={32} color={Theme.colors.surface} />
                <Text style={styles.emergencyOptionText}>Call Police</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.emergencyOption}
                onPress={callAmbulance}
              >
                <Ionicons name="medical" size={32} color={Theme.colors.surface} />
                <Text style={styles.emergencyOptionText}>Call Ambulance</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.emergencyOption}
                onPress={() => navigation.navigate('EmergencyContacts')}
              >
                <Ionicons name="people" size={32} color={Theme.colors.surface} />
                <Text style={styles.emergencyOptionText}>Call Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.actionsContainer}>
            {!loading ? (
              <TouchableOpacity
                style={[styles.emergencyOption, styles.cancelPanicButtonNew]}
                onPress={cancelPanic}
              >
                <Ionicons name="close-circle" size={42} color="#ffffff" />
                <Text style={styles.cancelPanicTextNew}>CANCEL</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Sending alerts...</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.danger,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: Theme.colors.surface,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  description: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.surface,
    textAlign: 'center',
    marginHorizontal: Theme.spacing.lg,
  },
  countdownText: {
    fontSize: Theme.fontSizes.xl,
    color: Theme.colors.surface,
    textAlign: 'center',
    marginTop: Theme.spacing.lg,
  },
  countdownNumber: {
    fontSize: Theme.fontSizes.xxxl,
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginBottom: Theme.spacing.xl,
  },
  mainActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xl,
  },
  panicButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '100%',
    paddingVertical: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  cancelMainButton: {
    width: '40%',
    paddingVertical: Theme.spacing.sm,
    marginBottom: Theme.spacing.xl,
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.surface,
    textAlign: 'center',
    fontWeight: '500',
  },
  panicButtonText: {
    fontSize: Theme.fontSizes.md,
    fontWeight: 'bold',
    color: Theme.colors.surface,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  sendNowButton: {
    marginBottom: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
  },
  cancelPanicButton: {
    borderColor: Theme.colors.surface,
  },
  cancelPanicButtonText: {
    color: Theme.colors.surface,
  },
  emergencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Theme.spacing.lg,
  },
  emergencyOption: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    minWidth: 90,
  },
  emergencyOptionText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.surface,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  cancelPanicButtonNew: {
    width: '80%',
    paddingVertical: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  cancelPanicTextNew: {
    fontSize: Theme.fontSizes.lg,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: Theme.spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  loadingText: {
    fontSize: Theme.fontSizes.lg,
    color: Theme.colors.surface,
    fontWeight: 'bold',
  },
});

export default PanicConfirmationScreen;
