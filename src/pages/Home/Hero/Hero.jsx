import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDownRight, Cpu, Globe, Scan } from 'lucide-react';
import anime from 'animejs';
import KineticGrid from './KineticGrid';

// --- UTILS: SCRAMBLE TEXT EFFECT ---
const ScrambleText = ({ text, className }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  
  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(prev => text.split("").map((letter, index) => {
        if(index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      
      if(iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, 30);
  };

  return (
    <span onMouseEnter={scramble} className={`cursor-default ${className}`}>
      {display}
    </span>
  );
};

// --- COMPONENT: VERTICAL DATA STREAM ---
const DataStream = ({ side = 'left' }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0');
      setData(prev => [hex, ...prev.slice(0, 20)]);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`hidden lg:flex flex-col gap-1 font-mono text-[9px] text-[#222] select-none absolute top-0 bottom-0 justify-center w-12 overflow-hidden z-10 ${side === 'left' ? 'left-6 items-start' : 'right-6 items-end text-right'}`}>
      {data.map((item, i) => (
        <div key={i} style={{ opacity: 1 - i * 0.05 }}>{item}</div>
      ))}
    </div>
  );
};

// --- COMPONENT: BOTTOM TICKER TAPE ---
const TickerTape = () => (
  <div className="absolute bottom-0 left-0 w-full bg-eko-emerald text-black overflow-hidden py-1 z-30 font-mono text-xs font-bold tracking-wider select-none border-t border-black">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...Array(10)].map((_, i) => (
        <span key={i} className="mx-8 flex items-center gap-4">
          <span>SYSTEM_READY</span>
          <span className="w-2 h-2 bg-black rounded-full" />
          <span>BIO_REACTOR_ONLINE</span>
          <span className="w-2 h-2 bg-black rounded-full" />
          <span>AQI_OPTIMIZED</span>
          <span className="w-2 h-2 bg-black rounded-full" />
        </span>
      ))}
    </div>
    <style>{`
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee { animation: marquee 20s linear infinite; }
    `}</style>
  </div>
);

