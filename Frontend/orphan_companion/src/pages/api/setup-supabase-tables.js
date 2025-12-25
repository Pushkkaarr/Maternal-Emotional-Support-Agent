import { supabase } from '../../lib/supabase';

// This API endpoint sets up the required tables in Supabase
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if we have admin rights
    const { data: isAdmin } = await supabase.rpc('is_admin_user');
    
    if (!isAdmin) {
      return res.status(403).json({ 
        error: 'Unauthorized. Only admin users can set up tables.',
        note: 'You can still manually run the SQL from the Supabase dashboard.'
      });
    }

    // Create items table
    const { error: itemsTableError } = await supabase.rpc('create_items_table');
    
    if (itemsTableError) {
      console.error('Error creating items table:', itemsTableError);
      
      // Try direct SQL approach if RPC fails
      const { error: sqlError } = await supabase.from('_exec_sql').select('*').eq('query', `
        CREATE TABLE IF NOT EXISTS items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          name TEXT NOT NULL,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          completed BOOLEAN DEFAULT false
        );

        -- Enable RLS
        ALTER TABLE items ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own items" 
          ON items FOR SELECT 
          USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own items" 
          ON items FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own items" 
          ON items FOR UPDATE 
          USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own items" 
          ON items FOR DELETE 
          USING (auth.uid() = user_id);
      `);
      
      if (sqlError) {
        console.error('Error with direct SQL execution:', sqlError);
        return res.status(500).json({ 
          error: 'Failed to create tables',
          details: sqlError.message,
          solution: 'Please run the SQL from supabase-schema.sql in the Supabase SQL editor.'
        });
      }
    }
    
    // Success!
    return res.status(200).json({ success: true, message: 'Tables created successfully' });
    
  } catch (error) {
    console.error('Error in setup-supabase-tables:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred', 
      details: error.message,
      solution: 'Please run the SQL from supabase-schema.sql in the Supabase SQL editor.'
    });
  }
} 