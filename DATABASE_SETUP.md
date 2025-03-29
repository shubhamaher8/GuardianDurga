# Guardian Durga - Supabase Database Setup

This document outlines the database structure for the Guardian Durga application and provides instructions for setting up the database in Supabase.

## Database Structure

The Guardian Durga application uses the following tables in Supabase:

### 1. profiles

Stores user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, matches auth.users.id |
| username | TEXT | User's username |
| email | TEXT | User's email address |
| created_at | TIMESTAMP WITH TIME ZONE | When the profile was created |
| updated_at | TIMESTAMP WITH TIME ZONE | When the profile was last updated |
| full_name | TEXT | User's full name |
| phone_number | TEXT | User's phone number |
| address | TEXT | User's address |
| profile_image_url | TEXT | URL to user's profile image |

### 2. emergency_contacts

Stores emergency contacts for each user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to the user who owns this contact |
| name | TEXT | Contact's name |
| phone | TEXT | Contact's phone number |
| relationship | TEXT | Relationship to the user (e.g., "Family", "Friend") |
| is_primary | BOOLEAN | Whether this is the primary emergency contact |
| created_at | TIMESTAMP WITH TIME ZONE | When the contact was added |
| updated_at | TIMESTAMP WITH TIME ZONE | When the contact was last updated |

### 3. complaints

Stores user-submitted complaints/reports.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to the user who filed the complaint |
| type | TEXT | Type of complaint (e.g., "Harassment", "Theft") |
| date | DATE | Date when the incident occurred |
| time | TIME | Time when the incident occurred |
| location | TEXT | Location of the incident |
| details | TEXT | Detailed description of the incident |
| status | TEXT | Status of the complaint (e.g., "submitted", "in progress", "resolved") |
| created_at | TIMESTAMP WITH TIME ZONE | When the complaint was submitted |
| updated_at | TIMESTAMP WITH TIME ZONE | When the complaint was last updated |
| resolution_notes | TEXT | Notes on the resolution of the complaint |
| resolved_by | UUID | Reference to the user/admin who resolved the complaint |
| resolved_at | TIMESTAMP WITH TIME ZONE | When the complaint was resolved |

### 4. sos_alerts

Stores SOS alerts sent by users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to the user who sent the alert |
| location | TEXT | Text description of the location |
| latitude | FLOAT | Geographic latitude |
| longitude | FLOAT | Geographic longitude |
| status | TEXT | Status of the alert (e.g., "active", "resolved") |
| created_at | TIMESTAMP WITH TIME ZONE | When the alert was created |
| resolved_at | TIMESTAMP WITH TIME ZONE | When the alert was resolved |
| contacts_notified | TEXT[] | Array of contacts who were notified |

## Setup Instructions

To set up the database in Supabase:

1. Sign in to your Supabase dashboard at https://app.supabase.com/
2. Select your project or create a new one
3. Go to the SQL Editor tab
4. Copy the contents of the `database_setup.sql` file
5. Paste the SQL into the SQL Editor and run the script

## Using the Database in the App

The database is already integrated with the app using the Supabase JavaScript client. The connection is set up in the `supabase.js` file at the root of the project:

```javascript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://giwzuevzbtefjjkzxasa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
```

To use this setup in the application, make sure that:

1. The Supabase URL and Anon Key in `supabase.js` are correct for your Supabase project
2. The tables have been created in your Supabase database
3. The app has the required dependencies installed (`@supabase/supabase-js` and `@react-native-async-storage/async-storage`)

## Helper Functions

The database interactions are abstracted in the `src/utils/supabaseHelpers.js` file, which provides functions for common operations like:

- Getting and updating user profiles
- Managing emergency contacts
- Creating and retrieving complaints
- Handling SOS alerts

These helper functions are used throughout the app to simplify database operations and ensure consistent error handling.

## Authentication

The app uses Supabase Authentication for user registration and login. This is integrated with the custom profiles table to store additional user information beyond what the auth system provides. 