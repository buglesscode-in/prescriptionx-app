// src/layouts/MainLayout.tsx

import { Link, Outlet } from "react-router-dom";
import SignOutButton from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle"; // 👈 IMPORT THE THEME TOGGLER

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* --- Header/Navigation Bar (Your Sexy Header) --- */}
      <header className="flex items-center justify-between border-b p-4 shadow-sm bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          PrescriptionX Dashboard
        </h1>

        <nav className="flex space-x-6 items-center">
          {/* Navigation Links */}
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300"
          >
            Home
          </Link>
          <Link
            to="/prescription"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300"
          >
            New Prescription
          </Link>
          <Link
            to="/enterprise"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300"
          >
            Hospital Settings
          </Link>

          {/* 💥 THEME TOGGLER 💥 */}
          {/* We use space-x-2 here to create a small gap between the toggler and the sign-out button */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Sign Out Button */}
            <SignOutButton />
          </div>
        </nav>
      </header>

      {/* 💥 Outlet renders the current child route content 💥 */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
