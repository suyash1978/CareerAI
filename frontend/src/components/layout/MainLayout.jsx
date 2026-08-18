import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import FloatingChatWidget from '../common/FloatingChatWidget';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 relative bg-grid-pattern overflow-x-hidden">
      {/* Background Soft Glow Orbs inspired by HospiWise */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
        <FloatingChatWidget />
      </div>
    </div>
  );
};

export default MainLayout;
