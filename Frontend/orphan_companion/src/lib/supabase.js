import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helpers
export const auth = {
  // Sign up with email and password
  signUp: async ({ email, password }) => {
    return supabase.auth.signUp({ email, password });
  },

  // Sign in with email and password
  signIn: async ({ email, password }) => {
    return supabase.auth.signInWithPassword({ email, password });
  },

  // Sign out
  signOut: async () => {
    return supabase.auth.signOut();
  },

  // Get the current session
  getSession: async () => {
    return supabase.auth.getSession();
  },

  // Get the current user
  getUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user;
  },

  // Reset password
  resetPassword: async (email) => {
    return supabase.auth.resetPasswordForEmail(email);
  },

  // Update password
  updatePassword: async (newPassword) => {
    return supabase.auth.updateUser({ password: newPassword });
  }
};

// Database helpers for common operations
export const db = {
  // Get all records from a table with optional filters
  getAll: async (table, options = {}) => {
    let query = supabase.from(table).select(options.select || '*');

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (options.order) {
      const { column, ascending = true } = options.order;
      query = query.order(column, { ascending });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    return query;
  },

  // Get a single record by ID
  getById: async (table, id, options = {}) => {
    return supabase
      .from(table)
      .select(options.select || '*')
      .eq('id', id)
      .single();
  },

  // Create a new record
  create: async (table, data) => {
    return supabase.from(table).insert([data]);
  },

  // Update a record
  update: async (table, id, data) => {
    return supabase.from(table).update(data).eq('id', id);
  },

  // Delete a record
  delete: async (table, id) => {
    return supabase.from(table).delete().eq('id', id);
  }
};

// Storage helpers
export const storage = {
  // Upload a file
  upload: async (bucket, path, file) => {
    return supabase.storage.from(bucket).upload(path, file);
  },

  // Download a file
  download: async (bucket, path) => {
    return supabase.storage.from(bucket).download(path);
  },

  // Get public URL for a file
  getPublicUrl: (bucket, path) => {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },

  // Delete a file
  delete: async (bucket, paths) => {
    return supabase.storage.from(bucket).remove(Array.isArray(paths) ? paths : [paths]);
  }
}; 