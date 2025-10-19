// src/pages/HomeScreen.tsx (Simplified)

// Remove Link, as navigation is in MainLayout

function HomeScreen() {
  return (
    <div>
      {/* This content renders inside the <Outlet /> of MainLayout */}
      <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Welcome Back!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Select "New Prescription" to begin writing, or configure your enterprise
        details.
      </p>
    </div>
  );
}

export default HomeScreen;
