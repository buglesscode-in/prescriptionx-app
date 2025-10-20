// src/App.tsx (Final structure with Nested Routing)

import { Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import PrescriptionScreen from './pages/PrescriptionScreen';
import EnterpriseScreen from './pages/EnterpriseScreen';
import HomeScreen from './pages/HomeScreen';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout'; // 👈 NEW IMPORT (Assuming you created this file/path)

function App() {
  return (
    <Routes>
      {/* 1. Unprotected Route: Login */}
      <Route path="/login" element={<LoginScreen />} />

      {/* 2. Nested Protected Routes: Uses MainLayout as the common wrapper */}
      {/* The entire group is protected by wrapping the element in <ProtectedRoute> */}
      <Route
        element={
          <ProtectedRoute>
            {/* The MainLayout component renders the header and the <Outlet /> */}
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* These routes render inside the <Outlet /> of MainLayout */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/prescription" element={<PrescriptionScreen />} />
        <Route path="/enterprise" element={<EnterpriseScreen />} />
      </Route>

      {/* 3. Fallback Route: Redirects to login */}
      <Route path="*" element={<LoginScreen />} />
    </Routes>
  );
}

export default App;
