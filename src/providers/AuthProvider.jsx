import React, { createContext, useContext, useState, useEffect } from "react";
import { useSupabase } from "./SupabaseProvider";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { supabase, loading } = useSupabase(); // Use supabase from context
  const [loginData, setLoginData] = useState(null);

  const handleLogin = async (email, password) => {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return;
    }

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error logging in:', error.message);
      return;
    }

    setLoginData({ user });
  };

  const handleLogout = async () => {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      return;
    }

    setLoginData(null);
  };

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) {
        console.error("Supabase client is not initialized");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      setLoginData({ user });
    };

    getUser();
  }, [supabase]);

  // Prevent rendering if supabase is loading
  if (loading) return <p>Loading...</p>;

  return (
    <AuthContext.Provider value={{ loginData, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
