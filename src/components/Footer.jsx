import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../providers/SupabaseProvider'
import { CiAt } from "react-icons/ci";


export const Footer = () => {

    const { supabase } = useSupabase();
    const [email, setEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      // Validate email
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setStatusMessage('Please enter a valid email address.');
        return;
      }
  
      // Insert email into Supabase
      const { data, error } = await supabase
        .from('newsletter_emails')
        .insert([{ email, created_at: new Date().toISOString() }]);
  
      if (error) {
        console.error('Error inserting email:', error);
        setStatusMessage('There was an error. Please try again.');
      } else {
        setEmail(''); // Clear the input field
        setStatusMessage('Thank you for subscribing!');
      }
    };
    
  return (
    <footer className="bg-raisin-black text-white">
      <div className="max-w-screen-4xl px-6 py-10 mx-auto">
      <div className="flex flex-wrap ">
        <section className='flex-1'>
            <h1 className='text-heading-1 text-white font-poppins mb-4'>MiCasa</h1>
            <p>Øster Uttrupvej 5</p>
            <p className='mb-4'>9000 Aalborg</p>
            <p>Email: info@homelands.dk</p>
            <p>Telefon: +45 1122 3344</p>
        </section>

        <section className='flex flex-col mt-10 font-poppins'>
            <Link to="/">Forside</Link>
            <Link to="/boliger">Boliger</Link>
            <Link to="/kontakt">Kontakt</Link>
            <Link to="/login">Login</Link>
        </section>

        <div className="flex-1">
            <section className="flex flex-col text-sm items-end">
              <h4 className="text-heading-3">Få drømmehuset i din indbakke</h4>
              <p className='text-body text-end'>Tilmeld dig til vores nyhedsbrev og få nye boliger sendt <br /> direkte til din indbakke</p>
              <form className="flex flex-row ">
              <CiAt className='bg-rose-quartz text-white rounded-l-md text-4xl p-2 mt-2' />
                <input
                  className="px-4 py-[7px] w-64 max-w-md border border-gray-200  focus:outline-none focus:border-blue-500 self-end text-black"
                  type="email"
                  placeholder="Indtast din email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="px-4 py-2 w-32 mt-2 text-white rounded-r-md bg-rose-quartz hover:bg-blue-600 self-end"
                  type="submit"
                  onClick={handleSubmit}
                >
                  TILMELD
                </button>
              </form>
              {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}
            </section>
        </div>
          </div>
      </div>
    </footer>
  )
}
