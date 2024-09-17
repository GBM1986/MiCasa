import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useLocation } from 'react-router-dom'; // Import useLocation
import slide1 from '../assets/Images/Slideshow/slide-1.jpg';
import slide2 from '../assets/Images/Slideshow/slide-2.jpg';
import slide3 from '../assets/Images/Slideshow/slide-3.jpg';
import slide4 from '../assets/Images/Slideshow/slide-4.jpg';
import slide5 from '../assets/Images/Slideshow/slide-5.jpg';
import slide6 from '../assets/Images/Slideshow/slide-6.jpg';

const images = [slide1, slide2, slide3, slide4, slide5, slide6];

export const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const location = useLocation(); // Get the current location

  // Function to go to the previous slide
  const goToPreviousSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Function to go to the next slide
  const goToNextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Render nothing if not on the front page
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <section aria-label="Slideshow" className="relative w-full h-[600px]">
      {/* Slideshow Wrapper */}
      <div className="relative z-[-1] w-full h-full">
        {/* Image */}
        <figure className="w-full h-full">
          <img
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </figure>

        {/* Left Arrow */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/75 p-3 rounded-full z-10"
          onClick={goToPreviousSlide}
          aria-label="Previous Slide"
        >
          <IoIosArrowBack className="text-2xl" />
        </button>

        {/* Right Arrow */}
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/75 p-3 rounded-full z-10"
          onClick={goToNextSlide}
          aria-label="Next Slide"
        >
          <IoIosArrowForward className="text-2xl" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
