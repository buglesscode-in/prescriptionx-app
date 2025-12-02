import { Outlet } from 'react-router-dom';
import Navigation from '../components/navigation/Navigation';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
