import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Components
import Navbar from './layout/Navbar/Navbar';
import Footer from './layout/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import ComingSoon from './pages/ComingSoon/ComingSoon';
import Simulator from './pages/Simulator/Simulator';
import SpecsPage from './pages/SpecsPage/SpecsPage';
import DashboardPage from './pages/Dashboard/DashboardPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppContent() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="antialiased selection:bg-eko-emerald/30 selection:text-white bg-black">
      <div className="grain-overlay" />
      <ScrollToTop />
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/specs" element={<SpecsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
