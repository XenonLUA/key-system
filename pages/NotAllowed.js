import React from 'react';
import '../src/app/globals.css';

export default function NotAllowed() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-300">Sorry, you are not allowed to login.</p>
      </div>
    </div>
  );
}
