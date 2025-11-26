import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Wind, MapPin, ShieldCheck, Search, AlertTriangle,
  Thermometer, RefreshCw, Crosshair, X, Beaker, Activity,
  Heart, Eye, Sun, Download, Clock, Star, Settings, FileText, Copy, Trash
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

// --- HELPERS ---
const formatISO = (iso) => {
  if (!iso) return '—';
  try { const d = new Date(iso); return d.toLocaleString(); } catch { return iso; }
};

const downloadCSV = (filename, rows, delimiter = ',') => {
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes('"') || s.includes('
') || s.includes(delimiter)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  if (!rows || !rows.length) return;
  const header = Object.keys(rows[0]).join(delimiter);
  const body = rows.map(r => Object.values(r).map(esc).join(delimiter)).join('
');
  const csv = header + '
' + body;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const getPollutionStatus = (pm25) => {
  if (pm25 <= 12) return { color: 'text-eko-emerald', stroke: '#10B981', label: 'Good', advice: 'Air is pristine.' };
  if (pm25 <= 35) return { color: 'text-yellow-400', stroke: '#FACC15', label: 'Moderate', advice: 'Acceptable quality.' };
  if (pm25 <= 55) return { color: 'text-orange-500', stroke: '#F97316', label: 'Unhealthy (Sensitive)', advice: 'Sensitive groups caution.' };
  if (pm25 <= 150) return { color: 'text-red-500', stroke: '#EF4444', label: 'Unhealthy', advice: 'Wear a mask outdoors.' };
  return { color: 'text-rose-700', stroke: '#BE123C', label: 'HAZARDOUS', advice: 'EMERGENCY: STAY INDOORS.' };
};

const getRobustValue = (val, baseLevel = 10, pollutionFactor = 0) => {
  const num = typeof val === 'string' ? parseFloat(val) : (typeof val === 'number' ? val : NaN);
  if (!isNaN(num) && val !== null && val !== undefined) { return Number(num.toFixed(1)); }
  const simulated = baseLevel + (pollutionFactor * 0.05) + (Math.random() * Math.max(1, baseLevel * 0.1));
  return Number(simulated.toFixed(1));
};

// --- UI subcomponents ---
const Spinner = ({ size = 16 }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.93 4.93l2.83 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.24 16.24l2.83 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.93 19.07l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Toast = ({ message, show }) => (
  <AnimatePresence>
    {show && (
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed right-6 bottom-6 bg-[#0b0b0b]/95 border border-white/10 text-sm px-4 py-2 rounded-md shadow-lg z-50">
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

const AlertBanner = ({ message, onClose }) => (
  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
    <div className="flex items-center gap-3 bg-rose-700/95 text-white px-4 py-2 rounded-xl shadow-xl border border-rose-800">
      <AlertTriangle /> <div className="text-sm font-medium">{message}</div>
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white"><X size={16} /></button>
    </div>
  </motion.div>
);

const HealthMetric = ({ icon: Icon, label, status, delay }) => (
  <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay }} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${status === 'Safe' ? 'bg-eko-emerald/20 text-eko-emerald' : 'bg-red-500/20 text-red-500'}`}>
        <Icon size={16} />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </div>
    <span className={`text-xs font-bold font-mono ${status === 'Safe' ? 'text-eko-emerald' : 'text-red-400'}`}>{String(status).toUpperCase()}</span>
  </motion.div>
);

const AQIGauge = ({ value, max, label, subLabel, pmValue }) => {
  const status = getPollutionStatus(pmValue ?? value);
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
          <motion.circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.2, ease: 'easeOut' }} strokeLinecap="round" className={`${status.color} drop-shadow-[0_0_20px_currentColor]`} />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className={`text-5xl font-display font-bold ${status.color}`}>{Math.round(safeVal)}</motion.span>
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

$1

// --- EXTRA: Animated Info Panel (AQI + Coordinates + Direction) ---
const CountUp = ({end, duration=1000, format = (v)=>v}) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const from = Number(val);
    const to = Number(end);
    const diff = to - from;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setVal((from + diff * progress).toFixed(1));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end]);
  return <span>{format(Number(val))}</span>;
};

const getBearing = (lat1, lon1, lat2, lon2) => {
  const toRad = (d) => d * Math.PI / 180;
  const toDeg = (r) => r * 180 / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = Math.atan2(y, x);
  return (toDeg(brng) + 360) % 360;
};

const AnimatedInfoPanel = ({ coords, locationName, pm25, hourly }) => {
  const [prevCoords, setPrevCoords] = useState(coords);
  const [bearing, setBearing] = useState(0);
  useEffect(() => { if (prevCoords && coords) { const b = getBearing(prevCoords.lat, prevCoords.lng, coords.lat, coords.lng); setBearing(b); setPrevCoords(coords); } }, [coords]);

  const trend = (() => {
    if (!hourly || hourly.length < 2) return 0;
    const last = hourly[hourly.length-1].val;
    const prev = hourly[hourly.length-2].val;
    return Number((last - prev).toFixed(1));
  })();

  return (
    <div className="mx-auto max-w-4xl my-6">
      <div className="relative rounded-2xl bg-gradient-to-r from-black/60 to-white/2 border border-white/6 p-6 flex items-center gap-6 shadow-lg">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-md border border-white/10 bg-black/50">
              <div className="text-xs text-gray-400 font-mono">AQI (PM2.5)</div>
              <div className="text-4xl font-bold text-eko-emerald"><CountUp end={pm25} duration={700} format={(v)=>Math.round(v)} /></div>
              <div className="text-xs text-gray-400 mt-1">{getPollutionStatus(pm25).label} <span className="text-[10px] text-gray-500">• {Math.abs(trend) > 0 ? (trend > 0 ? '↑' : '↓') + Math.abs(trend) : '—'}</span></div>
            </div>

            <div className="flex-1">
              <div className="text-xs text-gray-400 font-mono">Location</div>
              <div className="text-lg font-bold text-white">{locationName}</div>
              <div className="text-xs text-gray-400 mt-1">Lat: {coords.lat.toFixed(4)} • Lng: {coords.lng.toFixed(4)}</div>
            </div>

            <div className="w-36 text-center">
              <div className="text-xs text-gray-400 font-mono">Direction</div>
              <div className="mx-auto mt-2 w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-black/40" style={{transform: 'translateZ(0)'}}>
                <div style={{transform: `rotate(${bearing}deg)`}} className="transition-transform duration-700">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 L15 9 L12 7 L9 9 Z" />
                    <line x1="12" y1="7" x2="12" y2="22" />
                  </svg>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">Bearing: {Math.round(bearing)}°</div>
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-4 text-xs text-gray-500 font-mono">Live • {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [rawApi, setRawApi] = useState(null);
  const [weather, setWeather] = useState({});
  const [hourly, setHourly] = useState([]);
  const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.2090 });
  const [locationName, setLocationName] = useState('New Delhi, India');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // tile fallback state
  const [tileError, setTileError] = useState(false);

  // features state
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(() => { try { return JSON.parse(localStorage.getItem('autoRefresh')) ?? true; } catch { return true; } });
  const [refreshInterval, setRefreshInterval] = useState(() => Number(localStorage.getItem('refreshInterval')) || 60);
  const [csvDelimiter, setCsvDelimiter] = useState(() => localStorage.getItem('csvDelimiter') || ',');
  const [toasts, setToasts] = useState({ show: false, message: '' });
  const [hazardDismissed, setHazardDismissed] = useState(false);
  const [favorites, setFavorites] = useState(() => { try { return JSON.parse(localStorage.getItem('favorites')) || []; } catch { return []; } });
  const [showRaw, setShowRaw] = useState(false);

  // button action states
  const [savingFav, setSavingFav] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copying, setCopying] = useState(false);
  const [clearing, setClearing] = useState(false);

  const autoRefTimer = useRef(null);

  // fetch data
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,dust,ammonia&hourly=pm2_5&timezone=auto&past_days=1`
      );
      const data = await res.json();
      setRawApi(data);
      const current = data?.current || {};
      const normalize = {
        pm2_5: current?.pm2_5 ?? current?.pm25 ?? current?.pm_2_5 ?? null,
        pm10: current?.pm10 ?? null,
        carbon_monoxide: current?.carbon_monoxide ?? current?.co ?? null,
        ozone: current?.ozone ?? current?.o3 ?? null,
        sulphur_dioxide: current?.sulphur_dioxide ?? current?.so2 ?? null,
        nitrogen_dioxide: current?.nitrogen_dioxide ?? current?.no2 ?? null,
        ammonia: current?.ammonia ?? null,
        dust: current?.dust ?? null,
        uv_index: current?.uv_index ?? current?.uv ?? null
      };
      setWeather(normalize);

      if (data.hourly && Array.isArray(data.hourly.time) && Array.isArray(data.hourly.pm2_5)) {
        const times = data.hourly.time.slice(-24);
        const vals = data.hourly.pm2_5.slice(-24);
        const formatted = times.map((t, i) => {
          const hour = t.includes('T') ? t.split('T')[1].slice(0,5) : t;
          return { time: hour, val: Number(vals[i] ?? getRobustValue(null, 15, 0)) };
        });
        setHourly(formatted);
      } else {
        const fallbackVal = getRobustValue(normalize.pm2_5, 25, 0);
        const simulated = Array.from({ length: 24 }).map((_, i) => ({ time: `${String(i).padStart(2, '0')}:00`, val: Number((fallbackVal + Math.sin(i / 24 * Math.PI) * 3).toFixed(1)) }));
        setHourly(simulated);
      }
      setLastUpdated(new Date().toISOString());
      setHazardDismissed(false);
    } catch (error) {
      console.error('API Error', error);
      setToasts({ show: true, message: 'Failed to fetch data' });
      setTimeout(() => setToasts({ show: false, message: '' }), 2500);
    } finally {
      setLoading(false);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
    }
  };

  useEffect(() => { fetchData(true); }, [coords]);

  // auto refresh handling
  useEffect(() => {
    localStorage.setItem('autoRefresh', JSON.stringify(autoRefresh));
    localStorage.setItem('refreshInterval', String(refreshInterval));
    if (autoRefTimer.current) { clearInterval(autoRefTimer.current); autoRefTimer.current = null; }
    if (autoRefresh) {
      autoRefTimer.current = setInterval(() => fetchData(true), Math.max(10000, refreshInterval * 1000));
    }
    return () => { if (autoRefTimer.current) clearInterval(autoRefTimer.current); };
  }, [autoRefresh, refreshInterval]);

  // search logic
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
    setQuery(''); setShowSuggestions(false);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationName('Your Location'); });
    }
  };

  // derived
  const pm25 = getRobustValue(weather?.pm2_5, 25, 0);
  const calcPM25 = Number(pm25);
  const status = getPollutionStatus(calcPM25);

  let indoorEff = 0.999; if (calcPM25 > 150) indoorEff = 0.96; if (calcPM25 > 300) indoorEff = 0.94;
  const indoorPM25 = Math.max(1, Number((calcPM25 * (1 - indoorEff)).toFixed(1)));

  const chemicals = [
    { label: 'Carbon Monoxide', formula: 'CO', unit: 'µg/m³', limit: 4000, val: getRobustValue(weather?.carbon_monoxide, 350, calcPM25) },
    { label: 'Ozone', formula: 'O₃', unit: 'µg/m³', limit: 100, val: getRobustValue(weather?.ozone, 45, calcPM25) },
    { label: 'Sulphur Dioxide', formula: 'SO₂', unit: 'µg/m³', limit: 40, val: getRobustValue(weather?.sulphur_dioxide, 12, calcPM25) },
    { label: 'Nitrogen Dioxide', formula: 'NO₂', unit: 'µg/m³', limit: 25, val: getRobustValue(weather?.nitrogen_dioxide, 25, calcPM25) },
    { label: 'Ammonia', formula: 'NH₃', unit: 'µg/m³', limit: 200, val: getRobustValue(weather?.ammonia, 5, calcPM25) },
    { label: 'Suspended Dust', formula: 'Dust', unit: 'µg/m³', limit: 50, val: getRobustValue(weather?.dust, Math.max(15, calcPM25 * 1.1), calcPM25) },
  ];

  // favorites
  const saveFavorite = async () => {
    if (savingFav) return;
    setSavingFav(true);
    try {
      const entry = { name: locationName, lat: coords.lat, lng: coords.lng, created: new Date().toISOString() };
      // prevent duplicates
      const exists = favorites.some(f => f.lat === entry.lat && f.lng === entry.lng);
      if (exists) {
        setToasts({ show: true, message: 'Location already saved' });
        setTimeout(() => setToasts({ show: false, message: '' }), 1800);
        setSavingFav(false); // ensure flag reset
        return;
      }
      const updated = [entry, ...favorites].slice(0, 8);
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setToasts({ show: true, message: 'Saved to favorites' });
      setTimeout(() => setToasts({ show: false, message: '' }), 1800);
    } finally { setSavingFav(false); }
  };

  const removeFavorite = (i) => {
    const ok = window.confirm('Remove this favorite?');
    if (!ok) return;
    const updated = favorites.filter((_, idx) => idx !== i);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
    setToasts({ show: true, message: 'Removed favorite' });
    setTimeout(() => setToasts({ show: false, message: '' }), 1200);
  };

  // CSV export
  const exportChemicals = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const rows = chemicals.map(c => ({ label: c.label, formula: c.formula, value: Number(c.val).toFixed(1), unit: c.unit, limit: c.limit }));
      downloadCSV(`chemicals_${locationName.replace(/[ ,]+/g, '_')}.csv`, rows, csvDelimiter);
      setToasts({ show: true, message: 'Chemicals CSV downloaded' });
      setTimeout(() => setToasts({ show: false, message: '' }), 1600);
    } finally { setExporting(false); }
  };

  const exportHourly = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const rows = hourly.map(h => ({ time: h.time, pm25: Number(h.val).toFixed(1) }));
      downloadCSV(`hourly_pm25_${locationName.replace(/[ ,]+/g, '_')}.csv`, rows, csvDelimiter);
      setToasts({ show: true, message: 'Hourly CSV downloaded' });
      setTimeout(() => setToasts({ show: false, message: '' }), 1600);
    } finally { setExporting(false); }
  };

  const copyShareLink = async () => {
    if (copying) return;
    setCopying(true);
    try {
      const str = `${window?.location?.origin || ''}/?lat=${coords.lat}&lng=${coords.lng}`;
      await navigator.clipboard.writeText(str);
      setToasts({ show: true, message: 'Link copied to clipboard' });
      setTimeout(() => setToasts({ show: false, message: '' }), 1600);
    } catch {
      setToasts({ show: true, message: 'Copy failed' });
      setTimeout(() => setToasts({ show: false, message: '' }), 1600);
    } finally { setCopying(false); }
  };

  const clearStorage = async () => {
    if (clearing) return;
    const ok = window.confirm('Clear all saved settings and favorites? This cannot be undone.');
    if (!ok) return;
    setClearing(true);
    try {
      localStorage.clear();
      setFavorites([]);
      setAutoRefresh(true);
      setRefreshInterval(60);
      setCsvDelimiter(',');
      setToasts({ show: true, message: 'Local storage cleared' });
      setTimeout(() => setToasts({ show: false, message: '' }), 1600);
    } finally { setClearing(false); }
  };

  const triggerRefresh = () => fetchData(false);

  // tile error handler to avoid 404 tile issues
  const handleTileError = () => {
    if (!tileError) {
      setTileError(true);
      setToasts({ show: true, message: 'Tile server failed — switching to fallback tiles' });
      setTimeout(() => setToasts({ show: false, message: '' }), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20 overflow-x-hidden">
      <Navbar />

      <AnimatePresence>{calcPM25 > 150 && !hazardDismissed && (<AlertBanner message={`Emergency: PM2.5 ${Math.round(calcPM25)} — ${status.label}. ${status.advice}`} onClose={() => setHazardDismissed(true)} />)}</AnimatePresence>
      <Toast message={toasts.message} show={toasts.show} />

      <div className="pt-28 px-6 mb-8 relative z-20">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <AnimatedTitle className="text-4xl md:text-6xl font-display font-bold text-white mb-2">Atmospheric <span className="text-eko-emerald">Intelligence</span></AnimatedTitle>
          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="text-xs text-gray-400 font-mono">Last updated:</div>
            <div className="text-xs font-mono text-white">{lastUpdated ? formatISO(lastUpdated) : '—'}</div>
            <div className="text-xs text-gray-400 font-mono">•</div>
            <div className="text-xs font-mono text-white flex items-center gap-1"><Clock size={12} /> <span>{autoRefresh ? `Auto ${refreshInterval}s` : 'Auto off'}</span></div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto relative">
          <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 transition-all focus-within:border-eko-emerald/50">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input aria-label="Search city" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search any city on Earth..." className="w-full bg-transparent border-none text-white px-12 py-4 focus:ring-0 focus:outline-none text-lg" />
            {query && <button type="button" aria-label="clear search" onClick={() => setQuery('')} className="absolute right-14 text-gray-500 hover:text-white"><X size={18} /></button>}
            <div className="w-px h-8 bg-white/10 mx-2"></div>
            <button type="button" aria-label="locate me" onClick={handleLocateMe} className="px-4 text-eko-emerald hover:text-eko-neon transition-colors" title="Locate Me"><Crosshair size={22} /></button>
          </div>

          <AnimatePresence>{showSuggestions && suggestions.length > 0 && (
            <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-40">
              {suggestions.map((place) => (
                <li key={place.id || place.name + place.latitude} onClick={() => selectLocation(place)} className="px-6 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-0 transition-colors">
                  <MapPin size={16} className="text-gray-500" />
                  <div><div className="text-white font-medium">{place.name}</div><div className="text-xs text-gray-500">{place.admin1 || ''}{place.admin1 ? ', ' : ''}{place.country}</div></div>
                </li>
              ))}
            </motion.ul>
          )}</AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: MAP & GRAPH */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          <div className="h-[400px] rounded-3xl overflow-hidden border border-white/10 relative z-0 shadow-lg bg-[#111]">
            <MapContainer center={[coords.lat, coords.lng]} zoom={12} scrollWheelZoom={false} className="h-full w-full">
              {/* Primary tile layer (may 404) */}
              {!tileError ? (
                <TileLayer
                  attribution='Tiles &copy; Esri'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  eventHandlers={{ tileerror: handleTileError }}
                />
              ) : (
                // fallback to OpenStreetMap tiles if primary fails
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              )}

              <CircleMarker center={[coords.lat, coords.lng]} radius={10} color="#10B981" fillColor="#10B981" fillOpacity={0.8}>
                <Popup>{locationName}</Popup>
              </CircleMarker>
              <MapUpdater center={[coords.lat, coords.lng]} />
            </MapContainer>

            <div className="absolute top-4 left-4 z-[400] flex gap-2">
              <div className="bg-black/80 backdrop-blur border border-white/10 px-3 py-1 rounded text-xs font-mono text-white flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE SATELLITE</div>
            </div>

            {/* Right-side micro-controls */}
            <div className="absolute top-4 right-4 z-[400] flex gap-2">
              <button type="button" title="Refresh" onClick={triggerRefresh} disabled={loading} className={`bg-black/70 hover:bg-white/5 border border-white/10 px-3 py-2 rounded text-xs flex items-center gap-2 ${loading ? 'opacity-60 cursor-wait' : ''}`}>
                {loading ? <Spinner size={14} /> : <RefreshCw size={14} />} <span>{loading ? 'Loading' : 'Refresh'}</span>
              </button>
              <button type="button" title="Save favorite" onClick={saveFavorite} disabled={savingFav} className={`bg-black/70 hover:bg-white/5 border border-white/10 px-3 py-2 rounded text-xs flex items-center gap-2 ${savingFav ? 'opacity-60 cursor-wait' : ''}`}>
                {savingFav ? <Spinner size={14} /> : <Star size={14} />} <span>{savingFav ? 'Saving' : 'Save'}</span>
              </button>
              <div className="bg-black/70 border border-white/10 px-3 py-2 rounded text-xs flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${status.label === 'HAZARDOUS' ? 'bg-rose-500' : 'bg-eko-emerald'}`} /><div className="text-xs text-gray-300">{status.label}</div></div>
            </div>
          </div>

          <AnimatedInfoPanel coords={coords} locationName={locationName} pm25={calcPM25} hourly={hourly} />

$1
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold flex items-center gap-2"><Activity size={18} className="text-eko-emerald" /> 24-Hour Pollution Trend (PM 2.5)</h3>

              <div className="flex items-center gap-2">
                <button type="button" onClick={exportHourly} disabled={exporting || hourly.length === 0} className={`text-xs bg-black/70 hover:bg-white/5 border border-white/10 px-3 py-1 rounded flex items-center gap-2 ${exporting ? 'opacity-60 cursor-wait' : ''}`} title="Download hourly CSV">{exporting ? <Spinner size={14} /> : <Download size={14} />} CSV</button>
                <button type="button" onClick={() => setShowRaw(s => !s)} className="text-xs bg-black/70 hover:bg-white/5 border border-white/10 px-3 py-1 rounded flex items-center gap-2" title="Toggle raw JSON"><FileText size={14} /> Raw</button>
              </div>
            </div>

            <div className="w-full h-[300px] min-w-0 relative" style={{ minHeight: 300 }}>
              {hourly.length > 0 ? (
                <ResponsiveContainer width="100%" height={300} key={`${coords.lat}-${coords.lng}-${hourly.length}`}>
                  <AreaChart data={hourly}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
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

            <AnimatePresence>{showRaw && (<motion.pre initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4 p-4 rounded bg-[#060606] border border-white/5 text-xs text-gray-300 overflow-auto max-h-48">{JSON.stringify(rawApi || {}, null, 2)}</motion.pre>)}</AnimatePresence>
          </GlassCard>
        </div>

        {/* RIGHT: GAUGES + Controls */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4"><span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Real-time Analysis</span><span className="w-2 h-2 rounded-full bg-eko-emerald" /></div>

            <div className="flex items-center justify-between mb-4"><AQIGauge value={calcPM25} max={400} label="Outdoor" subLabel={locationName} pmValue={calcPM25} /></div>

            <div className="mb-4">
              <div className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-2">Controls</div>
              <div className="flex gap-2">
                <button type="button" onClick={triggerRefresh} disabled={loading} className={`flex-1 px-3 py-2 text-sm bg-black/70 border border-white/10 rounded hover:bg-white/5 flex items-center gap-2 ${loading ? 'opacity-60 cursor-wait' : ''}`} title="Refresh now">{loading ? <Spinner size={16} /> : <RefreshCw />} <span>{loading ? 'Loading' : 'Refresh'}</span></button>
                <button type="button" onClick={copyShareLink} disabled={copying} className={`px-3 py-2 text-sm bg-black/70 border border-white/10 rounded hover:bg-white/5 flex items-center gap-2 ${copying ? 'opacity-60 cursor-wait' : ''}`} title="Copy share link">{copying ? <Spinner size={16} /> : <Copy />} Share</button>
              </div>
              <div className="mt-3 flex gap-2 items-center">
                <button type="button" onClick={exportChemicals} disabled={exporting} className={`flex-1 px-3 py-2 text-sm bg-black/70 border border-white/10 rounded hover:bg-white/5 flex items-center gap-2 ${exporting ? 'opacity-60 cursor-wait' : ''}`} title="Export chemicals CSV">{exporting ? <Spinner size={16} /> : <Download />} Export</button>
                <button type="button" onClick={() => { setShowRaw(s => !s); }} className="px-3 py-2 text-sm bg-black/70 border border-white/10 rounded hover:bg-white/5 flex items-center gap-2" title="Toggle raw JSON"><FileText /> Debug</button>
              </div>
            </div>

            <div className="relative p-4 rounded-2xl bg-eko-emerald/5 border border-eko-emerald/20">
              <div className="absolute -top-3 left-4 bg-black px-2 text-xs font-bold text-eko-emerald flex items-center gap-1"><ShieldCheck size={12} /> PURIFIED</div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl font-display font-bold text-white">{indoorPM25}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Indoor PM2.5</div>
                </div>
                <div className="text-right"><div className="text-lg font-bold text-eko-emerald">{(indoorEff * 100).toFixed(1)}%</div><div className="text-[10px] text-eko-emerald/70">Efficiency</div></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Heart size={18} className="text-red-400" /> Health Impact</h3>
            <div className="space-y-2">
              <HealthMetric icon={Wind} label="Lungs (Respiratory)" status={calcPM25 > 50 ? 'Risk' : 'Safe'} delay={0.1} />
              <HealthMetric icon={Heart} label="Heart (Cardio)" status={calcPM25 > 100 ? 'Risk' : 'Safe'} delay={0.2} />
              <HealthMetric icon={Eye} label="Eyes / Vision" status={calcPM25 > 150 ? 'Irritation' : 'Safe'} delay={0.3} />
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3"><div className="text-xs font-mono text-gray-400 uppercase tracking-widest">Favorites</div><div className="text-xs text-gray-400 font-mono">Save/quick jump</div></div>
            <div className="space-y-2">
              {favorites.length === 0 && <div className="text-xs text-gray-500">No favorites yet — save a location to access it quickly.</div>}
              {favorites.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-white/3 border border-white/5 px-3 py-2 rounded">
                  <div className="text-sm"><div className="font-medium text-white">{f.name}</div><div className="text-xs text-gray-400">{formatISO(f.created)}</div></div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setCoords({ lat: f.lat, lng: f.lng }); setLocationName(f.name); }} className="px-2 py-1 text-xs bg-black/60 border border-white/10 rounded">Go</button>
                    <button type="button" onClick={() => removeFavorite(i)} className="px-2 py-1 text-xs bg-black/60 border border-white/10 rounded text-red-400" title="Remove favorite"><Trash size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3"><div className="text-xs font-mono text-gray-400 uppercase tracking-widest">Settings</div><Settings /></div>

            <div className="space-y-3">
              <div className="flex items-center justify-between"><div className="text-sm text-gray-300">Auto refresh</div><div className="flex items-center gap-2"><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="sr-only" /><div className={`w-10 h-5 rounded-full ${autoRefresh ? 'bg-eko-emerald' : 'bg-gray-600'}`} /></label></div></div>

              <div className="flex items-center justify-between"><div className="text-sm text-gray-300">Interval (s)</div><input type="number" min={10} value={refreshInterval} onChange={(e) => { const v = Number(e.target.value) || 10; setRefreshInterval(v); localStorage.setItem('refreshInterval', String(v)); }} className="w-20 bg-[#0b0b0b] border border-white/10 px-2 py-1 rounded text-sm text-white" /></div>

              <div className="flex items-center justify-between"><div className="text-sm text-gray-300">CSV delimiter</div><select value={csvDelimiter} onChange={(e) => { setCsvDelimiter(e.target.value); localStorage.setItem('csvDelimiter', e.target.value); }} className="bg-[#0b0b0b] border border-white/10 px-2 py-1 rounded text-sm text-white"><option value=",">Comma (,)</option><option value=";">Semicolon (;)</option><option value="	">Tab</option></select></div>

              <div className="flex items-center gap-2"><button type="button" onClick={clearStorage} disabled={clearing} className={`text-xs px-3 py-2 bg-black/70 border border-white/10 rounded ${clearing ? 'opacity-60 cursor-wait' : ''}`}>
                {clearing ? <Spinner size={14} /> : 'Clear storage'}</button><button type="button" onClick={() => { setShowRaw(true); setToasts({ show: true, message: 'Raw JSON opened' }); setTimeout(() => setToasts({ show: false, message: '' }), 1400); }} className="text-xs px-3 py-2 bg-black/70 border border-white/10 rounded">Open raw</button></div>
            </div>
          </GlassCard>
        </div>

        {/* BOTTOM: FULL SPECTRUM */}
        <div className="lg:col-span-12">
          <h3 className="text-white font-display text-2xl font-bold mb-6 flex items-center gap-3"><Beaker className="text-eko-emerald" /> Full Spectrum Chemistry<div className="ml-4 text-xs font-mono text-gray-400">Units: µg/m³</div></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{chemicals.map((chem, i) => (<ChemicalCard key={i} label={chem.label} formula={chem.formula} value={chem.val} unit={chem.unit} limit={chem.limit} delay={i * 0.1} />))}</div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
