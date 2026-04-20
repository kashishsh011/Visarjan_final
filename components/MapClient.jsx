'use client';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

function orangeIcon() {
  return L.divIcon({
    html: `<div style="width:30px;height:30px;background:radial-gradient(circle at 40% 35%,#FFD700,#FF6B00);border-radius:50%;border:2.5px solid rgba(255,255,255,0.85);box-shadow:0 0 18px rgba(255,107,0,0.7),0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:13px;">🌸</div>`,
    className: '', iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -18],
  });
}

export default function MapClient({ filterMaterials = [] }) {
  const icon = typeof window !== 'undefined' ? orangeIcon() : null;
  const visible = filterMaterials.length === 0
    ? NGO_POINTS
    : NGO_POINTS.filter(p => p.materials.some(m => filterMaterials.includes(m)));

  return (
    <MapContainer center={[28.6139, 77.2090]} zoom={11}
      style={{ width: '100%', height: '100%', borderRadius: 16 }} zoomControl>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {icon && visible.map((pt, i) => (
        <Marker key={i} position={[pt.lat, pt.lng]} icon={icon}>
          <Popup>
            <div style={{ fontFamily: 'serif', minWidth: 210 }}>
              <div style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: '0.82rem', color: '#FFB300', marginBottom: 6, fontWeight: 700, lineHeight: 1.4 }}>
                {pt.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,245,224,0.75)', marginBottom: 3 }}>⏰ {pt.timing}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,245,224,0.65)', marginBottom: 12 }}>📦 {pt.materials.join(', ')}</div>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${pt.lat},${pt.lng}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', padding: '7px 16px', background: 'linear-gradient(135deg,#FF6B00,#FFB300)', color: 'white', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                Get Directions →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
