import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Alert, ScrollView, Switch, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase';
import { addEmergencyContact, setPrimaryContact } from '../utils/supabaseHelpers';
import Theme from '../theme/theme';
import Input from '../components/Input';
import Button from '../components/Button';
import { scale, wp, hp, moderateScale, screenDimensions, listenOrientationChange } from '../utils/responsive';

const AddEmergencyContactScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState(screenDimensions.isPortrait() ? 'portrait' : 'landscape');
  
  // Error states
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Listen for orientation changes
  useEffect(() => {
    const subscription = listenOrientationChange(({ window }) => {
      setOrientation(window.height > window.width ? 'portrait' : 'landscape');
    });
    
    return () => subscription.remove();
  }, []);
  
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
        // Insert the new contact
        await addEmergencyContact({
          user_id: userData.user.id,
          name: name,
          phone: phone,
          relationship: relationship,
          is_primary: false // Initially set to false
        });
        
        // If this contact should be primary, update it after creation
        if (isPrimary) {
          // Get the latest contacts to find the one we just created
          const { data: latestContacts, error: fetchError } = await supabase
            .from('emergency_contacts')
            .select('id')
            .eq('user_id', userData.user.id)
            .eq('name', name)
            .eq('phone', phone)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (fetchError) throw fetchError;
          
          if (latestContacts && latestContacts.length > 0) {
            await setPrimaryContact(userData.user.id, latestContacts[0].id);
          }
        }
        
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
  
  // Calculate content width based on orientation
  const getContentWidth = () => {
    if (screenDimensions.isTablet) {
      return orientation === 'landscape' ? wp(70) : wp(80);
    }
    return wp(90);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <ScrollView contentContainerStyle={[
        styles.scrollContent,
        { alignItems: orientation === 'landscape' ? 'center' : 'stretch' }
      ]}>
        <View style={[styles.contentContainer, { width: getContentWidth() }]}>
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
          <View style={[
            styles.relationshipContainer,
            orientation === 'landscape' && { justifyContent: 'flex-start' }
          ]}>
            {relationships.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.relationshipItem,
                  relationship === item && styles.relationshipItemActive,
                  { marginRight: orientation === 'landscape' ? Theme.spacing.md : Theme.spacing.xs }
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
          
          <View style={[
            styles.buttonContainer,
            orientation === 'landscape' && { justifyContent: 'center' }
          ]}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={[
                styles.cancelButton,
                orientation === 'landscape' && { width: wp(30), marginRight: wp(5) }
              ]}
            />
            
            <Button
              title="Save Contact"
              onPress={handleSaveContact}
              loading={loading}
              style={[
                styles.saveButton,
                orientation === 'landscape' && { width: wp(30), marginLeft: wp(5) }
              ]}
            />
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
  contentContainer: {
    alignSelf: 'center',
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