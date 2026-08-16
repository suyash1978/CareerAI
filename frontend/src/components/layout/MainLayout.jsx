import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import FloatingChatWidget from '../common/FloatingChatWidget';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      <FloatingChatWidget />
    </div>
  );
};

export default MainLayout;
