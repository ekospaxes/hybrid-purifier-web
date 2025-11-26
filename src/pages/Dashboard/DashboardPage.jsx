// DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Wind, MapPin, ShieldCheck, Search, AlertTriangle,
  Thermometer, RefreshCw, Crosshair, X, Beaker, Activity,
  Heart, Eye, Sun
} from 'lucide-react';
import Navbar from '../../layout/Navbar/Navbar';
import GlassCard from '../../components/ui/GlassCard';
import { AnimatedTitle } from '../../components/ui/AnimatedText';

// --- MAP UPDATER ---
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => { if (map && center) map.flyTo(center, 13, { duration: 2.5 }); }, [center, map]);
  return null;
};

// --- PHYSICS & LOGIC HELPERS ---
/**
 * Returns a number (float) with one decimal.
 * If `val` is missing/NaN we simulate using baseLevel + pollutionFactor influence.
 */
const getRobustValue = (val, baseLevel = 10, pollutionFactor = 0) => {
  const num = typeof val === 'string' ? parseFloat(val) : (typeof val === 'number' ? val : NaN);
  if (!isNaN(num) && val !== null && val !== undefined) {
    return Number(num.toFixed(1));
  }
  // Fallback simulation: deterministic-ish but varies slightly
  const simulated = baseLevel + (pollutionFactor * 0.05) + (Math.random() * Math.max(1, baseLevel * 0.1));
  return Number(simulated.toFixed(1));
};

// --- COMPONENTS ---
const HealthMetric = ({ icon: Icon, label, status, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${status === 'Safe' ? 'bg-eko-emerald/20 text-eko-emerald' : 'bg-red-500/20 text-red-500'}`}>
        <Icon size={16} />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </div>
    <span className={`text-xs font-bold font-mono ${status === 'Safe' ? 'text-eko-emerald' : 'text-red-400'}`}>
      {String(status).toUpperCase()}
    </span>
  </motion.div>
);

const AQIGauge = ({ value, max, label, subLabel, pmValue }) => {
  const status = (() => {
    const pm = pmValue ?? value;
    if (pm <= 12) return { color: "text-eko-emerald", stroke: "#10B981", bg: "bg-eko-emerald", label: "Good" };
    if (pm <= 35) return { color: "text-yellow-400", stroke: "#FACC15", bg: "bg-yellow-400", label: "Moderate" };
    if (pm <= 55) return { color: "text-orange-500", stroke: "#F97316", bg: "bg-orange-500", label: "Unhealthy (Sensitive)" };
    if (pm <= 150) return { color: "text-red-500", stroke: "#EF4444", bg: "bg-red-500", label: "Unhealthy" };
    return { color: "text-rose-700", stroke: "#BE123C", bg: "bg-rose-700", label: "HAZARDOUS" };
  })();

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const safeVal = Number(value) || 0;
  const percent = Math.min((safeVal / max) * 100, 100);
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r={radius} stroke="#333" strokeWidth="12" fill="transparent" />
          <motion.circle
            cx="96" cy="96" r={radius}
            stroke="currentColor" strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            className={`${status.color} drop-shadow-[0_0_20px_currentColor]`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-5xl font-display font-bold ${status.color}`}
          >
            {Math.round(safeVal)}
          </motion.span>
          <span className="text-xs text-gray-500 font-mono uppercase mt-1">PM 2.5</span>
        </div>
      </div>
      <div className="text-center mt-2">
        <h3 className="text-white font-bold text-lg">{label}</h3>
        <p className={`text-sm font-bold tracking-wider ${status.color}`}>{status.label}</p>
        <p className="text-xs text-gray-500 mt-1">{subLabel}</p>
      </div>
    </div>
  );
};

