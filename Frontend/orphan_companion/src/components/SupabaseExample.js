import { useState, useEffect } from 'react';
import { supabase, auth, db } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { toast } from 'sonner';

export default function SupabaseExample() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    // Check for active session on component mount
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchItems();
        }
      }
    );

    // Initial session check
    checkUser();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const { data: { session } } = await auth.getSession();
    setUser(session?.user || null);
    if (session?.user) {
      fetchItems();
    }
  }

  async function handleSignIn(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { error } = await auth.signIn({
        email,
        password
      });

      if (error) throw error;
      toast.success('Signed in successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { error } = await auth.signUp({
        email,
        password
      });

      if (error) throw error;
      toast.success('Sign-up email sent!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      setLoading(true);
      const { error } = await auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchItems() {
    try {
      const { data, error } = await db.getAll('items', {
        order: { column: 'created_at', ascending: false }
      });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast.error('Error fetching items: ' + error.message);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    
    if (!newItem.trim()) return;
    
    try {
      const { error } = await db.create('items', {
        name: newItem,
        user_id: user.id
      });

      if (error) throw error;
      setNewItem('');
      fetchItems();
      toast.success('Item added successfully!');
    } catch (error) {
      toast.error('Error adding item: ' + error.message);
    }
  }

  async function deleteItem(id) {
    try {
      const { error } = await db.delete('items', id);

      if (error) throw error;
      fetchItems();
      toast.success('Item deleted successfully!');
    } catch (error) {
      toast.error('Error deleting item: ' + error.message);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Example</CardTitle>
          <CardDescription>
            {user ? 'Manage your items' : 'Sign in or create an account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Logged in as: {user.email}
              </p>
              
              <form onSubmit={addItem} className="flex space-x-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add new item..."
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>Add</Button>
              </form>
              
              {items.length > 0 ? (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{item.name}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No items yet. Add your first one above.
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!user ? (
            <>
              <Button onClick={handleSignUp} variant="outline" disabled={loading}>
                Sign Up
              </Button>
              <Button onClick={handleSignIn} disabled={loading}>
                Sign In
              </Button>
            </>
          ) : (
            <Button onClick={handleSignOut} variant="destructive" disabled={loading}>
              Sign Out
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 