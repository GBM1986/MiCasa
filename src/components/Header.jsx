import React from 'react'
import bgImage from '../assets/Images/headerbg-MiCasa.png'
import { Navbar } from './Navbar'
import Hero from './Hero'

export const Header = () => {
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
      <div className="flex flex-col justify-center items-center p-5 w-[269px] ml-[50px] bg-rose-quartz rounded-lg shadow-lg mt-[60px] relative z-20">
        {/* Adjust margin-top here to move the logo down */}
        <h1 className="text-white font-poller text-[46px] leading-[55px] tracking-wider font-outline-3">
          MiCasa
        </h1>
        <p className="text-raisin-black font-semibold font-open-sans text-lg leading-[25px] tracking-wider">
          Autoriseret mæglerhus
        </p>
      </div>
     
    </div>
  )
}
