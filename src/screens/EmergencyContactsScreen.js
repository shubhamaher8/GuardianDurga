import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase';
import { getEmergencyContacts, setPrimaryContact, deleteEmergencyContact } from '../utils/supabaseHelpers';
import Theme from '../theme/theme';
import { scale, wp, moderateScale, screenDimensions } from '../utils/responsive';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';

const EmergencyContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user's emergency contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData?.user) {
        const data = await getEmergencyContacts(userData.user.id);
        setContacts(data || []);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'Failed to load emergency contacts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Set/remove primary contact
  const togglePrimaryContact = async (contactId, isPrimary) => {
    try {
      setLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      
      if (isPrimary) {
        // Set as primary
        await setPrimaryContact(userData.user.id, contactId);
      } else {
        // Update the selected contact to not be primary
        await supabase
          .from('emergency_contacts')
          .update({ is_primary: false, updated_at: new Date() })
          .eq('id', contactId);
      }
      
      // Refresh the contacts list
      fetchContacts();
      
    } catch (error) {
      console.error('Error updating contact:', error);
      Alert.alert('Error', 'Failed to update contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              await deleteEmergencyContact(contactId);
              
              // Refresh the contacts list
              fetchContacts();
              
            } catch (error) {
              console.error('Error deleting contact:', error);
              Alert.alert('Error', 'Failed to delete contact. Please try again.');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Load contacts on mount and when navigating back to this screen
  useEffect(() => {
    fetchContacts();
    
    // Set up navigation focus listener
    const unsubscribe = navigation.addListener('focus', () => {
      fetchContacts();
    });
    
    return unsubscribe;
  }, [navigation]);

  // Render each contact item
  const renderContactItem = ({ item }) => (
    <Card
      style={styles.contactCard}
      elevation="sm"
      padding={false}
    >
      <View style={styles.contactCardContent}>
        <View style={styles.contactInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.contactName}>{item.name}</Text>
            {item.is_primary && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryText}>Primary</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.contactPhone}>{item.phone}</Text>
          {item.relationship && (
            <Text style={styles.contactRelationship}>{item.relationship}</Text>
          )}
        </View>
        
        <View style={styles.contactActions}>
          {!item.is_primary && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => togglePrimaryContact(item.id, true)}
            >
              <Ionicons name="star-outline" size={Theme.controlSizes.iconSize.small} color={Theme.colors.primary} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => deleteContact(item.id)}
          >
            <Ionicons name="trash-outline" size={Theme.controlSizes.iconSize.small} color={Theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  // Empty state when no contacts
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="people-outline" 
        size={scale(64)} 
        color={Theme.colors.textLight} 
      />
      <Text style={styles.emptyText}>No emergency contacts added yet</Text>
      <Text style={styles.emptySubtext}>
        Add contacts who can be reached in case of an emergency
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      
      <View style={styles.content}>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderContactItem}
          ListEmptyComponent={EmptyListComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchContacts();
          }}
        />
      </View>
      
      <View style={styles.addButtonContainer}>
        <Button
          title="Add Emergency Contact"
          leftIcon="add-circle-outline"
          onPress={() => navigation.navigate('AddEmergencyContact')}
          style={styles.addButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: Theme.spacing.xxl,
  },
  contactCard: {
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  contactCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  contactName: {
    fontSize: Theme.fontSizes.md,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginRight: Theme.spacing.sm,
  },
  primaryBadge: {
    backgroundColor: `${Theme.colors.primary}20`,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs / 2,
    borderRadius: Theme.borderRadius.md,
  },
  primaryText: {
    fontSize: Theme.fontSizes.xs,
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  contactRelationship: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Theme.spacing.sm,
    marginLeft: Theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  emptyText: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: '600',
    color: Theme.colors.text,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    textAlign: 'center',
  },
  addButtonContainer: {
    padding: Theme.spacing.lg,
    paddingTop: 0,
  },
  addButton: {
    backgroundColor: Theme.colors.primary,
  }
});

export default EmergencyContactsScreen;