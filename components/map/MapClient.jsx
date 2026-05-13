'use client';     //map-client.jsx//
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// ── Hardcoded fallback data (also used by seed script) ────────────────────
const NGO_POINTS_FALLBACK = [
  // Delhi NCR
  {
    id: 1, name: "Yamuna Nadi Sewa Samiti",
    lat: 28.5677, lng: 77.2433,
    address: "Lajpat Nagar II, New Delhi",
    timing: "9 AM – 6 PM, Mon–Sat",
    materials: ["PoP Idol", "Flowers", "Coconut"],
    phone: "+91-11-29834721",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    id: 2, name: "Chintan Environmental Research",
    lat: 28.5244, lng: 77.2066,
    address: "Saket, New Delhi",
    timing: "10 AM – 5 PM, Mon–Fri",
    materials: ["Flowers", "Full Pooja Set"],
    phone: "+91-11-40615024",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    id: 3, name: "Wild Delhi",
    lat: 28.7041, lng: 77.1025,
    address: "Rohini Sector 9, New Delhi",
    timing: "8 AM – 7 PM, Daily",
    materials: ["Clay Idol", "Flowers", "Coconut"],
    phone: "+91-98101-23456",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    id: 4, name: "Waste Warriors Society",
    lat: 28.5921, lng: 77.0460,
    address: "Dwarka Sector 6, New Delhi",
    timing: "9 AM – 5 PM, Mon–Sat",
    materials: ["PoP Idol", "Clay Idol", "Full Pooja Set"],
    phone: "+91-11-25087432",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    id: 5, name: "Delhi Greens",
    lat: 28.6080, lng: 77.2940,
    address: "Mayur Vihar Phase 1, New Delhi",
    timing: "10 AM – 6 PM, Daily",
    materials: ["Flowers", "Coconut", "Full Pooja Set"],
    phone: "+91-98711-34567",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    id: 6, name: "Paryavaran Mitra",
    lat: 28.6519, lng: 77.1909,
    address: "Karol Bagh, New Delhi",
    timing: "9 AM – 4 PM, Mon–Sat",
    materials: ["PoP Idol", "Flowers"],
    phone: "+91-11-25714321",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    id: 7, name: "Earth Saviours Foundation",
    lat: 28.5355, lng: 77.3910,
    address: "Sector 44, Noida",
    timing: "8 AM – 6 PM, Daily",
    materials: ["Clay Idol", "PoP Idol", "Flowers", "Coconut"],
    phone: "+91-98102-65478",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    id: 8, name: "Haritima",
    lat: 28.4595, lng: 77.0266,
    address: "DLF Phase 2, Gurgaon",
    timing: "9 AM – 5 PM, Mon–Sat",
    materials: ["Full Pooja Set", "Flowers"],
    phone: "+91-98103-12345",
    city: "Delhi", type: "year_round", verified: true,
  },
  // Delhi NCR — newly verified
  {
    id: 9, name: "Aaruhi Enterprises (SavePrithvi Network)",
    lat: 28.5400, lng: 77.1300,
    address: "Sheetla Colony, Block-E, New Delhi",
    timing: "Ongoing temple pickups — call to confirm schedule",
    materials: ["Flowers"],
    phone: "+91-79821-02228",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    id: 10, name: "Visarjan.in (Doorstep Pickup)",
    lat: 28.6692, lng: 77.4538,
    address: "Ghaziabad / Noida / Greater Noida — doorstep pickup service",
    timing: "Book via visarjan.in; special drives during Aug–Oct",
    materials: ["PoP Idol", "Clay Idol", "Flowers", "Full Pooja Set"],
    phone: "",
    city: "Delhi", type: "year_round", verified: true,
  },
  // Mumbai
  {
    id: 11, name: "BMC Artificial Pond Network",
    lat: 19.0760, lng: 72.8777,
    address: "288+ locations citywide — find nearest via WhatsApp 8999-22-8999",
    timing: "Festival season: late Aug – early Sep (Ganesh Chaturthi)",
    materials: ["PoP Idol", "Clay Idol"],
    phone: "+91-89992-28999",
    city: "Mumbai", type: "festival", verified: true,
  },
  {
    id: 12, name: "Punaravartan by eCoexist",
    lat: 19.0178, lng: 72.8478,
    address: "Mumbai (citywide drives during festival close)",
    timing: "Active at end of Ganesh Chaturthi festival each year",
    materials: ["Clay Idol"],
    phone: "+91-90491-46644",
    city: "Mumbai", type: "festival", verified: true,
  },
  // Bengaluru
  {
    id: 13, name: "HSR Citizens Forum",
    lat: 12.9220, lng: 77.6510,
    address: "#963, 24th Cross, 16th Main, HSR Layout Sector 3, Bengaluru",
    timing: "Ongoing — contact hsrcitizenforum@gmail.com for schedule",
    materials: ["Clay Idol", "PoP Idol", "Flowers", "Full Pooja Set"],
    phone: "",
    city: "Bengaluru", type: "year_round", verified: true,
  },
  {
    id: 14, name: "BBMP Eco-Immersion Centres",
    lat: 12.9716, lng: 77.5946,
    address: "41 lakes + 462 mobile tanks citywide — check apps.bbmpgov.in for nearest",
    timing: "Festival season: Ganesh Chaturthi (Aug–Sep)",
    materials: ["Clay Idol"],
    phone: "",
    city: "Bengaluru", type: "festival", verified: true,
  },
  // Hyderabad
  {
    id: 15, name: "HolyWaste by Oorvi Sustainable Concepts",
    lat: 17.3850, lng: 78.4860,
    address: "Padmarao Nagar / Banjara Hills area, Hyderabad",
    timing: "Daily, year-round — collects from 40+ temples",
    materials: ["Flowers"],
    phone: "+91-93903-13664",
    city: "Hyderabad", type: "year_round", verified: true,
  },
  {
    id: 16, name: "GHMC Immersion Points",
    lat: 17.3616, lng: 78.4747,
    address: "73+ points citywide — check GHMC portal for nearest zone",
    timing: "Festival seasons: Ganesh Chaturthi and Durga Puja",
    materials: ["PoP Idol", "Clay Idol"],
    phone: "",
    city: "Hyderabad", type: "festival", verified: true,
  },
  // Chennai
  {
    id: 17, name: "OSR Trust",
    lat: 13.0418, lng: 80.2341,
    address: "Citywide collection service — book via osrtrust.com",
    timing: "Ongoing — contact for pickup schedule",
    materials: ["PoP Idol", "Clay Idol", "Flowers", "Full Pooja Set"],
    phone: "",
    city: "Chennai", type: "year_round", verified: true,
  },
];

