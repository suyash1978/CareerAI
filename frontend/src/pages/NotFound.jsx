import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
      <p className="text-slate-400 text-xs max-w-sm">
        The requested page does not exist or has been relocated within the CareerAI platform.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all mt-4"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
