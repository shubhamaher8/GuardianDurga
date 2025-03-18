import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://giwzuevzbtefjjkzxasa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd3p1ZXZ6YnRlZmpqa3p4YXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDQ4OTEsImV4cCI6MjA1Nzg4MDg5MX0.XXfh_nFTpHvT02P2XM9xGphfh1RpQV6H6B8CAVUZ6H0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});