import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto my-16 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-slate-600 text-xs font-medium max-w-xs leading-relaxed">
        The requested page does not exist or has been relocated within the CareerAI platform.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md shadow-blue-500/25 transition-all mt-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
