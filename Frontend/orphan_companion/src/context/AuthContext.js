import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authSignup, authLogin, authLogout, fetchSession } from '@/utils/apiService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetchSession();
      setUser(res.user ?? null);
      setLoading(false);
    };
    load();
  }, []);

  const signUp = async ({ email, password }) => {
    try {
      const res = await authSignup(email, password);
      toast.success('Check your email for the confirmation link!');
      return { success: true, data: res };
    } catch (error) {
      toast.error(error.message || 'Signup failed');
      return { success: false, error: error.message };
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const res = await authLogin(email, password);
      // After login backend sets HttpOnly cookie; refresh session
      const session = await fetchSession();
      setUser(session.user ?? null);
      toast.success('Signed in successfully!');
      return { success: true, data: res };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await authLogout();
      setUser(null);
      toast.success('Signed out successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Logout failed');
      return { success: false, error: error.message };
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};