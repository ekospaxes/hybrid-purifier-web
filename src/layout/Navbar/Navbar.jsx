import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 h-14 flex items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-eko-emerald/20 p-1.5 rounded-full">
              <Atom className="w-5 h-5 text-eko-neon" />
            </div>
            <span className="text-white font-display font-bold tracking-tight text-lg">
              EKOSPAXES
            </span>
            <span className="text-xs font-mono text-eko-emerald bg-eko-deep px-2 py-0.5 rounded border border-eko-emerald/20 hidden md:block">
              CLASS X 120L
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            {['Technology', 'Sensors', 'Dashboard', 'Impact'].map((item) => (
              <span key={item} className="cursor-pointer hover:text-eko-neon transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-eko-neon transition-all group-hover:w-full" />
              </span>
            ))}
          </div>

          {/* CTA / Mobile */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block bg-white text-black text-xs font-bold px-5 py-2 rounded-full hover:bg-eko-neon transition-colors">
              PRE-ORDER
            </button>
            <Menu className="w-6 h-6 text-white md:hidden" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;