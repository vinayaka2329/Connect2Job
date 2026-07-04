import { useEffect } from 'react';
import AOS from 'aos';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Jobs from './pages/Jobs';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import TrackApplication from './pages/TrackApplication';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

function AppContent() {
  const { toast } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  useEffect(() => {
    const pageClasses = [
  "home-page",
  "about-page",
  "services-page",
  "jobs-page",
  "contact-page",
  "admin-page",
  "track-application-page",
];
    const pageSlug = location.pathname === '/' ? 'home-page' : `${location.pathname.replace(/^\//, '')}-page`;
    const bodyClassList = document.body.classList;
    bodyClassList.remove(...pageClasses);
    bodyClassList.add(pageSlug);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Navbar />
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/track-application" element={<TrackApplication />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <Footer />
      
      {toast && <Toast toast={toast} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}