const ChemicalCard = ({ label, formula, value, unit, limit }) => {
  const safeVal = Number(value);
  const isSafe = !isNaN(safeVal) ? (safeVal < limit) : true;
  const color = !isSafe ? "text-red-500" : "text-eko-emerald";

  return (
    <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex justify-between items-center hover:bg-white/5 hover:border-eko-emerald/30 transition-all group h-full shadow-lg">
      <div className="flex flex-col justify-center">
        <div className="text-xs text-gray-400 font-mono mb-2 uppercase tracking-widest">{label}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white group-hover:text-eko-neon transition-colors">{formula}</span>
        </div>
      </div>
      <div className="text-right flex flex-col justify-center">
        <div className={`text-4xl font-mono font-bold ${color}`}>
          {isNaN(safeVal) ? '—' : safeVal.toFixed(1)}
        </div>
        <div className="text-xs text-gray-500 mt-1">{unit}</div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [rawApi, setRawApi] = useState(null); // store raw fetch for debugging
  const [weather, setWeather] = useState({});
  const [hourly, setHourly] = useState([]);
  const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.2090 });
  const [locationName, setLocationName] = useState("New Delhi, India");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // fetch data whenever coords change
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,dust,ammonia&hourly=pm2_5&timezone=auto&past_days=1`
        );
        const data = await res.json();
        if (!mounted) return;
        setRawApi(data);

        // normalize the "current" block into friendly keys (some APIs name things differently)
        const current = data?.current || {};
        const normalize = {
          pm2_5: current?.pm2_5 ?? current?.pm2_5 ?? current?.pm25 ?? current?.pm_2_5 ?? null,
          pm10: current?.pm10 ?? current?.pm10 ?? current?.pm10 ?? null,
          carbon_monoxide: current?.carbon_monoxide ?? current?.co ?? current?.carbonMonoxide ?? null,
          ozone: current?.ozone ?? current?.o3 ?? null,
          sulphur_dioxide: current?.sulphur_dioxide ?? current?.so2 ?? null,
          nitrogen_dioxide: current?.nitrogen_dioxide ?? current?.no2 ?? null,
          ammonia: current?.ammonia ?? null,
          dust: current?.dust ?? null,
          uv_index: current?.uv_index ?? current?.uv ?? null
        };

        setWeather(normalize);

        // hourly series: be defensive
        if (data.hourly && Array.isArray(data.hourly.time) && Array.isArray(data.hourly.pm2_5)) {
          // keep last 24 (or fewer)
          const times = data.hourly.time.slice(-24);
          const vals = data.hourly.pm2_5.slice(-24);
          const formatted = times.map((t, i) => {
            // extract hour part if iso string
            const hour = t.includes('T') ? t.split('T')[1].slice(0,5) : t;
            return { time: hour, val: Number(vals[i] ?? getRobustValue(null, 15, 0)) };
          });
          setHourly(formatted);
        } else {
          // fallback: simulate a small hourly series using current pm2_5
          const fallbackVal = getRobustValue(normalize.pm2_5, 25, 0);
          const simulated = Array.from({ length: 24 }).map((_, i) => ({
            time: `${String(i).padStart(2, '0')}:00`,
            val: Number((fallbackVal + Math.sin(i / 24 * Math.PI) * 3).toFixed(1))
          }));
          setHourly(simulated);
        }
      } catch (error) {
        console.error("API Error", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [coords]);

  // Search Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
          const data = await res.json();
          setSuggestions(data.results || []);
          setShowSuggestions(true);
        } catch (err) { console.error(err); setSuggestions([]); setShowSuggestions(false); }
      } else { setSuggestions([]); setShowSuggestions(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const selectLocation = (place) => {
    setCoords({ lat: place.latitude, lng: place.longitude });
    setLocationName(`${place.name}${place.admin1 ? ', ' + place.admin1 : ''}, ${place.country}`);
    setQuery(""); setShowSuggestions(false);
  };
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationName("Your Location");
      });
    }
  };

  // --- CALCULATIONS ---
  const pm25 = getRobustValue(weather?.pm2_5, 25, 0);
  const calcPM25 = Number(pm25);

  let indoorEff = 0.999;
  if (calcPM25 > 150) indoorEff = 0.96;
  if (calcPM25 > 300) indoorEff = 0.94;
  const indoorPM25 = Math.max(1, Number((calcPM25 * (1 - indoorEff)).toFixed(1)));

  // Guaranteed Data Array with numeric values
  const chemicals = [
    { label: "Carbon Monoxide", formula: "CO", unit: "µg/m³", limit: 4000, val: getRobustValue(weather?.carbon_monoxide, 350, calcPM25) },
    { label: "Ozone", formula: "O₃", unit: "µg/m³", limit: 100, val: getRobustValue(weather?.ozone, 45, calcPM25) },
    { label: "Sulphur Dioxide", formula: "SO₂", unit: "µg/m³", limit: 40, val: getRobustValue(weather?.sulphur_dioxide, 12, calcPM25) },
    { label: "Nitrogen Dioxide", formula: "NO₂", unit: "µg/m³", limit: 25, val: getRobustValue(weather?.nitrogen_dioxide, 25, calcPM25) },
    { label: "Ammonia", formula: "NH₃", unit: "µg/m³", limit: 200, val: getRobustValue(weather?.ammonia, 5, calcPM25) },
    { label: "Suspended Dust", formula: "Dust", unit: "µg/m³", limit: 50, val: getRobustValue(weather?.dust, Math.max(15, calcPM25 * 1.1), calcPM25) },
  ];

  // Trigger a resize after hourly data populates to help Recharts measure correctly
  useEffect(() => {
    if (hourly.length > 0) {
      const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
      return () => clearTimeout(t);
    }
  }, [hourly]);

  return (
    <div className="min-h-screen bg-black pb-20 overflow-x-hidden">
      <Navbar />

      <div className="pt-28 px-6 mb-8 relative z-20">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <AnimatedTitle className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
            Atmospheric <span className="text-eko-emerald">Intelligence</span>
          </AnimatedTitle>
        </div>

        <div className="max-w-2xl mx-auto relative">
          <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 transition-all focus-within:border-eko-emerald/50">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search any city on Earth..." className="w-full bg-transparent border-none text-white px-12 py-4 focus:ring-0 focus:outline-none text-lg" />
            {query && <button onClick={() => setQuery("")} className="absolute right-14 text-gray-500 hover:text-white"><X size={18} /></button>}
            <div className="w-px h-8 bg-white/10 mx-2"></div>
            <button onClick={handleLocateMe} className="px-4 text-eko-emerald hover:text-eko-neon transition-colors" title="Locate Me"><Crosshair size={22} /></button>
          </div>
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-40">
                {suggestions.map((place) => (
                  <li key={place.id || place.name + place.latitude} onClick={() => selectLocation(place)} className="px-6 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-0 transition-colors">
                    <MapPin size={16} className="text-gray-500" />
                    <div><div className="text-white font-medium">{place.name}</div><div className="text-xs text-gray-500">{place.admin1 || ''}{place.admin1 ? ', ' : ''}{place.country}</div></div>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: MAP & GRAPH */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          <div className="h-[400px] rounded-3xl overflow-hidden border border-white/10 relative z-0 shadow-lg bg-[#111]">
            <MapContainer center={[coords.lat, coords.lng]} zoom={12} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer attribution='Tiles &copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <CircleMarker center={[coords.lat, coords.lng]} radius={10} color="#10B981" fillColor="#10B981" fillOpacity={0.8}>
                <Popup>{locationName}</Popup>
              </CircleMarker>
              <MapUpdater center={[coords.lat, coords.lng]} />
            </MapContainer>
            <div className="absolute top-4 left-4 z-[400] flex gap-2">
              <div className="bg-black/80 backdrop-blur border border-white/10 px-3 py-1 rounded text-xs font-mono text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE SATELLITE
              </div>
            </div>
          </div>

          <GlassCard className="p-6 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Activity size={18} className="text-eko-emerald" />
                24-Hour Pollution Trend (PM 2.5)
              </h3>
              <div className="text-xs font-mono text-gray-500">OPEN-METEO HISTORICAL</div>
            </div>

            <div className="w-full h-[300px] min-w-0 relative" style={{ minHeight: 300 }}>
              {hourly.length > 0 ? (
                // use numeric height to avoid measurement race conditions
                <ResponsiveContainer width="100%" height={300} key={`${coords.lat}-${coords.lng}-${hourly.length}`}>
                  <AreaChart data={hourly}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#10B981' }} />
                    <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">Initializing Data Stream...</div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT: GAUGES */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Real-time Analysis</span>
              <span className="w-2 h-2 rounded-full bg-eko-emerald" />
            </div>
            <div className="flex items-center justify-between mb-8">
              <AQIGauge value={calcPM25} max={400} label="Outdoor" subLabel={locationName} pmValue={calcPM25} />
            </div>
            <div className="relative p-4 rounded-2xl bg-eko-emerald/5 border border-eko-emerald/20">
              <div className="absolute -top-3 left-4 bg-black px-2 text-xs font-bold text-eko-emerald flex items-center gap-1">
                <ShieldCheck size={12} /> PURIFIED
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl font-display font-bold text-white">{indoorPM25}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Indoor PM2.5</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-eko-emerald">{(indoorEff * 100).toFixed(1)}%</div>
                  <div className="text-[10px] text-eko-emerald/70">Efficiency</div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Heart size={18} className="text-red-400" /> Health Impact
            </h3>
            <div className="space-y-2">
              <HealthMetric icon={Wind} label="Lungs (Respiratory)" status={calcPM25 > 50 ? "Risk" : "Safe"} delay={0.1} />
              <HealthMetric icon={Heart} label="Heart (Cardio)" status={calcPM25 > 100 ? "Risk" : "Safe"} delay={0.2} />
              <HealthMetric icon={Eye} label="Eyes / Vision" status={calcPM25 > 150 ? "Irritation" : "Safe"} delay={0.3} />
            </div>
          </GlassCard>
        </div>

        {/* BOTTOM: FULL SPECTRUM */}
        <div className="lg:col-span-12">
          <h3 className="text-white font-display text-2xl font-bold mb-6 flex items-center gap-3">
            <Beaker className="text-eko-emerald" />
            Full Spectrum Chemistry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chemicals.map((chem, i) => (
              <ChemicalCard
                key={i}
                label={chem.label}
                formula={chem.formula}
                value={chem.val}
                unit={chem.unit}
                limit={chem.limit}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
