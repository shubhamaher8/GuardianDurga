import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const FileAComplaintScreen = ({ navigation }) => {
  // State variables for form fields
  const [complaintType, setComplaintType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  // Handle complaint submission
  const handleSubmit = () => {
    if (!complaintType || !date || !time || !location || !details) {
      Alert.alert('Incomplete Form', 'Please fill all fields before submitting.');
      return;
    }

    // Simulate complaint submission (replace with backend/API call later)
    console.log('Complaint Submitted:', {
      complaintType,
      date,
      time,
      location,
      details,
    });
    Alert.alert('Success', 'Your complaint has been submitted successfully.');
    // Clear form fields after submission
    setComplaintType('');
    setDate('');
    setTime('');
    setLocation('');
    setDetails('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>FILE A COMPLAINT</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Complaint Type */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>*Complaint Type</Text>
          <TextInput
            style={styles.inputField}
            placeholder="choose type"
            value={complaintType}
            onChangeText={setComplaintType}
          />
        </View>

        {/* Date */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>*Date</Text>
          <TextInput
            style={styles.inputField}
            placeholder="DD/MM/YYYY"
            value={date}
            onChangeText={setDate}
          />
        </View>

        {/* Time */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>*Time</Text>
          <TextInput
            style={styles.inputField}
            placeholder="00:00 pm"
            value={time}
            onChangeText={setTime}
          />
        </View>

        {/* Location */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>*Location</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter Location..."
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Details */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.inputField, styles.multilineInput]}
            placeholder="Enter details here..."
            multiline
            numberOfLines={4}
            value={details}
            onChangeText={setDetails}
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* AI Durga Button */}
      <TouchableOpacity style={styles.aiDurgaButton} onPress={() => navigation.navigate('Chatbot')}>
        <Text style={styles.aiDurgaText}>AI DURGA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  inputRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  aiDurgaButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 50,
  },
  aiDurgaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default FileAComplaintScreen;