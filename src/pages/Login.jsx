import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../providers/AuthProvider';
import { createClient } from '@supabase/supabase-js';
import { useSupabase } from '../providers/SupabaseProvider';
import { MinSide } from '../pages/MinSide';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const Login = () => {
  const { supabase } = useSupabase();
  const { loginData, setLoginData } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async ({ username, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });
    if (error) {
      console.error("Error logging in:", error);
    } else {
      console.log("Logged in:", data);
      sessionStorage.setItem("supabase.auth.token", JSON.stringify(data));
      setLoginData(data);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setLoginData(null); // Set loginData to null upon logout
      sessionStorage.removeItem("supabase.auth.token");
      if (error) throw error;
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="h-screen bg-white w-[1440px] p-10">
      {!loginData || !loginData.user ? (
        <form className="max-w-md mx-auto bg-white p-6 space-y-4" onSubmit={handleSubmit(handleLogin)}>
          <h2 className="text-heading-1 mb-4">Login</h2>
          <p className="text-heading-4 mb-2">Indtast dit brugernavn og adgangskode for at logge ind</p>
          
          <div>
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Indtast dit brugernavn"
              type="text"
              {...register("username", { required: true })}
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message || 'Brugernavn er påkrævet'}</p>}
          </div>

          <div>
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Indtast din adgangskode"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message || 'Adgangskode er påkrævet'}</p>}
          </div>

          <div className='flex justify-end'>
            <button className='bg-lavender text-raisin-black px-6 py-2 rounded-md shadow-lg font-semibold hover:bg-thistle' type="submit">
              Login
            </button>
          </div>
        </form>
      ) : (
        <div className="max-w-md mx-auto">
          <MinSide />
          <p className="mt-4 p-2 border rounded-md bg-green-100 text-green-800">Du er logget ind som {`${loginData.user.email}`}</p>
          <button className='bg-[#5F657B] px-16 py-2 text-white font-light rounded-sm mt-2' onClick={handleLogout}>Log ud</button>
        </div>
      )}
    </div>
  );
};
