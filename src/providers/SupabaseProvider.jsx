import { createClient } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// Fetches URL and API key for Supabase from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Creates a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Creates a context for Supabase
const SupabaseContext = createContext();

// Defines component
export const SupabaseProvider = ({ children }) => {
  // Provides the supabase client to the context
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Custom hook to use the Supabase context in other components
export const useSupabase = () => useContext(SupabaseContext);

// Export supabase for direct usage
export { supabase };
