import React from 'react';
import { Navbar } from './Navbar';
import Hero from './Hero';
import { useAuth } from '../providers/AuthProvider';
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { supabase } from '../providers/SupabaseProvider'; // Import supabase directly

export const Header = () => {
  const { loginData, setLoginData } = useAuth(); // Destructure loginData and setLoginData from AuthProvider

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error; // Throw error if logout fails
      setLoginData(null); // Set loginData to null upon logout
      sessionStorage.removeItem("supabase.auth.token"); // Clear token from session storage
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div>
      <div className="absolute inset-0 h-[50px]">
        <div className="relative w-full overflow-hidden z-20">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1280 104"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 103.5L361.79 70.8042L1280 103.5V0H0V103.5Z"
              fill="#1D1E2C"
            />
          </svg>
        </div>
        
        <div className='mt-[-140px]'>
          <Navbar />
          <Hero />
        </div>
      </div>

      <Link to="/">
        <div className="flex flex-col justify-center items-center p-5 w-[269px] ml-[50px] bg-rose-quartz rounded-lg shadow-lg mt-[60px] relative z-20">
          <h1 className="text-white font-poller text-[46px] leading-[55px] tracking-wider font-outline-3">
            MiCasa
          </h1>
          <p className="text-raisin-black font-semibold font-open-sans text-lg leading-[25px] tracking-wider">
            Autoriseret mæglerhus
          </p>
        </div>
      </Link>

      <div className="flex justify-end mr-10 p-5">
        {/* Conditionally render the logout button if the user is logged in */}
        {loginData ? (
          <button
            className="flex bg-rose-quartz px-4 py-2 rounded-md gap-2 hover:bg-lavender mt-4"
            aria-label="Logout Button"
            onClick={handleLogout}
          >
            <span>Logout</span>
            <RiLogoutCircleLine className="text-xl mt-1" />
          </button>
        ) : null}
      </div>
    </div>
  );
};
