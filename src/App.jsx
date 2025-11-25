import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './layout/Navbar/Navbar';
import Footer from './layout/Footer/Footer'; // <--- Import Footer
import Home from './pages/Home/Home'; // We need to update Home to include Specs
import 'lenis/dist/lenis.css';

function App() {
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
      <Navbar />
      <Home />
      <Footer /> {/* <--- Add Footer here */}
    </div>
    
  );
}

export default App;