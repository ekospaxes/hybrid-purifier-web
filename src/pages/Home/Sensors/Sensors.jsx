import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Droplets, Wind, Zap, Gauge, Server, Cpu } from 'lucide-react';
import GlassCard from '../../../components/ui/GlassCard';
import { AnimatedTitle, AnimatedText } from '../../../components/ui/AnimatedText'; // <--- IMPORT

// ... (Keep sensorConfig array exactly the same as before) ...
const sensorConfig = [
  { id: "PM2.5", name: "Particulate Matter", unit: "µg/m³", baseValue: 43, sensor: "PMS5003", icon: Wind, color: "text-eko-emerald", desc: "Laser Scattering Analysis" },
  { id: "CO2", name: "Carbon Dioxide", unit: "ppm", baseValue: 420, sensor: "MH-Z19B", icon: Wind, color: "text-eko-neon", desc: "NDIR Gas Sensor" },
  { id: "VOC", name: "Volatile Compounds", unit: "index", baseValue: 12, sensor: "BME680", icon: Activity, color: "text-yellow-400", desc: "MOX Gas Resistance" },
  { id: "TEMP", name: "Chamber Temp", unit: "°C", baseValue: 27.5, sensor: "DS18B20", icon: Thermometer, color: "text-orange-400", desc: "Maintains Algae Health" },
  { id: "pH", name: "Acidity Level", unit: "pH", baseValue: 7.4, sensor: "Ind. Probe", icon: Droplets, color: "text-blue-400", desc: "Buffer Solution Check" },
  { id: "TURB", name: "Biomass Density", unit: "NTU", baseValue: 850, sensor: "Optical", icon: Gauge, color: "text-purple-400", desc: "Growth Tracking" }
];

const Sensors = () => {
  const [data, setData] = useState(sensorConfig.map(s => s.baseValue));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => 
        currentData.map((val, i) => {
          const noise = (Math.random() - 0.5) * (val * 0.05); 
          return Number((val + noise).toFixed(1));
        })
      );
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 px-6 relative bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header - ANIMATED */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-eko-neon mb-2"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-xs tracking-widest uppercase">Live Telemetry</span>
            </motion.div>
            
            <AnimatedTitle className="text-4xl md:text-5xl font-display font-bold text-white">
              Sensors & Monitoring.
            </AnimatedTitle>
          </div>
          
          <div className="text-right hidden md:block">
            <AnimatedText className="text-gray-400 text-sm font-mono" delay={0.2}>
              CONTROLLER: ARDUINO R4 WIFI<br />
              PROTOCOL: MQTT / WEBSOCKETS
            </AnimatedText>
          </div>
        </div>

        {/* Dashboard Grid (Keep existing grid code) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Main Status Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2 lg:col-span-1"
          >
            <GlassCard className="h-full p-6 flex flex-col justify-between bg-eko-emerald/10 border-eko-emerald/30">
              <div className="flex justify-between items-start">
                <span className="text-eko-emerald font-bold tracking-wider text-sm">SYSTEM STATUS</span>
                <Server className="w-5 h-5 text-eko-emerald" />
              </div>
              <div className="mt-8">
                <div className="text-4xl font-mono text-white mb-2">OPTIMAL</div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eko-emerald opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-eko-emerald"></span>
                  </span>
                  <span className="text-gray-400 text-xs">Purification Sequence Active</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>UPTIME</span>
                  <span className="text-white">94% (6 DAYS)</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Individual Sensors */}
          {sensorConfig.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard hoverEffect={true} className="p-6 h-40 flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs font-mono">{item.sensor}</span>
                  </div>
                  <span className={`text-[10px] border border-white/10 px-1.5 py-0.5 rounded text-gray-500 uppercase`}>
                    {item.id}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-mono font-bold ${item.color}`}>
                    {data[index]}
                  </span>
                  <span className="text-xs text-gray-500">{item.unit}</span>
                </div>
                <div className="text-xs text-gray-500 truncate">{item.desc}</div>
              </GlassCard>
            </motion.div>
          ))}

          {/* CPU Card */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 }}
             className="col-span-1 md:col-span-2 lg:col-span-2"
          >
             <GlassCard className="h-full p-6 flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200 font-medium">Neural Logic Processing</span>
                  </div>
                  <p className="text-sm text-gray-500 max-w-md">
                    Data sent via MQTT to ThingsBoard Cloud. Algorithms adjust fan speed and LED intensity based on real-time AQI readings.
                  </p>
                </div>
                <div className="flex gap-1 items-end h-12 opacity-50">
                    {[40, 70, 30, 80, 50, 90, 60, 40].map((h, i) => (
                        <motion.div 
                            key={i}
                            animate={{ height: [`${h}%`, `${h - 20}%`, `${h}%`] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-2 bg-eko-neon/50 rounded-t-sm"
                        />
                    ))}
                </div>
             </GlassCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Sensors;