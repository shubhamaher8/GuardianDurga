import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, 
  ScrollView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const FileAComplaintScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [complaintType, setComplaintType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [complaintTypes, setComplaintTypes] = useState([
    { label: 'Harassment', value: 'harassment' },
    { label: 'Theft', value: 'theft' },
    { label: 'Abuse', value: 'abuse' },
    { label: 'Cyber Crime', value: 'cyber_crime' },
    { label: 'Other', value: 'other' }
  ]);

  const handleSubmit = () => {
    if (!userName || !complaintType || !location || !details) {
      Alert.alert('Incomplete Form', 'Please fill all required fields before submitting.');
      return;
    }

    Alert.alert('Success', 'Your complaint has been submitted successfully.');
    setUserName('');
    setComplaintType(null);
    setDate(new Date());
    setTime(new Date());
    setLocation('');
    setDetails('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FILE A COMPLAINT</Text>
      <View style={styles.formContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* User Name Field */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>*Your Name</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your name"
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          {/* Complaint Type Dropdown */}
          <View style={[styles.inputRow, { zIndex: 10 }]}>
            <Text style={styles.label}>*Complaint Type</Text>
            <DropDownPicker
              open={openDropdown}
              value={complaintType}
              items={complaintTypes}
              setOpen={setOpenDropdown}
              setValue={setComplaintType}
              setItems={setComplaintTypes}
              placeholder="Select Complaint Type"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          {/* Date Picker */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>*Date</Text>
            <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>

          {/* Time Picker */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>*Time</Text>
            <TouchableOpacity style={styles.datePicker} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateText}>
                {time.getHours()}:{time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setTime(selectedTime);
                }}
              />
            )}
          </View>

          {/* Location */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>*Location</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter location of incident"
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

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  inputRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderColor: '#999',
    borderRadius: 5,
    zIndex: 10,
  },
  dropdownContainer: {
    backgroundColor: '#EFEFEF',
    zIndex: 10,
  },
  datePicker: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default FileAComplaintScreen;