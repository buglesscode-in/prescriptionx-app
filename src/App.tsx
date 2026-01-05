// src/App.tsx (Final structure with Nested Routing)

import { Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import PrescriptionScreen from './pages/PrescriptionScreen';
import EnterpriseScreen from './pages/EnterpriseScreen';
import HomeScreen from './pages/HomeScreen';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import TemplateScreen from './pages/TemplateScreen';
import LandingPage from './pages/LandingPage';
import {
  Features,
  Pricing,
  Testimonials,
  FAQ,
  AboutUs,
  Careers,
  Blog,
  Contact,
  PrivacyPolicy,
  TermsOfService,
  CookiePolicy,
  Sitemap,
} from './pages/FooterPages';


function App() {
  return (
    <Routes>
      {/* 1. Unprotected Route: Login & Landing */}
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<LandingPage />} />

      {/* Footer Pages (Public) */}
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      <Route path="/sitemap" element={<Sitemap />} />

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
        <Route path="/dashboard" element={<HomeScreen />} />
        <Route path="/templates" element={<TemplateScreen />} />
        <Route path="/prescription" element={<PrescriptionScreen />} />
        <Route path="/enterprise" element={<EnterpriseScreen />} />
      </Route>

      {/* 3. Fallback Route: Redirects to login */}
      <Route path="*" element={<LoginScreen />} />
    </Routes>
  );
}

export default App;
