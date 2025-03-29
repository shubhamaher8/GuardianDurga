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
export const saveLocationSharing = async (userId, locationData) => {
  const insertObject = {
    user_id: userId,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    status: 'active',
    created_at: new Date().toISOString()
  };
  
  try {
    const { data: result, error } = await supabase
      .from('location_sharing')
      .insert([insertObject])
      .select('user_id, latitude, longitude, status, created_at');
    
    if (error) throw error;
    return result;
  } catch (err) {
    console.error('Error sharing location:', err);
    throw err;
  }
};

export const getActiveLocationSharing = async (userId) => {
  const { data, error } = await supabase
    .from('location_sharing')
    .select('latitude, longitude, created_at')
    .eq('user_id', userId)
    .eq('status', 'active');
  
  if (error) throw error;
  return data;
};

export const stopLocationSharing = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('location_sharing')
      .update({ status: 'stopped' })
      .eq('user_id', userId)
      .eq('status', 'active')
      .select('user_id, status');
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error stopping location sharing:', err);
    throw err;
  }
};

export const updateSharedLocation = async (userId, latitude, longitude) => {
  try {
    const { data, error } = await supabase
      .from('location_sharing')
      .update({ latitude, longitude })
      .eq('user_id', userId)
      .eq('status', 'active')
      .select('user_id, latitude, longitude');
    
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