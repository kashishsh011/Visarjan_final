'use client';     //map-client.jsx//
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

export const NGO_POINTS = [
  { name: "Phool NGO - Connaught Place", lat: 28.6315, lng: 77.2167, materials: ["Flowers", "Nirmalya"], timing: "7am–8pm" },
  { name: "eCoexist Hub - Lajpat Nagar", lat: 28.5672, lng: 77.2436, materials: ["PoP Idol", "Clay Idol"], timing: "8am–7pm" },
  { name: "Holywaste - Dwarka", lat: 28.5921, lng: 77.0460, materials: ["Full Pooja Set", "Coconut"], timing: "6am–9pm" },
  { name: "Sampurnam - Rohini", lat: 28.7041, lng: 77.1025, materials: ["Flowers", "Prasad"], timing: "7am–8pm" },
  { name: "GreenVidai - Saket", lat: 28.5245, lng: 77.2066, materials: ["PoP Idol", "Clay Idol", "Flowers"], timing: "9am–6pm" },
  { name: "YamunaClean - Noida Sec 18", lat: 28.5706, lng: 77.3219, materials: ["Full Pooja Set"], timing: "8am–8pm" },
  { name: "PrakritiSeva - Pitampura", lat: 28.7027, lng: 77.1311, materials: ["Nirmalya", "Coconut"], timing: "7am–7pm" },
  { name: "EcoVisarjan - Janakpuri", lat: 28.6219, lng: 77.0878, materials: ["Clay Idol", "Flowers"], timing: "6am–8pm" },
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

  const visible = filterMaterials.length === 0
    ? NGO_POINTS
    : NGO_POINTS.filter(p => p.materials.some(m => filterMaterials.includes(m)));

  // Centre on user's locality if known, otherwise default Delhi centre
  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [28.6139, 77.2090];
  const mapZoom = userLocation ? 13 : 11;

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
          <Marker key={i} position={[pt.lat, pt.lng]} icon={dropIcon}>
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