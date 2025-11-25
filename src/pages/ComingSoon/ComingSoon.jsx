import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import NeonGrid from '../../components/ui/NeonGrid';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-6 text-center">
      <NeonGrid />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl p-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-eko-emerald/20 p-4 rounded-full">
             <Clock className="w-8 h-8 text-eko-emerald" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
          Coming Soon.
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          The first batch of <span className="text-eko-emerald">Class X 120L</span> is currently in production. 
          Join the waitlist to secure your unit.
        </p>

        <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
           <input 
             type="email" 
             placeholder="Enter your email" 
             className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eko-emerald/50"
           />
           <button className="bg-eko-emerald text-black font-bold px-6 py-3 rounded-xl hover:bg-eko-neon transition-colors">
             Notify Me
           </button>
        </form>

        <div className="mt-12">
            <Link to="/" className="text-gray-500 hover:text-white flex items-center justify-center gap-2 text-sm transition-colors">
                <ArrowLeft size={16} /> Return Home
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;