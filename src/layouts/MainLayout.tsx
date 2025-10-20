// src/layouts/MainLayout.tsx

import { Link, Outlet } from 'react-router-dom'; // 👈 IMPORT THE THEME TOGGLER
import Navigation from '../components/navigation/Navigation';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* --- Header/Navigation Bar (Your Sexy Header) --- */}
      <header className="flex items-center justify-between border-b p-4 shadow-sm bg-white dark:bg-gray-800">
        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          PrescriptionX
        </Link>

        <Navigation />
      </header>

      {/* 💥 Outlet renders the current child route content 💥 */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
