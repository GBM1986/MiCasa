import React from 'react';
import { Outlet } from 'react-router-dom'; 
import { Header } from '../components/Header'; 
import { Footer } from '../components/Footer'; 

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