// --- COMPONENT: CORNER HUD ---
const CornerMarks = () => (
  <div className="absolute inset-4 md:inset-8 pointer-events-none z-20 border border-white/5 rounded-3xl">
    {/* Corners */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-eko-emerald/50 rounded-tl-xl" />
    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-eko-emerald/50 rounded-tr-xl" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-eko-emerald/50 rounded-bl-xl" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-eko-emerald/50 rounded-br-xl" />
    
    {/* Center Crosshair */}
    <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-white/20" />
    <div className="absolute top-1/2 right-0 w-4 h-[1px] bg-white/20" />
    <div className="absolute top-0 left-1/2 w-[1px] h-4 bg-white/20" />
    <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-white/20" />
  </div>
);

const Hero = () => {
  useEffect(() => {
    // Intro Sequence
    const timeline = anime.timeline({ easing: 'easeOutExpo' });
    timeline
      .add({
        targets: '.hero-char',
        translateY: [150, 0],
        opacity: [0, 1],
        rotateX: [90, 0],
        duration: 1200,
        delay: anime.stagger(30)
      })
      .add({
        targets: '.hud-element',
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800
      }, '-=800');
  }, []);

  return (
    <section className="relative h-screen w-full bg-[#020202] overflow-hidden flex flex-col items-center justify-center">
      
      {/* 1. LAYERS */}
      <KineticGrid />
      <DataStream side="left" />
      <DataStream side="right" />
      <CornerMarks />

      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-[1600px] h-full flex flex-col justify-between py-28 md:py-20 px-6">
        
        {/* TOP HUD */}
        <div className="flex justify-between items-start text-[10px] md:text-xs font-mono text-gray-500 hud-element opacity-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-eko-emerald">
              <Scan size={14} />
              <span>SCANNING_ENV...</span>
            </div>
            <div className="hidden md:block">LAT: 28.6139° N / LON: 77.2090° E</div>
          </div>
          <div className="text-right">
             <div>EKOSPAXES.SYS // ROOT</div>
             <div><span className="text-white">MEM_USAGE:</span> 12%</div>
          </div>
        </div>

        {/* CENTER STAGE */}
        <div className="flex-grow flex flex-col justify-center items-center">
          
          <div className="relative z-20 mix-blend-difference text-center">
            {/* BIG TITLE */}
            <h1 className="flex flex-col items-center leading-[0.85] tracking-tighter">
              
              <div className="overflow-hidden mb-2 md:mb-4">
                <span className="flex text-[15vw] md:text-[13vw] font-display font-bold text-white transform-gpu">
                  {"BREATHE".split('').map((char, i) => (
                    <span key={i} className="hero-char inline-block origin-bottom">{char}</span>
                  ))}
                </span>
              </div>

              <div className="overflow-hidden">
                <span className="flex text-[10vw] md:text-[8vw] font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
                  {"INTELLIGENCE".split('').map((char, i) => (
                    <span key={i} className="hero-char inline-block origin-bottom">{char}</span>
                  ))}
                </span>
              </div>
            </h1>
          </div>

          {/* DESCRIPTION - CLEANED UP */}
          <div className="mt-12 md:mt-14 max-w-lg text-center hud-element opacity-0">
            
            {/* New "System Tag" Look */}
            <div className="inline-flex items-center justify-center mb-6 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
               <span className="text-[10px] font-mono text-eko-emerald tracking-widest uppercase flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-eko-emerald rounded-full animate-pulse"/>
                 System Protocol v2.0
               </span>
            </div>
            
            <p className="text-gray-400 font-light text-sm md:text-base uppercase tracking-widest leading-loose">
              <ScrambleText text="Bio-Hybrid" className="text-white font-bold" /> purification for the 
              <br/> <span className="text-eko-emerald">Post-Industrial</span> landscape.
            </p>
          </div>

        </div>

        {/* BOTTOM HUD */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 hud-element opacity-0 pointer-events-auto pb-8">
          
          {/* ACTION BUTTON */}
          <Link to="/simulator" className="group flex items-center gap-4 cursor-pointer">
             <div className="relative w-12 h-12 bg-white text-black flex items-center justify-center font-bold text-xl overflow-hidden rounded-sm">
                <div className="absolute inset-0 bg-eko-emerald translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <ArrowDownRight className="relative z-10 group-hover:-rotate-90 transition-transform duration-300" />
             </div>
             <div className="text-left hidden md:block">
                <div className="text-white font-bold text-xs tracking-wider">INIT_SIMULATION</div>
                <div className="text-[10px] text-gray-500 font-mono group-hover:text-eko-emerald transition-colors">LAUNCH DIGITAL TWIN</div>
             </div>
          </Link>

          {/* STATS CLUSTER */}
          <div className="flex gap-12 font-mono text-[10px] text-gray-500">
             <div className="group cursor-default">
               <div className="flex items-center gap-2 mb-1 group-hover:text-white transition-colors"><Cpu size={12} /> CPU_LOAD</div>
               <div className="text-xl text-white font-display">12%</div>
               <div className="w-full h-1 bg-gray-800 mt-1"><div className="w-[12%] h-full bg-eko-emerald" /></div>
             </div>
             <div className="group cursor-default">
               <div className="flex items-center gap-2 mb-1 group-hover:text-white transition-colors"><Globe size={12} /> NET_STATUS</div>
               <div className="text-xl text-white font-display">ONLINE</div>
               <div className="w-full h-1 bg-gray-800 mt-1"><div className="w-full h-full bg-eko-emerald" /></div>
             </div>
          </div>

        </div>
      </div>

      {/* 3. TICKER TAPE */}
      <TickerTape />

    </section>
  );
};

export default Hero;