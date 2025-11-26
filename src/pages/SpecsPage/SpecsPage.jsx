import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Ruler, Zap, Container, Wifi, Layers, Clock,
  Droplets, Wind, Activity, Cpu, Database, Thermometer,
  Shield, Gauge, Radio, TrendingUp, Home, Building2, GraduationCap
} from 'lucide-react';

const Home = () => {
  return (
    <main className="w-full bg-eko-bg">
      <Hero />
      
      <div id="technology">
        <Technology />
      </div>

      <div id="sensors">
        <Sensors />
      </div>

      {/* --- NEW SECTION ADDED HERE --- */}
      <EcosystemMap /> 
      {/* ------------------------------ */}

      <div id="impact">
        <Impact />
      </div>
      
      <div id="specs">
        <Specs />
      </div>
    </main>
  );
};

export default Home;
