# Supabase Integration Guide

This project uses [Supabase](https://supabase.io/) for authentication, database, and storage functionalities.

## Setup

1. **Create a Supabase Project**:
   - Go to [Supabase](https://app.supabase.io/) and create a new project
   - Take note of your project URL and anon key

2. **Environment Variables**:
   - Make sure your `.env.local` file (for local development) has the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Schema**:
   - Use the SQL in `supabase-schema.sql` to set up the necessary tables and policies
   - Run these SQL commands in the Supabase SQL editor

## Usage

### Authentication

The project provides a standardized API for authentication in `lib/supabase.js`:

```javascript
import { auth } from '../lib/supabase';

// Sign up
const { data, error } = await auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await auth.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
await auth.signOut();

// Get the current user
const user = await auth.getUser();
```

### Database Operations

The project provides a standardized API for database operations:

```javascript
import { db } from '../lib/supabase';

// Get all items
const { data, error } = await db.getAll('items', {
  order: { column: 'created_at', ascending: false },
  filters: { user_id: user.id },
  limit: 10
});

// Get a single item
const { data, error } = await db.getById('items', itemId);

// Create an item
const { data, error } = await db.create('items', {
  name: 'New Item',
  user_id: user.id
});

// Update an item
const { data, error } = await db.update('items', itemId, {
  name: 'Updated Item',
  completed: true
});

// Delete an item
const { data, error } = await db.delete('items', itemId);
```

### Storage Operations

The project provides a standardized API for storage operations:

```javascript
import { storage } from '../lib/supabase';

// Upload a file
const { data, error } = await storage.upload(
  'bucket-name',
  'path/to/file.jpg',
  file
);

// Download a file
const { data, error } = await storage.download(
  'bucket-name',
  'path/to/file.jpg'
);

// Get a public URL
const { publicURL } = storage.getPublicUrl(
  'bucket-name',
  'path/to/file.jpg'
);

// Delete files
const { data, error } = await storage.delete(
  'bucket-name',
  ['path/to/file1.jpg', 'path/to/file2.jpg']
);
```

## Example Implementation

Check out the `SupabaseExample.js` component in the components directory and the `/supabase-demo` page for a working example of Supabase integration with authentication and CRUD operations.

## Security Considerations

1. **Row Level Security (RLS)**:
   - All database tables should have RLS enabled
   - Create appropriate policies for each table to restrict access

2. **Environment Variables**:
   - Never expose the `service_role` key in client-side code
   - Only use the `anon` key for client-side code

3. **Data Validation**:
   - Always validate data on the server side
   - Don't trust client-side validation

## Troubleshooting

1. **Authentication Issues**:
   - Check that your email confirmation settings are properly configured in Supabase dashboard
   - For password resets, ensure the URL configuration is correct

2. **Database Issues**:
   - Verify that Row Level Security (RLS) policies are properly set up
   - Check for database schema errors

3. **CORS Issues**:
   - Ensure your Supabase project's API settings have the correct CORS origins set up 