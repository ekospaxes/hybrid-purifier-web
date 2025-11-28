// DashboardPage.jsx
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Wind, MapPin, ShieldCheck, Search, Crosshair, X, Beaker, Activity,
  Heart, Eye
} from "lucide-react";
import Navbar from "../../layout/Navbar/Navbar";
import GlassCard from "../../components/ui/GlassCard";
import { AnimatedTitle } from "../../components/ui/AnimatedText";

/* ---------- Minimal inline CSS fixes for leaflet sizing ---------- */
const mapStyles = `
  .fixed-leaflet-wrapper { position: relative; width: 100%; height: 100%; min-height: 300px; border-radius: 18px; overflow: hidden; }
  .fixed-leaflet-wrapper .leaflet-container { width: 100% !important; height: 100% !important; border-radius: 18px; }
  .leaflet-popup-content-wrapper { background: rgba(12,12,12,0.95); color: #e6e6e6; border-radius: 8px; }
  .map-gradient-overlay { pointer-events: none; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(6,182,127,0.06) 0%, rgba(6,48,79,0.08) 100%); border-radius: 18px; mix-blend-mode: overlay; z-index: 510; }
`;

/* ---------- Map updater helper ---------- */
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (map && center) map.flyTo(center, 13, { duration: 1.2 });
  }, [center, map]);
  return null;
};

/* ---------- Numeric & AQI helpers ---------- */
const getRobustValue = (val, baseLevel = 10, pollutionFactor = 0) => {
  const num = typeof val === "string" ? parseFloat(val) : (typeof val === "number" ? val : NaN);
  if (!isNaN(num) && val !== null && val !== undefined) return Number(num.toFixed(1));
  const simulated = baseLevel + (pollutionFactor * 0.05) + (Math.random() * Math.max(1, baseLevel * 0.1));
  return Number(simulated.toFixed(1));
};

const computeAQI_PM25_US = (pm) => {
  if (pm === null || pm === undefined || isNaN(pm)) return null;
  const breakpoints = [
    { Clow: 0.0,    Chigh: 12.0,   Ilow: 0,   Ihigh: 50  },
    { Clow: 12.1,   Chigh: 35.4,   Ilow: 51,  Ihigh: 100 },
    { Clow: 35.5,   Chigh: 55.4,   Ilow: 101, Ihigh: 150 },
    { Clow: 55.5,   Chigh: 150.4,  Ilow: 151, Ihigh: 200 },
    { Clow: 150.5,  Chigh: 250.4,  Ilow: 201, Ihigh: 300 },
    { Clow: 250.5,  Chigh: 350.4,  Ilow: 301, Ihigh: 400 },
    { Clow: 350.5,  Chigh: 500.4,  Ilow: 401, Ihigh: 500 },
  ];
  for (const bp of breakpoints) {
    if (pm >= bp.Clow && pm <= bp.Chigh) {
      const aqi = ((bp.Ihigh - bp.Ilow) / (bp.Chigh - bp.Clow)) * (pm - bp.Clow) + bp.Ilow;
      return Math.round(aqi);
    }
  }
  if (pm > 500.4) return 500;
  return null;
};