// ── Saffron drop-point pin ────────────────────────────────────────────────
function saffronPin() {
  return L.divIcon({
    html: `
      <div style="position:relative;width:36px;height:44px;">
        <div style="
          width:36px;height:36px;
          background:linear-gradient(135deg,#E8871A,#FFB347);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 4px 16px rgba(232,135,26,0.55), 0 2px 6px rgba(0,0,0,0.18);
          position:absolute;top:0;left:0;
        "></div>
        <div style="
          width:10px;height:10px;
          background:white;
          border-radius:50%;
          position:absolute;
          top:13px;left:13px;
          opacity:0.9;
        "></div>
      </div>
    `,
    className: '',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
  });
}

// ── Blue "you are here" pulsing dot ──────────────────────────────────────
function userPin() {
  return L.divIcon({
    html: `
      <style>
        @keyframes youPulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      </style>
      <div style="position:relative;width:28px;height:28px;">
        <!-- Pulse ring -->
        <div style="
          width:28px;height:28px;
          background:rgba(66,133,244,0.35);
          border-radius:50%;
          position:absolute;
          animation: youPulse 2s ease-out infinite;
        "></div>
        <!-- Solid dot -->
        <div style="
          width:16px;height:16px;
          background:#4285F4;
          border:3px solid white;
          border-radius:50%;
          position:absolute;
          top:6px;left:6px;
          box-shadow:0 2px 8px rgba(66,133,244,0.55);
        "></div>
      </div>
    `,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

// ── Inner component: re-centres map when userLocation changes ─────────────
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom, { animate: true, duration: 0.8 });
  }, [center[0], center[1], zoom]); // eslint-disable-line
  return null;
}

