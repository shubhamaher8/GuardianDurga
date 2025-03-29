import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  StatusBar,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Theme from '../theme/theme';
import { scale, wp, moderateScale, screenDimensions } from '../utils/responsive';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';

// List of pre-configured caller profiles
const callerProfiles = [
  { 
    id: 1, 
    name: 'Mom', 
    icon: 'person-circle',
    iconColor: Theme.colors.warning,
  },
  { 
    id: 2, 
    name: 'Dad', 
    icon: 'person',
    iconColor: Theme.colors.info,
  },
  { 
    id: 3, 
    name: 'Work', 
    icon: 'briefcase',
    iconColor: Theme.colors.secondary,
  },
  { 
    id: 4, 
    name: 'Home', 
    icon: 'home',
    iconColor: Theme.colors.success,
  },
];

const FakeCallSetupScreen = ({ navigation }) => {
  const [selectedProfile, setSelectedProfile] = useState(callerProfiles[0]);
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [delaySeconds, setDelaySeconds] = useState(5);
  
  // Start fake call with the selected profile and delay
  const startFakeCall = () => {
    const totalDelayMs = (delayMinutes * 60 + delaySeconds) * 1000;
    
    if (totalDelayMs > 0) {
      Alert.alert(
        'Fake Call Scheduled',
        `Your fake call from ${selectedProfile.name} will arrive in ${delayMinutes > 0 ? `${delayMinutes} min ` : ''}${delaySeconds} sec.`,
        [{ text: 'OK' }]
      );
      
      // Schedule the fake call
      setTimeout(() => {
        navigation.navigate('FakeCall', { 
          callerProfile: selectedProfile 
        });
      }, totalDelayMs);
    } else {
      // Start immediately
      navigation.navigate('FakeCall', { 
        callerProfile: selectedProfile 
      });
    }
  };
  
  // Render each caller profile option
  const renderCallerItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.profileItem,
        selectedProfile.id === item.id && styles.selectedProfileItem
      ]}
      onPress={() => setSelectedProfile(item)}
    >
      <View style={[styles.profileAvatar, {backgroundColor: item.iconColor + '20'}]}>
        <Ionicons 
          name={item.icon} 
          size={Theme.controlSizes.iconSize.large} 
          color={item.iconColor} 
        />
      </View>
      <Text style={[
        styles.profileName,
        selectedProfile.id === item.id && styles.selectedProfileName
      ]}>
        {item.name}
      </Text>
      
      {selectedProfile.id === item.id && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={Theme.controlSizes.iconSize.small} color={Theme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Configure Your Fake Call</Text>
          <Text style={styles.sectionDescription}>
            Schedule a fake incoming call to help you in uncomfortable situations.
          </Text>
          
          <Text style={styles.subtitle}>Who will call you?</Text>
          <FlatList
            data={callerProfiles}
            renderItem={renderCallerItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.profileList}
          />
          
          <View style={styles.delaySection}>
            <Text style={styles.subtitle}>When will the call arrive?</Text>
            
            <View style={styles.timeDisplayContainer}>
              <View style={styles.timeDisplay}>
                <Text style={styles.timeValue}>{delayMinutes}</Text>
                <Text style={styles.timeLabel}>min</Text>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timeDisplay}>
                <Text style={styles.timeValue}>{delaySeconds.toString().padStart(2, '0')}</Text>
                <Text style={styles.timeLabel}>sec</Text>
              </View>
            </View>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Minutes</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={30}
                step={1}
                value={delayMinutes}
                onValueChange={setDelayMinutes}
                minimumTrackTintColor={Theme.colors.primary}
                maximumTrackTintColor={Theme.colors.border}
                thumbTintColor={Theme.colors.primary}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderMinLabel}>0</Text>
                <Text style={styles.sliderMaxLabel}>30</Text>
              </View>
            </View>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Seconds</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={59}
                step={5}
                value={delaySeconds}
                onValueChange={setDelaySeconds}
                minimumTrackTintColor={Theme.colors.primary}
                maximumTrackTintColor={Theme.colors.border}
                thumbTintColor={Theme.colors.primary}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderMinLabel}>0</Text>
                <Text style={styles.sliderMaxLabel}>59</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.quickPresetsContainer}>
            <Text style={styles.subtitle}>Quick Presets</Text>
            <View style={styles.presetsRow}>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => {
                  setDelayMinutes(0);
                  setDelaySeconds(5);
                }}
              >
                <Text style={styles.presetText}>5 sec</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => {
                  setDelayMinutes(0);
                  setDelaySeconds(30);
                }}
              >
                <Text style={styles.presetText}>30 sec</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => {
                  setDelayMinutes(1);
                  setDelaySeconds(0);
                }}
              >
                <Text style={styles.presetText}>1 min</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => {
                  setDelayMinutes(2);
                  setDelaySeconds(0);
                }}
              >
                <Text style={styles.presetText}>2 min</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Button
            title="Start Fake Call"
            leftIcon="call"
            onPress={startFakeCall}
            style={styles.startButton}
            fullWidth
          />
          
          <Text style={styles.tip}>
            Tip: Schedule the call a few seconds ahead so you can put your phone away before it rings.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  card: {
    padding: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  sectionDescription: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    marginBottom: Theme.spacing.lg,
  },
  subtitle: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  profileList: {
    paddingVertical: Theme.spacing.md,
  },
  profileItem: {
    alignItems: 'center',
    marginRight: Theme.spacing.lg,
    width: scale(80),
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedProfileItem: {
    borderColor: Theme.colors.primary,
    backgroundColor: `${Theme.colors.primary}10`,
  },
  profileAvatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    marginBottom: Theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
    textAlign: 'center',
  },
  selectedProfileName: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: Theme.spacing.xs,
    right: Theme.spacing.xs,
    backgroundColor: Theme.colors.surface,
    borderRadius: 10,
  },
  delaySection: {
    marginVertical: Theme.spacing.lg,
  },
  timeDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  timeDisplay: {
    alignItems: 'center',
    width: scale(70),
  },
  timeValue: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  timeLabel: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.textLight,
    marginTop: -Theme.spacing.xs,
  },
  timeSeparator: {
    fontSize: Theme.fontSizes.xxl,
    color: Theme.colors.primary,
    marginHorizontal: Theme.spacing.sm,
  },
  sliderContainer: {
    marginVertical: Theme.spacing.sm,
  },
  sliderLabel: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -Theme.spacing.sm,
  },
  sliderMinLabel: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.textLight,
  },
  sliderMaxLabel: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.textLight,
  },
  quickPresetsContainer: {
    marginVertical: Theme.spacing.md,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  presetButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: `${Theme.colors.primary}15`,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  presetText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  startButton: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary,
  },
  tip: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Theme.spacing.md,
  },
});

export default FakeCallSetupScreen; 