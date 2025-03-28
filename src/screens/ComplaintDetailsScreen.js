import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase';
import Theme from '../theme/theme';

const ComplaintDetailsScreen = ({ route, navigation }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch complaint details
  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .eq('id', complaintId)
          .single();
          
        if (error) throw error;
        
        setComplaint(data);
      } catch (error) {
        console.error('Error fetching complaint details:', error);
        Alert.alert('Error', 'Failed to load complaint details. Please try again.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaintDetails();
  }, [complaintId]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return { 
          icon: 'time-outline', 
          color: Theme.colors.warning,
          text: 'Submitted and waiting for review'
        };
      case 'in progress':
        return { 
          icon: 'sync-outline', 
          color: Theme.colors.info,
          text: 'Under investigation by authorities'
        };
      case 'resolved':
        return { 
          icon: 'checkmark-circle-outline', 
          color: Theme.colors.success,
          text: 'This complaint has been resolved'
        };
      case 'closed':
        return { 
          icon: 'close-circle-outline', 
          color: Theme.colors.textLight,
          text: 'This complaint has been closed'
        };
      default:
        return { 
          icon: 'help-circle-outline', 
          color: Theme.colors.textLight,
          text: 'Status unknown'
        };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Loading complaint details...</Text>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo(complaint?.status);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Complaint Type Header */}
        <View style={styles.typeHeader}>
          <Text style={styles.typeText}>{complaint?.type}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}15` }]}>
            <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {complaint?.status}
            </Text>
          </View>
        </View>
        
        {/* Status Description */}
        <View style={styles.statusDescriptionContainer}>
          <Text style={styles.statusDescription}>{statusInfo.text}</Text>
        </View>
        
        {/* Complaint Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Incident Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="calendar-outline" size={20} color={Theme.colors.primary} />
              <Text style={styles.detailLabel}>Date</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(complaint?.date)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="time-outline" size={20} color={Theme.colors.primary} />
              <Text style={styles.detailLabel}>Time</Text>
            </View>
            <Text style={styles.detailValue}>{complaint?.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="location-outline" size={20} color={Theme.colors.primary} />
              <Text style={styles.detailLabel}>Location</Text>
            </View>
            <Text style={styles.detailValue}>{complaint?.location}</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsLabel}>Description</Text>
            <Text style={styles.detailsText}>{complaint?.details}</Text>
          </View>
        </View>
        
        {/* Complaint Tracking */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Complaint Tracking</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="create-outline" size={20} color={Theme.colors.primary} />
              <Text style={styles.detailLabel}>Submitted</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(complaint?.created_at)}</Text>
          </View>
          
          {complaint?.updated_at && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Ionicons name="refresh-outline" size={20} color={Theme.colors.primary} />
                <Text style={styles.detailLabel}>Last Updated</Text>
              </View>
              <Text style={styles.detailValue}>{formatDate(complaint?.updated_at)}</Text>
            </View>
          )}
          
          {complaint?.resolved_at && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Ionicons name="checkmark-done-outline" size={20} color={Theme.colors.primary} />
                <Text style={styles.detailLabel}>Resolved</Text>
              </View>
              <Text style={styles.detailValue}>{formatDate(complaint?.resolved_at)}</Text>
            </View>
          )}
          
          {complaint?.resolution_notes && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Resolution Notes</Text>
              <Text style={styles.detailsText}>{complaint?.resolution_notes}</Text>
            </View>
          )}
        </View>
        
        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Ionicons name="information-circle-outline" size={20} color={Theme.colors.textLight} />
          <Text style={styles.helpText}>
            For updates on your complaint, please check back regularly or contact the authorities directly.
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  loadingText: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  typeText: {
    fontSize: Theme.fontSizes.xl,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
  },
  statusText: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: '500',
    marginLeft: Theme.spacing.xs,
    textTransform: 'capitalize',
  },
  statusDescriptionContainer: {
    marginBottom: Theme.spacing.lg,
  },
  statusDescription: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
  },
  detailsCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.sm,
  },
  detailValue: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  detailsContainer: {
    marginTop: Theme.spacing.md,
  },
  detailsLabel: {
    fontSize: Theme.fontSizes.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  detailsText: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    lineHeight: 24,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Theme.spacing.md,
    backgroundColor: `${Theme.colors.info}10`,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.lg,
  },
  helpText: {
    flex: 1,
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.textLight,
    marginLeft: Theme.spacing.sm,
    lineHeight: 20,
  },
});

export default ComplaintDetailsScreen; 