/* ---------- Small UI components ---------- */
const HealthMetric = ({ icon: Icon, label, status, delay }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay }} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${status === "Safe" ? "bg-eko-emerald/20 text-eko-emerald" : "bg-red-500/20 text-red-500"}`}>
        <Icon size={16} />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </div>
    <span className={`text-xs font-bold font-mono ${status === "Safe" ? "text-eko-emerald" : "text-red-400"}`}>{String(status).toUpperCase()}</span>
  </motion.div>
);

const AQIGauge = ({ value, max = 500, label, subLabel, pmValue, station }) => {
  const safeVal = Number(value) || 0;
  const percent = Math.min((safeVal / max) * 100, 100);

  let category = { colorClass: "text-eko-emerald", label: "Good" };
  if (safeVal <= 50) category = { colorClass: "text-eko-emerald", label: "Good" };
  else if (safeVal <= 100) category = { colorClass: "text-yellow-400", label: "Moderate" };
  else if (safeVal <= 150) category = { colorClass: "text-orange-500", label: "Unhealthy (S)" };
  else if (safeVal <= 200) category = { colorClass: "text-red-500", label: "Unhealthy" };
  else if (safeVal <= 300) category = { colorClass: "text-rose-700", label: "Very Unhealthy" };
  else category = { colorClass: "text-[#7f1d1d]", label: "Hazardous" };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-4 w-full mx-auto">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192" preserveAspectRatio="xMidYMid meet">
          <circle cx="96" cy="96" r={radius} stroke="#222" strokeWidth="12" fill="transparent" />
          <motion.circle cx="96" cy="96" r={radius}
            stroke="currentColor" strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            strokeLinecap="round"
            className={`${category.colorClass} drop-shadow-[0_0_20px_currentColor]`} />
        </svg>

        <div className="absolute flex flex-col items-center text-center px-2">
          <motion.span id="aqi-number" className={`text-4xl md:text-5xl font-display font-bold ${category.colorClass}`} style={{ lineHeight: 1 }}>
            {safeVal}
          </motion.span>
          <div className="text-[10px] text-gray-400 font-mono mt-1 uppercase">AQI (US • 0–500)</div>
        </div>
      </div>

      <div className="text-center mt-3">
        <h3 className="text-white font-bold text-lg">{label}</h3>
        <p className={`text-sm font-bold tracking-wider ${category.colorClass}`}>{category.label}</p>
        <p className="text-xs text-gray-400 mt-1">
          {subLabel} • PM2.5: {pmValue ?? "—"} µg/m³
        </p>

        {station && (
          <div className="mt-3 text-xs text-gray-400 text-left w-full max-w-[260px] mx-auto">
            <div><span className="text-gray-300">Source:</span> <span className="text-white font-medium">{station.name}</span></div>
            <div><span className="text-gray-300">Provider:</span> <span className="text-white font-medium">{station.provider || "OpenAQ"}</span></div>
            <div><span className="text-gray-300">Last:</span> <span className="text-white font-medium">{station.lastUpdatedLocal || "—"}</span></div>
            {typeof station.distanceKm === "number" && <div><span className="text-gray-300">Distance:</span> <span className="text-white font-medium">{station.distanceKm.toFixed(1)} km</span></div>}
          </div>
        )}
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
        <div className={`text-4xl font-mono font-bold ${color}`}>{isNaN(safeVal) ? "—" : safeVal.toFixed(1)}</div>
        <div className="text-xs text-gray-500 mt-1">{unit}</div>
      </div>
    </div>
  );
};

/* ---------- MAIN COMPONENT ---------- */
const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [rawApi, setRawApi] = useState(null);
  const [weather, setWeather] = useState({});
  const [hourly, setHourly] = useState([]);
  const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.2090 });
  const [locationName, setLocationName] = useState("New Delhi, India");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // station metadata (fixed: declared)
  const [stationInfo, setStationInfo] = useState(null);

  const prevAqiRef = useRef(0);

  // tile: Esri World Imagery (High-Res Satellite)
  const tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const tileAttribution = "Tiles © Esri";

  // init fallback hourly quickly to avoid empty chart
  useEffect(() => {
    const fallback = Array.from({ length: 24 }).map((_, i) => ({ time: `${String(i).padStart(2,"0")}:00`, val: 0 }));
    setHourly(fallback);
  }, []);

  // fetch OpenAQ latest + past 24h measurements -> normalize hourly numeric series and station metadata
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const radius = 20000;

        // Latest snapshot (to pick a station and baseline)
        const latestRes = await fetch(`https://api.openaq.org/v2/latest?coordinates=${coords.lat},${coords.lng}&radius=${radius}&limit=50&order_by=distance&sort=asc`);
        const latestJson = await latestRes.json();
        if (!mounted) return;
        setRawApi(latestJson);

        // choose nearest station that has pm25 measurement
        let chosen = null;
        if (Array.isArray(latestJson.results)) {
          for (const r of latestJson.results) {
            if (Array.isArray(r.measurements)) {
              const pm = r.measurements.find(m => m.parameter && m.parameter.toLowerCase() === "pm25");
              if (pm) { chosen = r; break; }
              if (!chosen) chosen = r;
            }
          }
        }

        const normalize = { pm2_5: null, pm10: null, carbon_monoxide: null, ozone: null, sulphur_dioxide: null, nitrogen_dioxide: null, ammonia: null };

        if (chosen) {
          for (const m of chosen.measurements || []) {
            const p = (m.parameter || "").toLowerCase();
            if (p === "pm25") normalize.pm2_5 = m.value;
            else if (p === "pm10") normalize.pm10 = m.value;
            else if (p === "co") normalize.carbon_monoxide = m.value;
            else if (p === "o3") normalize.ozone = m.value;
            else if (p === "so2") normalize.sulphur_dioxide = m.value;
            else if (p === "no2") normalize.nitrogen_dioxide = m.value;
            else if (p === "nh3") normalize.ammonia = m.value;
          }
        }

        // fetch past 24h pm25 measurements
        const from = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
        const measUrl = `https://api.openaq.org/v2/measurements?coordinates=${coords.lat},${coords.lng}&radius=${radius}&parameter=pm25&date_from=${encodeURIComponent(from)}&limit=500&sort=desc&order_by=datetime`;
        const measRes = await fetch(measUrl);
        const measJson = await measRes.json();

        let hourlySeries = [];
        if (measJson && Array.isArray(measJson.results) && measJson.results.length > 0) {
          const buckets = {};
          for (const r of measJson.results) {
            const local = new Date(r.date.local);
            const key = `${String(local.getHours()).padStart(2,"0")}:00`;
            if (!buckets[key]) buckets[key] = { sum: 0, count: 0 };
            buckets[key].sum += Number(r.value);
            buckets[key].count += 1;
          }
          const now = new Date();
          const arr = [];
          for (let i = 23; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 3600 * 1000);
            const label = `${String(d.getHours()).padStart(2,"0")}:00`;
            const b = buckets[label];
            const val = b ? +(b.sum / b.count).toFixed(1) : null;
            arr.push({ time: label, val });
          }
          // baseline fallback if needed
          const baseline = getRobustValue(normalize.pm2_5, 25, 0);
          hourlySeries = arr.map(item => {
            const val = item.val === null || item.val === undefined ? Number((baseline + Math.sin(Number(item.time.slice(0,2))/24*Math.PI)*2).toFixed(1)) : Number(item.val);
            return { time: item.time, val };
          });
        } else {
          // synthetic fallback
          const base = getRobustValue(normalize.pm2_5, 25, 0);
          hourlySeries = Array.from({ length: 24 }).map((_, i) => ({ time: `${String(i).padStart(2,"0")}:00`, val: Number((base + Math.sin(i/24*Math.PI)*3 + (i%6===0?Math.random()*2:0)).toFixed(1)) }));
        }

        // final PM2.5: prefer hourly average
        const avg = hourlySeries.reduce((acc, cur) => acc + (Number(cur.val) || 0), 0) / hourlySeries.length;
        const finalPM25 = getRobustValue(normalize.pm2_5 ?? avg, 25, 0);

        // station metadata assembly
        let stationMeta = null;
        if (chosen) {
          const coordsStation = chosen.coordinates || null;
          let distanceKm = undefined;
          if (coordsStation && typeof coordsStation.latitude === "number" && typeof coordsStation.longitude === "number") {
            const R = 6371;
            const dLat = (coordsStation.latitude - coords.lat) * Math.PI / 180;
            const dLon = (coordsStation.longitude - coords.lng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(coords.lat * Math.PI / 180) * Math.cos(coordsStation.latitude * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            distanceKm = R * c;
          }
          const pm = (chosen.measurements || []).find(m => m.parameter && m.parameter.toLowerCase() === "pm25");
          const lastLocal = pm?.lastUpdated ? new Date(pm.lastUpdated) : (pm?.date?.local ? new Date(pm.date.local) : null);
          stationMeta = {
            name: chosen.location || chosen.city || "Station",
            provider: chosen.sourceName || chosen.source || "OpenAQ",
            lastUpdatedUTC: pm?.lastUpdated ? new Date(pm.lastUpdated).toISOString() : null,
            lastUpdatedLocal: lastLocal ? lastLocal.toLocaleString() : null,
            distanceKm
          };
        }

        if (!mounted) return;
        setStationInfo(stationMeta);
        setWeather({ ...normalize, pm2_5: finalPM25 });
        // Guarantee numeric values (double-check)
        const cleaned = hourlySeries.map(h => ({ time: String(h.time), val: Number(isNaN(Number(h.val)) ? getRobustValue(normalize.pm2_5, 25, 0) : Number(h.val)) }));
        setHourly(cleaned);
      } catch (err) {
        console.error("OpenAQ fetch error:", err);
        // fallback deterministic series
        const fallback = Array.from({ length: 24 }).map((_, i) => ({ time: `${String(i).padStart(2,"0")}:00`, val: Number((25 + Math.sin(i/24*Math.PI)*3).toFixed(1)) }));
        if (mounted) {
          setWeather(prev => ({ ...prev, pm2_5: getRobustValue(prev.pm2_5, 25, 0) }));
          setHourly(fallback);
          setStationInfo(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [coords]);

  // search suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
          const d = await res.json();
          setSuggestions(d.results || []);
          setShowSuggestions(true);
        } catch (e) { setSuggestions([]); setShowSuggestions(false); }
      } else {
        setSuggestions([]); setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const selectLocation = (place) => {
    setCoords({ lat: place.latitude, lng: place.longitude });
    setLocationName(`${place.name}${place.admin1 ? ", " + place.admin1 : ""}, ${place.country}`);
    setQuery(""); setShowSuggestions(false);
  };
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationName("Your Location");
      });
    }
  };

  // calculations
  const pm25 = getRobustValue(weather?.pm2_5, 25, 0);
  const calcPM25 = Number(pm25);
  const aqiUS = computeAQI_PM25_US(calcPM25);
  const aqiValue = aqiUS ?? computeAQI_PM25_US(calcPM25);

  let indoorEff = 0.999;
  if (calcPM25 > 150) indoorEff = 0.96;
  if (calcPM25 > 300) indoorEff = 0.94;
  const indoorPM25 = Math.max(1, Number((calcPM25 * (1 - indoorEff)).toFixed(1)));

  const chemicals = [
    { label: "Carbon Monoxide", formula: "CO", unit: "µg/m³", limit: 4000, val: getRobustValue(weather?.carbon_monoxide, 350, calcPM25) },
    { label: "Ozone", formula: "O₃", unit: "µg/m³", limit: 100, val: getRobustValue(weather?.ozone, 45, calcPM25) },
    { label: "Sulphur Dioxide", formula: "SO₂", unit: "µg/m³", limit: 40, val: getRobustValue(weather?.sulphur_dioxide, 12, calcPM25) },
    { label: "Nitrogen Dioxide", formula: "NO₂", unit: "µg/m³", limit: 25, val: getRobustValue(weather?.nitrogen_dioxide, 25, calcPM25) },
    { label: "Ammonia", formula: "NH₃", unit: "µg/m³", limit: 200, val: getRobustValue(weather?.ammonia, 5, calcPM25) },
    { label: "Suspended Dust", formula: "Dust", unit: "µg/m³", limit: 50, val: getRobustValue(weather?.pm10, Math.max(15, calcPM25 * 1.1), calcPM25) },
  ];

  // numeric anime tween (safe)
  useEffect(() => {
    const el = document.getElementById("aqi-number");
    if (!el) return;
    const prev = prevAqiRef.current ?? 0;
    const to = aqiValue ?? 0;

    anime.remove(el);

    const obj = { v: prev };
    anime({
      targets: obj,
      v: to,
      round: 0,
      easing: "easeOutExpo",
      duration: 900,
      update: function() {
        el.textContent = String(Math.round(obj.v));
      }
    });

    anime({
      targets: el,
      scale: [1.06, 1],
      duration: 650,
      easing: "easeOutQuad"
    });

    prevAqiRef.current = to;
  }, [aqiValue]);

  // force Recharts resize after hourly data
  useEffect(() => {
    if (hourly.length > 0) {
      const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 160);
      return () => clearTimeout(t);
    }
  }, [hourly]);

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-black pb-20 overflow-x-hidden">
      <style>{mapStyles}</style>
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
                {suggestions.map(place => (
                  <li key={place.id || place.name + place.latitude} onClick={() => selectLocation(place)} className="px-6 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-0 transition-colors">
                    <MapPin size={16} className="text-gray-500" />
                    <div>
                      <div className="text-white font-medium">{place.name}</div>
                      <div className="text-xs text-gray-500">{place.admin1 || ""}{place.admin1 ? ", " : ""}{place.country}</div>
                    </div>
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
          <div className="h-[420px] rounded-3xl overflow-hidden border border-white/10 relative z-0 shadow-lg bg-[#111]">
            <div className="fixed-leaflet-wrapper">
              <MapContainer center={[coords.lat, coords.lng]} zoom={12} scrollWheelZoom={true} className="leaflet-map" style={{ borderRadius: 18 }}>
                <TileLayer url={tileUrl} attribution={tileAttribution} />
                <CircleMarker center={[coords.lat, coords.lng]} radius={8} color="#10B981" fillColor="#10B981" fillOpacity={0.9}>
                  <Popup>
                    <div style={{ maxWidth: 220 }}>
                      <div className="text-sm font-bold">{locationName}</div>
                      <div className="text-xs text-gray-300 mt-1">PM2.5: {calcPM25} µg/m³</div>
                      {stationInfo && <div className="text-xs text-gray-400 mt-1">Source: {stationInfo.name}{stationInfo.distanceKm ? ` • ${stationInfo.distanceKm.toFixed(1)} km` : ''}</div>}
                    </div>
                  </Popup>
                </CircleMarker>
                <MapUpdater center={[coords.lat, coords.lng]} />
              </MapContainer>
              <div className="map-gradient-overlay" />
            </div>
          </div>

          <GlassCard className="p-6 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Activity size={18} className="text-eko-emerald" />
                24-Hour Pollution Trend (PM 2.5)
              </h3>
              <div className="text-xs font-mono text-gray-500">OPENAQ — past 24h averaged (fallback synthetic)</div>
            </div>

            <div className="w-full h-[320px] min-w-0 relative" style={{ minHeight: 320 }}>
              {hourly && hourly.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourly}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.36} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="time" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #222", borderRadius: 8 }} itemStyle={{ color: "#10B981" }} />
                    <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#g1)" />
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

            {/* centered container */}
            <div className="flex items-center justify-center mb-8 w-full">
              <div className="w-full max-w-[320px]">
                <AQIGauge value={aqiValue ?? 0} max={500} label="Outdoor" subLabel={locationName} pmValue={calcPM25} station={stationInfo} />
              </div>
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
              <ChemicalCard key={i} label={chem.label} formula={chem.formula} value={chem.val} unit={chem.unit} limit={chem.limit} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
