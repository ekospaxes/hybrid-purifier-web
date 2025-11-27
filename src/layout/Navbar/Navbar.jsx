import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();


  // Function to handle scroll or navigation
  const handleScroll = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 h-14 flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-eko-emerald/20 p-1.5 rounded-full">
              <Atom className="w-5 h-5 text-eko-neon" />
            </div>
            <span className="text-white font-display font-bold tracking-tight text-lg">
              EKOSPAXES
            </span>
          </Link>


          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <button onClick={() => handleScroll('technology')} className="hover:text-eko-neon transition-colors">Technology</button>
            <button onClick={() => handleScroll('sensors')} className="hover:text-eko-neon transition-colors">Sensors</button>
            <button onClick={() => handleScroll('impact')} className="hover:text-eko-neon transition-colors">Impact</button>
            
            {/* Direct Page Links */}
            <div className="w-px h-4 bg-white/10" />
            <Link to="/dashboard" className="hover:text-eko-neon transition-colors">Dashboard</Link>
            
            {/* --- NEW LINK ADDED HERE --- */}
            <Link to="/deep-dive" className="text-eko-neon hover:text-white transition-colors flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-eko-neon animate-pulse" />
                Deep Dive
            </Link>

          </div>


          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link to="/coming-soon">
              <button className="hidden md:block bg-white text-black text-xs font-bold px-5 py-2 rounded-full hover:bg-eko-neon transition-colors">
                PRE-ORDER
              </button>
            </Link>
            <Menu className="w-6 h-6 text-white md:hidden" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};


export default Navbar;
