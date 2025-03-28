import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Alert, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase';
import Theme from '../theme/theme';
import Input from '../components/Input';
import Button from '../components/Button';

const AddEmergencyContactScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Error states
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setPhoneError('');
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }
    
    // Validate phone number (basic validation)
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(phone)) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSaveContact = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData?.user) {
        // Check if this is set as primary contact and there's an existing primary
        if (isPrimary) {
          // If setting as primary, update any existing primary to non-primary
          const { error: updateError } = await supabase
            .from('emergency_contacts')
            .update({ is_primary: false })
            .eq('user_id', userData.user.id)
            .eq('is_primary', true);
            
          if (updateError) throw updateError;
        }
        
        // Insert the new contact
        const { error: insertError } = await supabase
          .from('emergency_contacts')
          .insert([
            {
              user_id: userData.user.id,
              name: name,
              phone: phone,
              relationship: relationship,
              is_primary: isPrimary,
              created_at: new Date()
            }
          ]);
          
        if (insertError) throw insertError;
        
        Alert.alert('Success', 'Contact added successfully');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'Failed to save contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Common relationships for quick selection
  const relationships = ['Family', 'Friend', 'Partner', 'Colleague', 'Neighbor'];
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add Emergency Contact</Text>
        <Text style={styles.description}>
          Add someone you trust who can be contacted in case of an emergency.
        </Text>
        
        <Input
          label="Contact Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError('');
          }}
          placeholder="Enter full name"
          icon="person-outline"
          error={nameError}
        />
        
        <Input
          label="Phone Number"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setPhoneError('');
          }}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          icon="call-outline"
          error={phoneError}
        />
        
        <Text style={styles.sectionTitle}>Relationship</Text>
        <View style={styles.relationshipContainer}>
          {relationships.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.relationshipItem,
                relationship === item && styles.relationshipItemActive
              ]}
              onPress={() => setRelationship(item)}
            >
              <Text
                style={[
                  styles.relationshipText,
                  relationship === item && styles.relationshipTextActive
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Input
          label="Other Relationship (Optional)"
          value={relationship}
          onChangeText={setRelationship}
          placeholder="Specify relationship"
          icon="people-outline"
          style={styles.otherRelationship}
        />
        
        <View style={styles.primaryContainer}>
          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryTitle}>Set as Primary Contact</Text>
            <Text style={styles.primaryDescription}>
              Primary contacts will be notified first in case of emergency
            </Text>
          </View>
          <Switch
            value={isPrimary}
            onValueChange={setIsPrimary}
            trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
            thumbColor={Theme.colors.surface}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />
          
          <Button
            title="Save Contact"
            onPress={handleSaveContact}
            loading={loading}
            style={styles.saveButton}
          />
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
  title: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  description: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '500',
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  relationshipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.md,
  },
  relationshipItem: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    margin: Theme.spacing.xs,
  },
  relationshipItemActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: `${Theme.colors.primary}15`,
  },
  relationshipText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
  },
  relationshipTextActive: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  otherRelationship: {
    marginTop: Theme.spacing.xs,
  },
  primaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginTop: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  primaryTextContainer: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  primaryTitle: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  primaryDescription: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
});

export default AddEmergencyContactScreen; 