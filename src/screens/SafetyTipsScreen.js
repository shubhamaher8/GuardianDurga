import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../theme/theme';
import Card from '../components/Card';

const SafetyTipsScreen = () => {
  const safetyTips = [
    {
      id: '1',
      title: 'Be aware of your surroundings',
      description: 'Stay alert and aware of your environment at all times. Keep your head up and avoid distractions like using your phone while walking in unfamiliar areas.',
      icon: 'eye-outline',
    },
    {
      id: '2',
      title: 'Share your location with trusted contacts',
      description: 'Let friends or family know where you\'re going and when you expect to arrive, especially when meeting new people or traveling alone.',
      icon: 'location-outline',
    },
    {
      id: '3',
      title: 'Trust your instincts',
      description: 'If a situation or person makes you feel uncomfortable, trust your gut feeling and remove yourself from the situation.',
      icon: 'body-outline',
    },
    {
      id: '4',
      title: 'Keep emergency contacts accessible',
      description: 'Save important numbers like local police, trusted friends/family, and emergency services so they\'re readily available.',
      icon: 'call-outline',
    },
    {
      id: '5',
      title: 'Use well-lit and populated routes',
      description: 'When walking at night, stick to well-lit streets and paths with other people around whenever possible.',
      icon: 'flashlight-outline',
    },
    {
      id: '6',
      title: 'Have a safety code word',
      description: 'Establish a code word with friends and family that signals you need help without alerting others around you.',
      icon: 'key-outline',
    },
    {
      id: '7',
      title: 'Keep your phone charged',
      description: 'Ensure your phone has sufficient battery life when you\'re out, and consider carrying a power bank for emergencies.',
      icon: 'battery-charging-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={64} color={Theme.colors.info} />
          </View>
          <Text style={styles.headerTitle}>Personal Safety Tips</Text>
          <Text style={styles.headerDescription}>
            Follow these best practices to stay safe in various situations
          </Text>
        </View>
        
        <View style={styles.tipsContainer}>
          {safetyTips.map((tip) => (
            <Card
              key={tip.id}
              title={tip.title}
              icon={tip.icon}
              iconColor={Theme.colors.info}
              style={styles.tipCard}
            >
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </Card>
          ))}
        </View>
        
        <View style={styles.emergencyContainer}>
          <Text style={styles.emergencyTitle}>In Case of Emergency</Text>
          <Text style={styles.emergencyDescription}>
            Use the panic button on the home screen to alert your emergency contacts or contact emergency services directly.
          </Text>
          <View style={styles.emergencyNumbersContainer}>
            <View style={styles.emergencyNumberItem}>
              <Ionicons name="call" size={24} color={Theme.colors.danger} />
              <Text style={styles.emergencyNumberText}>Police: 100</Text>
            </View>
            <View style={styles.emergencyNumberItem}>
              <Ionicons name="medkit" size={24} color={Theme.colors.danger} />
              <Text style={styles.emergencyNumberText}>Ambulance: 108</Text>
            </View>
            <View style={styles.emergencyNumberItem}>
              <Ionicons name="woman" size={24} color={Theme.colors.danger} />
              <Text style={styles.emergencyNumberText}>Women's Helpline: 1091</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${Theme.colors.info}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  headerDescription: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    textAlign: 'center',
  },
  tipsContainer: {
    marginBottom: Theme.spacing.xl,
  },
  tipCard: {
    marginBottom: Theme.spacing.md,
  },
  tipDescription: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    lineHeight: 22,
    marginTop: Theme.spacing.sm,
  },
  emergencyContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.sm,
  },
  emergencyTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    color: Theme.colors.danger,
    marginBottom: Theme.spacing.sm,
  },
  emergencyDescription: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
    lineHeight: 22,
  },
  emergencyNumbersContainer: {
    marginTop: Theme.spacing.sm,
  },
  emergencyNumberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  emergencyNumberText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.md,
    fontWeight: '500',
  },
});

export default SafetyTipsScreen; 