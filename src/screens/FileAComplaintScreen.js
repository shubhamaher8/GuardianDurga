import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../supabase';
import { addComplaint } from '../utils/supabaseHelpers';
import Theme from '../theme/theme';
import { scale, wp, screenDimensions } from '../utils/responsive';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const complaintTypes = [
  'Harassment',
  'Theft',
  'Physical Assault',
  'Cyber Crime',
  'Domestic Violence',
  'Stalking',
  'Other'
];

const FileAComplaintScreen = ({ navigation }) => {
  // State variables for form fields
  const [complaintType, setComplaintType] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Error states
  const [typeError, setTypeError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [detailsError, setDetailsError] = useState('');

  // Form validation
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setTypeError('');
    setLocationError('');
    setDetailsError('');
    
    if (!complaintType) {
      setTypeError('Please select a complaint type');
      isValid = false;
    }
    
    if (!location.trim()) {
      setLocationError('Please enter the incident location');
      isValid = false;
    }
    
    if (!details.trim()) {
      setDetailsError('Please provide details about the incident');
      isValid = false;
    }
    
    return isValid;
  };

  // Handle complaint submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData?.user) {
        // Format date and time for storage
        const formattedDate = date.toISOString().split('T')[0];
        const formattedTime = time.toTimeString().split(' ')[0];
        
        // Insert complaint record
        await addComplaint({
          user_id: userData.user.id,
          type: complaintType,
          date: formattedDate,
          time: formattedTime,
          location: location,
          details: details,
          status: 'submitted'
        });
        
        Alert.alert(
          'Complaint Submitted',
          'Your complaint has been successfully submitted.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert('Error', 'Failed to submit your complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Handle time change
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Incident Information</Text>
          <Text style={styles.sectionDescription}>
            Please provide details about the incident you want to report.
            All information will be kept confidential.
          </Text>
          
          {/* Complaint Type Selection */}
          <Text style={styles.inputLabel}>Complaint Type *</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typeContainer}
            contentContainerStyle={styles.typeContent}
          >
            {complaintTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeItem,
                  complaintType === type && styles.typeItemSelected
                ]}
                onPress={() => {
                  setComplaintType(type);
                  setTypeError('');
                }}
              >
                <Text 
                  style={[
                    styles.typeText,
                    complaintType === type && styles.typeTextSelected
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {typeError ? <Text style={styles.errorText}>{typeError}</Text> : null}
          
          {/* Date and Time */}
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeField}>
              <Text style={styles.inputLabel}>Date *</Text>
              <TouchableOpacity 
                style={styles.dateTimePicker}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                <Ionicons name="calendar-outline" size={Theme.controlSizes.iconSize.small} color={Theme.colors.primary} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
            
            <View style={styles.dateTimeField}>
              <Text style={styles.inputLabel}>Time *</Text>
              <TouchableOpacity 
                style={styles.dateTimePicker}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
                <Ionicons name="time-outline" size={Theme.controlSizes.iconSize.small} color={Theme.colors.primary} />
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}
            </View>
          </View>
          
          {/* Location */}
          <Input
            label="Location *"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              setLocationError('');
            }}
            placeholder="Enter incident location"
            icon="location-outline"
            error={locationError}
          />
          
          {/* Details */}
          <Input
            label="Incident Details *"
            value={details}
            onChangeText={(text) => {
              setDetails(text);
              setDetailsError('');
            }}
            placeholder="Describe what happened in detail..."
            multiline
            numberOfLines={6}
            icon="document-text-outline"
            error={detailsError}
          />
        </Card>
        
        <Card style={styles.card}>
          <Text style={styles.noteText}>
            Your report will be confidential and will be handled by authorized personnel.
          </Text>
          
          <Button
            title={loading ? "Submitting..." : "Submit Report"}
            onPress={handleSubmit}
            disabled={loading}
            leftIcon={loading ? null : "paper-plane-outline"}
            fullWidth
            style={styles.submitButton}
          />
          
          {loading && (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color={Theme.colors.primary}
            />
          )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  card: {
    marginBottom: Theme.spacing.lg,
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
    marginBottom: Theme.spacing.md,
  },
  inputLabel: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: '500',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  typeContainer: {
    marginBottom: Theme.spacing.sm,
  },
  typeContent: {
    paddingBottom: Theme.spacing.xs,
  },
  typeItem: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  typeItemSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: `${Theme.colors.primary}15`,
  },
  typeText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
  },
  typeTextSelected: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  dateTimeField: {
    width: '48%',
  },
  dateTimePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    minHeight: Theme.controlSizes.inputHeight,
  },
  dateTimeText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
  },
  errorText: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.danger,
    marginTop: Theme.spacing.xs / 2,
    marginBottom: Theme.spacing.sm,
  },
  noteText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    fontStyle: 'italic',
    marginBottom: Theme.spacing.md,
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
  },
  loader: {
    marginTop: Theme.spacing.md,
  }
});

export default FileAComplaintScreen;