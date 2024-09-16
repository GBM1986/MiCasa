import { createClient } from "@supabase/supabase-js"
import React, { createContext, useContext, useEffect, useState } from "react"

// Creates a context for Supabase, which can be used to share the Supabase client across components
const SupabaseContext = createContext()

// Defines component
export const SupabaseProvider = ({ children }) => {
  // State variable hook
  const [supabase, setSupabase] = useState(null)

  // Fetches URL and API key for Supabase from .env
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
  
  // Use useEffect to initialize the Supabase client when the component mounts
  useEffect(() => {
    // Creates the Supabase client and stores it in the state
    setSupabase(createClient(supabaseUrl, supabaseKey))
  }, [supabaseKey]) // Dependency array with supabaseKey, so the client is updated only if this changes

  // Returns a context provider that gives access to the Supabase client
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

// Custom hook to use the Supabase context in other components
export const useSupabase = () => useContext(SupabaseContext)
