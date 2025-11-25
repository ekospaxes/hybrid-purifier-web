import React from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Simulator = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
      <div className="w-24 h-24 border-4 border-white/10 border-t-eko-emerald rounded-full animate-spin mb-8" />
      <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
        Initializing Simulator...
      </h1>
      <p className="text-gray-500 max-w-lg mb-8">
        Loading WebGL Environment. Preparing Digital Twin data connection to Real-Time AQI servers.
      </p>
      <div className="flex items-center gap-2 text-eko-neon bg-eko-deep px-4 py-2 rounded border border-eko-emerald/20 animate-pulse">
        <Activity size={16} />
        <span className="font-mono text-xs uppercase tracking-widest">Est. Load Time: Unknown</span>
      </div>
      <Link to="/" className="mt-12 text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft size={16} /> Abort Simulation
      </Link>
    </div>
  );
};

export default Simulator;