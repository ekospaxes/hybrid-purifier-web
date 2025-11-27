import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// --- COMPONENTS ---
import Navbar from './layout/Navbar/Navbar';
import Footer from './layout/Footer/Footer';
import ProductReveal from './components/ProductReveal';

// --- PAGES ---
import Home from './pages/Home/Home';
import ComingSoon from './pages/ComingSoon/ComingSoon';
import Simulator from './pages/Simulator/Simulator';
import SpecsPage from './pages/SpecsPage/SpecsPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DeepDive from './pages/DeepDive/DeepDive';

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
    // 1. DISABLE SMOOTH SCROLL ON 3D PAGES
    // We disable Lenis on '/reveal' because the 3D sticky scroll relies on native browser behavior.
    if (location.pathname === '/reveal') return;

    // 2. CONFIGURE LENIS (Luxurious Smooth Scroll)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // "Expo Out" easing
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [location.pathname]);

  return (
    <div className="antialiased selection:bg-emerald-500/30 selection:text-white bg-[#050505] min-h-screen flex flex-col">
      {/* Cinematic Grain Overlay (Optional) */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      <ScrollToTop />
      
      {/* Navbar - Fixed Z-Index to sit above 3D canvas */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reveal" element={<ProductReveal />} /> {/* The 3D Page */}
          <Route path="/specs" element={<SpecsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/deep-dive" element={<DeepDive />} /> 
          
          {/* Fallback */}
          <Route path="*" element={<Home />} /> 
        </Routes>
      </main>

      {/* Footer */}
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