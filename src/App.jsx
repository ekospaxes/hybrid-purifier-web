import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// --- COMPONENTS ---
import Navbar from './layout/Navbar/Navbar';
import Footer from './layout/Footer/Footer';
import ProductReveal from './components/ProductReveal';

// --- PAGES ---
// Ensure these files exist in your src/pages/ folder
import Home from './pages/Home/Home';
import ComingSoon from './pages/ComingSoon/ComingSoon';
import Simulator from './pages/Simulator/Simulator';
import SpecsPage from './pages/SpecsPage/SpecsPage';
import DashboardPage from './pages/Dashboard/DashboardPage';

// --- HELPER: SCROLL TO TOP ON ROUTE CHANGE ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- MAIN CONTENT WRAPPER ---
function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // FIX: Disable Lenis smooth scrolling ONLY on the 3D Reveal page.
    // The 3D library (Drei ScrollControls) needs native scroll control to work.
    if (location.pathname === '/reveal') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // Cleanup Lenis when leaving the page or component unmounts
    return () => {
      lenis.destroy();
    };
  }, [location.pathname]); // Re-run this check whenever the URL changes

  return (
    <div className="antialiased selection:bg-green-500/30 selection:text-white bg-black min-h-screen flex flex-col">
      {/* Cinematic Grain Overlay */}
      <div className="grain-overlay fixed inset-0 pointer-events-none z-[9999]" />
      
      <ScrollToTop />
      
      {/* Navbar sits on top of everything */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/specs" element={<SpecsPage />} />
          <Route path="/reveal" element={<ProductReveal />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          
          {/* Fallback for unknown routes */}
          <Route path="*" element={<Home />} /> 
        </Routes>
      </main>

      {/* Footer is visible on all pages, including Reveal */}
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}

// --- APP ENTRY POINT ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;