import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase';
import { getUserComplaints } from '../utils/supabaseHelpers';
import Theme from '../theme/theme';
import { scale, wp } from '../utils/responsive';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';

const ComplaintsListScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user's complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData?.user) {
        const data = await getUserComplaints(userData.user.id);
        setComplaints(data || []);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Error', 'Failed to load complaints. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load complaints when screen is focused
  useEffect(() => {
    fetchComplaints();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchComplaints();
    });
    
    return unsubscribe;
  }, [navigation]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return { icon: 'time-outline', color: Theme.colors.warning };
      case 'in progress':
        return { icon: 'sync-outline', color: Theme.colors.info };
      case 'resolved':
        return { icon: 'checkmark-circle-outline', color: Theme.colors.success };
      case 'closed':
        return { icon: 'close-circle-outline', color: Theme.colors.textLight };
      default:
        return { icon: 'help-circle-outline', color: Theme.colors.textLight };
    }
  };

  // Render each complaint item
  const renderComplaintItem = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <Card style={styles.complaintCard}>
        <View style={styles.complaintHeader}>
          <View style={styles.complaintType}>
            <Text style={styles.complaintTypeText}>{item.type}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.complaintDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={Theme.colors.textLight} />
            <Text style={styles.detailText}>{formatDate(item.date)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={Theme.colors.textLight} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={Theme.colors.textLight} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>
        
        <Text 
          numberOfLines={2} 
          ellipsizeMode="tail" 
          style={styles.complaintContent}
        >
          {item.details}
        </Text>
        
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => navigation.navigate('ComplaintDetails', { complaintId: item.id })}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color={Theme.colors.primary} />
        </TouchableOpacity>
      </Card>
    );
  };

  // Empty state when no complaints
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="document-text-outline" 
        size={scale(64)} 
        color={Theme.colors.textLight} 
      />
      <Text style={styles.emptyText}>No complaints submitted yet</Text>
      <Text style={styles.emptySubtext}>
        Your filed complaints will appear here
      </Text>
      <Button
        title="File a Complaint"
        leftIcon="add-circle-outline"
        onPress={() => navigation.navigate('FileAComplaint')}
        style={styles.fileButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <View style={styles.content}>
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComplaintItem}
          ListEmptyComponent={EmptyListComponent}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchComplaints();
              }}
              colors={[Theme.colors.primary]}
            />
          }
        />
      </View>
      
      {complaints.length > 0 && (
        <View style={styles.buttonContainer}>
          <Button
            title="File New Complaint"
            leftIcon="add-circle-outline"
            onPress={() => navigation.navigate('FileAComplaint')}
          />
        </View>
      )}
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
  complaintCard: {
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  complaintType: {
    backgroundColor: `${Theme.colors.primary}15`,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs / 2,
    borderRadius: Theme.borderRadius.sm,
  },
  complaintTypeText: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSizes.sm,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: Theme.fontSizes.sm,
    fontWeight: '500',
    marginLeft: Theme.spacing.xs / 2,
  },
  complaintDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  detailText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.xs / 2,
  },
  complaintContent: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewDetailsText: {
    fontSize: Theme.fontSizes.sm,
    color: Theme.colors.primary,
    fontWeight: '500',
    marginRight: Theme.spacing.xs / 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSizes.lg,
    fontWeight: '500',
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
  },
  emptySubtext: {
    fontSize: Theme.fontSizes.md,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.xs,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  fileButton: {
    width: wp(60),
  },
  buttonContainer: {
    padding: Theme.spacing.lg,
    paddingTop: 0,
  },
});

export default ComplaintsListScreen; 