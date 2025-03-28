import { supabase } from '../../supabase';

// User Profile Functions
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', userId);
  
  if (error) throw error;
  return data;
};

// Emergency Contact Functions
export const getEmergencyContacts = async (userId) => {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('is_primary', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addEmergencyContact = async (contactData) => {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .insert([{ ...contactData, created_at: new Date() }]);
  
  if (error) throw error;
  return data;
};

export const updateEmergencyContact = async (contactId, updates) => {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', contactId);
  
  if (error) throw error;
  return data;
};

export const deleteEmergencyContact = async (contactId) => {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .delete()
    .eq('id', contactId);
  
  if (error) throw error;
  return data;
};

export const setPrimaryContact = async (userId, contactId) => {
  // First, remove primary status from any existing primary contact
  const { error: updateOtherError } = await supabase
    .from('emergency_contacts')
    .update({ is_primary: false, updated_at: new Date() })
    .eq('user_id', userId)
    .eq('is_primary', true);
  
  if (updateOtherError) throw updateOtherError;
  
  // Then set the new primary contact
  const { data, error } = await supabase
    .from('emergency_contacts')
    .update({ is_primary: true, updated_at: new Date() })
    .eq('id', contactId);
  
  if (error) throw error;
  return data;
};

// Complaint Functions
export const getUserComplaints = async (userId) => {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addComplaint = async (complaintData) => {
  const { data, error } = await supabase
    .from('complaints')
    .insert([{ ...complaintData, created_at: new Date() }]);
  
  if (error) throw error;
  return data;
};

export const updateComplaintStatus = async (complaintId, status, notes = null) => {
  const updates = { 
    status, 
    updated_at: new Date(),
    resolution_notes: notes
  };
  
  if (status === 'resolved') {
    updates.resolved_at = new Date();
  }
  
  const { data, error } = await supabase
    .from('complaints')
    .update(updates)
    .eq('id', complaintId);
  
  if (error) throw error;
  return data;
};

// SOS Alert Functions
export const createSOSAlert = async (userId, locationData) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .insert([{ 
      user_id: userId,
      location: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      status: 'active',
      created_at: new Date()
    }]);
  
  if (error) throw error;
  return data;
};

export const updateSOSAlertStatus = async (alertId, status) => {
  const updates = { 
    status, 
    updated_at: new Date() 
  };
  
  if (status === 'resolved') {
    updates.resolved_at = new Date();
  }
  
  const { data, error } = await supabase
    .from('sos_alerts')
    .update(updates)
    .eq('id', alertId);
  
  if (error) throw error;
  return data;
};

export const getActiveSOSAlerts = async (userId) => {
  const { data, error } = await supabase
    .from('sos_alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active');
  
  if (error) throw error;
  return data;
};

// Location Sharing Functions
export const saveLocationSharing = async (userId, data) => {
  // Prevent stack depth issues by using primitive data types instead of complex objects
  // Use string-based approach for contact information
  const contactIdsString = data.contacts.map(contact => contact.id).join(',');
  const contactNamesString = data.contacts.map(contact => contact.name).join(',');
  
  // Get current time once to ensure consistency
  const now = new Date();
  const nowIso = now.toISOString();
  const endTimeIso = calculateEndTime(data.duration).toISOString();
  
  // Create a simplified insert object with all required fields
  const insertObject = { 
    user_id: userId,
    contacts: null, // Set to null to avoid complex JSON storage
    contact_ids_string: contactIdsString,
    contact_names_string: contactNamesString,
    contact_count: data.contacts.length, // Add count for simpler queries
    duration: data.duration,
    start_time: nowIso, // Ensure start_time is always set
    end_time: endTimeIso,
    status: 'active',
    latitude: data.latitude,
    longitude: data.longitude,
    created_at: nowIso,
    updated_at: nowIso
  };
  
  try {
    // Use a simpler query to avoid stack depth issues
    const { data: result, error } = await supabase
      .from('location_sharing')
      .insert([insertObject])
      .select('id, status');
    
    if (error) throw error;
    return result;
  } catch (err) {
    console.error('Supabase insert error:', err);
    // If we still get errors, try an even more simplified approach
    if (err.code === '54001' || err.code === '23502') {
      // Ultra-simplified version with only essential fields
      const nowRetry = new Date().toISOString(); // Get fresh timestamp
      const { data: fallbackResult, error: fallbackError } = await supabase
        .from('location_sharing')
        .insert([{ 
          user_id: userId,
          contacts: null,
          contact_count: data.contacts.length,
          duration: data.duration,
          start_time: nowRetry, // Explicitly set start_time to fix 23502 error
          end_time: calculateEndTime(data.duration).toISOString(),
          status: 'active',
          latitude: data.latitude,
          longitude: data.longitude,
          created_at: nowRetry,
          updated_at: nowRetry
        }])
        .select('id');
      
      if (fallbackError) throw fallbackError;
      return fallbackResult;
    }
    throw err;
  }
};

export const getActiveLocationSharing = async (userId) => {
  const { data, error } = await supabase
    .from('location_sharing')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active');
  
  if (error) throw error;
  return data;
};

export const stopLocationSharing = async (sharingId) => {
  try {
    const { data, error } = await supabase
      .from('location_sharing')
      .update({ 
        status: 'stopped', 
        updated_at: new Date().toISOString(),
        end_time: new Date().toISOString()
      })
      .eq('id', sharingId)
      .select('id');
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error stopping location sharing:', err);
    throw err;
  }
};

export const updateSharedLocation = async (sharingId, latitude, longitude) => {
  try {
    const { data, error } = await supabase
      .from('location_sharing')
      .update({ 
        latitude, 
        longitude, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', sharingId)
      .select('id');
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating shared location:', err);
    throw err;
  }
};

// Contact Management Functions
export const getSavedContacts = async (userId) => {
  const { data, error } = await supabase
    .from('saved_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const saveContact = async (userId, contactData) => {
  const { data, error } = await supabase
    .from('saved_contacts')
    .insert([{ 
      user_id: userId,
      name: contactData.name,
      phone: contactData.phone,
      created_at: new Date()
    }])
    .select(); // Add select() to return the inserted data with ID
  
  if (error) throw error;
  return data;
};

export const deleteContact = async (contactId) => {
  const { data, error } = await supabase
    .from('saved_contacts')
    .delete()
    .eq('id', contactId);
  
  if (error) throw error;
  return data;
};

// Utility function to calculate end time based on duration
const calculateEndTime = (duration) => {
  const now = new Date();
  
  // Parse the duration string to get the value and unit
  const [value, unit] = duration.split(' ');
  const numericValue = parseInt(value);
  
  if (unit.includes('minute')) {
    return new Date(now.getTime() + numericValue * 60 * 1000);
  } else if (unit.includes('hour')) {
    return new Date(now.getTime() + numericValue * 60 * 60 * 1000);
  } else {
    // Default to 1 hour if parsing fails
    return new Date(now.getTime() + 60 * 60 * 1000);
  }
};