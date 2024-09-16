import React from 'react'
import bgImage from '../assets/Images/headerbg-MiCassa.png'
import { Navbar } from './Navbar'

export const Header = () => {
  return (
    <div className="relative  bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0">
        <div className="relative w-full overflow-hidden rotate-180">
          <svg
            className="relative w-[103%] h-[60px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120V0H1200V120Z"
              className="fill-raisin-black"
              fill="#FFFFFF"
            ></path>
          </svg>
        </div>
        <Navbar />
      </div>
      <div className="flex flex-col justify-center items-center p-5 w-[269px] ml-[50px] bg-rose-quartz rounded-lg shadow-lg mt-[60px] relative z-10">
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
