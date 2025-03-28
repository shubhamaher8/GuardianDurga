import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import Button from '../components/Button';

const PanicConfirmationScreen = ({ navigation }) => {
  const [countdown, setCountdown] = useState(5);
  const [panicActivated, setPanicActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
            <Button
              title="ACTIVATE PANIC MODE"
              variant="danger"
              size="large"
              onPress={activatePanic}
              fullWidth
              style={styles.activateButton}
            />
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <View style={styles.emergencyOptions}>
              <TouchableOpacity style={styles.emergencyOption}>
                <Ionicons name="call" size={32} color={Theme.colors.surface} />
                <Text style={styles.emergencyOptionText}>Call Police</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.emergencyOption}>
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
            <Button
              title={loading ? "SENDING ALERTS..." : "SEND NOW"}
              variant="danger"
              size="large"
              onPress={triggerPanicActions}
              loading={loading}
              fullWidth
              style={styles.sendNowButton}
            />
            
            {!loading && (
              <Button
                title="CANCEL"
                variant="outline"
                size="large"
                onPress={cancelPanic}
                fullWidth
                style={styles.cancelPanicButton}
                textStyle={styles.cancelPanicButtonText}
              />
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
  activateButton: {
    marginBottom: Theme.spacing.lg,
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
  cancelButton: {
    alignItems: 'center',
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  cancelText: {
    fontSize: Theme.fontSizes.lg,
    color: Theme.colors.surface,
    fontWeight: '500',
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
});

export default PanicConfirmationScreen;