// ── Main export ───────────────────────────────────────────────────────────
export default function MapClient({ filterMaterials = [], userLocation = null }) {
  const dropIcon = typeof window !== 'undefined' ? saffronPin() : null;
  const myDotIcon = typeof window !== 'undefined' ? userPin() : null;

  // Fetch live NGO data from API, fall back to hardcoded data
  const [ngoPoints, setNgoPoints] = useState(NGO_POINTS_FALLBACK);
  useEffect(() => {
    fetch('/api/ngos')
      .then(r => r.json())
      .then(res => { if (res.success && res.data.length > 0) setNgoPoints(res.data) })
      .catch(() => {}) // silently fall back to hardcoded data
  }, []);

  const visible = filterMaterials.length === 0
    ? ngoPoints
    : ngoPoints.filter(p => p.materials.some(m => filterMaterials.includes(m)));

  // Centre on user's locality if known, otherwise default India centre
  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [22.9074, 79.0730];
  const mapZoom = userLocation ? 13 : 5;

  return (
    <>
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #FFF8F0 !important;
          border: 1.5px solid rgba(232,135,26,0.25) !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(61,26,58,0.13) !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; padding: 0 !important; }
        .leaflet-popup-tip { background: #FFF8F0 !important; }
        .leaflet-popup-close-button { color: #E8871A !important; font-size: 18px !important; top: 8px !important; right: 10px !important; }
        .leaflet-control-zoom a { background: #FFF8F0 !important; color: #3D1A3A !important; border-color: rgba(232,135,26,0.3) !important; font-weight: 700 !important; }
        .leaflet-control-zoom a:hover { background: rgba(232,135,26,0.12) !important; }
        .leaflet-tile-pane { filter: saturate(0.85) brightness(1.02); }
      `}</style>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ width: '100%', height: '100%', borderRadius: 16 }}
        zoomControl
      >
        {/* ✅ Re-centres smoothly whenever userLocation changes */}
        <RecenterMap center={mapCenter} zoom={mapZoom} />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* ✅ Blue "You are here" marker — shown first, on top */}
        {myDotIcon && userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={myDotIcon} zIndexOffset={1000}>
            <Popup>
              <div style={{ fontFamily: "'DM Sans', sans-serif", padding: '14px 16px', color: '#3D1A3A', minWidth: 160 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                  📍 Your location
                </div>
                <div style={{ fontSize: '0.82rem', color: '#6B5B4E' }}>
                  {userLocation.name}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Saffron drop-point markers */}
        {dropIcon && visible.map((pt, i) => (
          <Marker key={pt.id || i} position={[pt.lat, pt.lng]} icon={dropIcon}>
            <Popup>
              <div style={{
                fontFamily: "'DM Sans', Georgia, serif",
                minWidth: 210, padding: '16px 18px', color: '#3D1A3A',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#3D1A3A', marginBottom: 6, lineHeight: 1.4, paddingRight: 16 }}>
                  {pt.name}
                </div>
                <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(232,135,26,0.4), transparent)', marginBottom: 8 }} />
                <div style={{ fontSize: '0.78rem', color: '#6B5B4E', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>⏰</span> {pt.timing}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B5B4E', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                  <span>📦</span>
                  <span>{pt.materials.join(', ')}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${pt.lat},${pt.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', padding: '7px 18px',
                    background: 'linear-gradient(135deg, #E8871A, #FFB347)',
                    color: 'white', borderRadius: 50, fontSize: '0.75rem',
                    fontWeight: 700, textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(232,135,26,0.35)',
                  }}
                >
                  Get Directions →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}