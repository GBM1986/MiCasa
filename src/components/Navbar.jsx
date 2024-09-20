import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { CiMenuBurger } from 'react-icons/ci';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Use navigate for redirection

  // Handle search and redirect to Search page with query parameter
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Mobile menu content
  const mobileMenu = (
    <div className="absolute left-0 right-0 bg-rose-quartz z-20 p-4 mt-72 xl:hidden">
      <ul className="text-lg space-y-4">
        <li>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Forside</Link>
        </li>
        <li>
          <Link to="/boliger" onClick={() => setIsMobileMenuOpen(false)}>Boliger</Link>
        </li>
        <li>
          <Link to="/kontakt" onClick={() => setIsMobileMenuOpen(false)}>Kontakt</Link>
        </li>
        <li>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
        </li>
        <li className="flex items-center bg-thistle p-2 rounded-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-md border-none w-full"
          />
          <FaSearch className="ml-2 text-lavender cursor-pointer" onClick={handleSearch} />
        </li>
      </ul>
    </div>
  );

  return (
    <nav className="relative z-20">
      {/* Mobile Menu Toggle Button */}
      <button
        className="xl:hidden text-raisin-black text-2xl absolute top-4 right-4 z-30 mt-32"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes /> : <CiMenuBurger />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && mobileMenu}

      {/* Desktop Navigation Links */}
      <ul className="hidden xl:flex w-full max-w-[1440px] mx-auto items-center text-white text-heading-3 space-x-20 font-poppins justify-end mt-[20px]">
        <li>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Forside</Link>
        </li>
        <li>
          <Link to="/boliger" onClick={() => setIsMobileMenuOpen(false)}>Boliger</Link>
        </li>
        <li>
          <Link to="/kontakt" onClick={() => setIsMobileMenuOpen(false)}>Kontakt</Link>
        </li>
        <li>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
        </li>
        <li className="flex items-center ">
          <input
            type="text"
            placeholder="indtast søgeord"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-l-lg border-none w-full text-paynes-gray"
          />
          <FaSearch className="text-white text-5xl bg-paynes-gray p-2 rounded-r-lg cursor-pointer" onClick={handleSearch} />
        </li>
      </ul>
    </nav>
  );
};

