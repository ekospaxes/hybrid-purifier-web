import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Menu, Zap } from 'lucide-react';
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
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: shine 4s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 h-14 flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-eko-emerald/20 p-1.5 rounded-full group-hover:bg-eko-emerald/30 transition-colors">
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
            
            {/* Divider */}
            <div className="w-px h-4 bg-white/10" />
            
            <Link to="/dashboard" className="hover:text-eko-neon transition-colors">Dashboard</Link>
            
            {/* Deep Dive - Green Gradient, No Dot */}
            <Link to="/deep-dive" className="font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Deep Dive
            </Link>

            {/* Class C - Animated Blue/Purple Gradient */}
            <Link to="/refinery" className="group relative flex items-center gap-2">
                <span className="relative font-black tracking-wider bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient-text">
                  CLASS C
                </span>
            </Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link to="/coming-soon">
              <button className="hidden md:block bg-white text-black text-xs font-bold px-5 py-2 rounded-full hover:bg-eko-neon hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 active:scale-95">
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