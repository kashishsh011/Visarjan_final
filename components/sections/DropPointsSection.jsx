'use client';
/**
 * DropPointsSection.jsx
 *
 * Drop this component into your home-page scroll canvas BELOW WhatDoYouHave.
 * It reads the URL params set by WhatDoYouHave (m, loc, lat, lng),
 * shows the selected items as togglable filter chips, and passes the user's
 * locality coordinates to MapClient so the map opens centred on them.
 *
 * Required: give this section id="drop-points-section" (already set below)
 * so the scrollIntoView() call in WhatDoYouHave can find it.
 */
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// SSR-safe map import
const MapClient = dynamic(() => import('@/components/map/MapClient'), { ssr: false });

// Must match the keys in WhatDoYouHave ITEMS
const MATERIAL_MAP = {
  pop:     'PoP Idol',
  clay:    'Clay Idol',
  flowers: 'Flowers',
  coconut: 'Coconut',
  fullset: 'Full Pooja Set',
};

// All possible filter chips shown in the Drop Points section
const ALL_MATERIALS = [
  'Flowers', 'Nirmalya', 'PoP Idol',
  'Clay Idol', 'Full Pooja Set', 'Coconut', 'Prasad',
];

// Fallback coords if URL doesn't carry lat/lng (mirrors WhatDoYouHave LOCALITIES)
const LOCALITY_COORDS = {
  // Delhi NCR
  'Connaught Place': { lat: 28.6315, lng: 77.2167 },
  'Chandni Chowk':  { lat: 28.6581, lng: 77.2310 },
  'Karol Bagh':     { lat: 28.6510, lng: 77.1900 },
  'Lajpat Nagar':   { lat: 28.5672, lng: 77.2436 },
  'Saket':          { lat: 28.5245, lng: 77.2066 },
  'Dwarka':         { lat: 28.5921, lng: 77.0460 },
  'Rohini':         { lat: 28.7041, lng: 77.1025 },
  'Janakpuri':      { lat: 28.6219, lng: 77.0878 },
  'Pitampura':      { lat: 28.7027, lng: 77.1311 },
  'Noida':          { lat: 28.5355, lng: 77.3910 },
  'Gurgaon':        { lat: 28.4595, lng: 77.0266 },
  'Faridabad':      { lat: 28.4089, lng: 77.3178 },
  'Ghaziabad':      { lat: 28.6692, lng: 77.4538 },
  // Mumbai & Maharashtra
  'Mumbai':         { lat: 19.0760, lng: 72.8777 },
  'Andheri':        { lat: 19.1136, lng: 72.8697 },
  'Dadar':          { lat: 19.0178, lng: 72.8478 },
  'Bandra':         { lat: 19.0544, lng: 72.8405 },
  'Borivali':       { lat: 19.2307, lng: 72.8567 },
  'Thane':          { lat: 19.2183, lng: 72.9781 },
  'Navi Mumbai':    { lat: 19.0330, lng: 73.0297 },
  'Pune':           { lat: 18.5204, lng: 73.8567 },
  'Nashik':         { lat: 19.9975, lng: 73.7898 },
  'Nagpur':         { lat: 21.1458, lng: 79.0882 },
  // Karnataka
  'Bengaluru':      { lat: 12.9716, lng: 77.5946 },
  'Mysuru':         { lat: 12.2958, lng: 76.6394 },
  'Mangaluru':      { lat: 12.9141, lng: 74.8560 },
  // Tamil Nadu
  'Chennai':        { lat: 13.0827, lng: 80.2707 },
  'Coimbatore':     { lat: 11.0168, lng: 76.9558 },
  'Madurai':        { lat:  9.9252, lng: 78.1198 },
  // Telangana & Andhra
  'Hyderabad':      { lat: 17.3850, lng: 78.4867 },
  'Secunderabad':   { lat: 17.4399, lng: 78.4983 },
  'Visakhapatnam':  { lat: 17.6868, lng: 83.2185 },
  'Vijayawada':     { lat: 16.5062, lng: 80.6480 },
  // Kerala
  'Kochi':          { lat:  9.9312, lng: 76.2673 },
  'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
  // West Bengal
  'Kolkata':        { lat: 22.5726, lng: 88.3639 },
  'Howrah':         { lat: 22.5958, lng: 88.2636 },
  // Gujarat
  'Ahmedabad':      { lat: 23.0225, lng: 72.5714 },
  'Surat':          { lat: 21.1702, lng: 72.8311 },
  'Vadodara':       { lat: 22.3072, lng: 73.1812 },
  // Rajasthan
  'Jaipur':         { lat: 26.9124, lng: 75.7873 },
  'Udaipur':        { lat: 24.5854, lng: 73.7125 },
  'Jodhpur':        { lat: 26.2389, lng: 73.0243 },
  // Uttar Pradesh
  'Lucknow':        { lat: 26.8467, lng: 80.9462 },
  'Varanasi':       { lat: 25.3176, lng: 82.9739 },
  'Prayagraj':      { lat: 25.4358, lng: 81.8463 },
  'Agra':           { lat: 27.1767, lng: 78.0081 },
  'Mathura':        { lat: 27.4924, lng: 77.6737 },
  'Vrindavan':      { lat: 27.5794, lng: 77.7020 },
  'Kanpur':         { lat: 26.4499, lng: 80.3319 },
  'Ayodhya':        { lat: 26.7922, lng: 82.1998 },
  // Madhya Pradesh
  'Bhopal':         { lat: 23.2599, lng: 77.4126 },
  'Indore':         { lat: 22.7196, lng: 75.8577 },
  'Ujjain':         { lat: 23.1765, lng: 75.7885 },
  // Punjab & Haryana
  'Amritsar':       { lat: 31.6340, lng: 74.8723 },
  'Ludhiana':       { lat: 30.9010, lng: 75.8573 },
  'Chandigarh':     { lat: 30.7333, lng: 76.7794 },
  // Bihar
  'Patna':          { lat: 25.5941, lng: 85.1376 },
  'Gaya':           { lat: 24.7955, lng: 85.0002 },
  // Odisha
  'Bhubaneswar':    { lat: 20.2961, lng: 85.8245 },
  'Puri':           { lat: 19.8135, lng: 85.8312 },
  // Uttarakhand
  'Haridwar':       { lat: 29.9457, lng: 78.1642 },
  'Rishikesh':      { lat: 30.0869, lng: 78.2676 },
  'Dehradun':       { lat: 30.3165, lng: 78.0322 },
  // Assam
  'Guwahati':       { lat: 26.1445, lng: 91.7362 },
  // Goa
  'Panaji':         { lat: 15.4909, lng: 73.8278 },
  // Himachal
  'Shimla':         { lat: 31.1048, lng: 77.1734 },
};

const C = {
  saffron:     '#D4881A',
  saffronPale: '#FBE9C4',
  plum:        '#2D1B4E',
  plumMid:     'rgba(45,27,78,0.7)',
  plumLt:      'rgba(45,27,78,0.45)',
  border:      'rgba(45,27,78,0.12)',
  cream:       '#F0E2EE',
};

// ── Inner component (needs Suspense because it uses useSearchParams) ───────
function DropPointsInner() {
  const params = useSearchParams();
  const [filters, setFilters]           = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [localityName, setLocalityName] = useState('');

  // Sync state from URL params every time they change
  useEffect(() => {
    // Selected materials
    const mats = params.getAll('m');
    if (mats.length > 0) {
      setFilters(mats.map(m => MATERIAL_MAP[m]).filter(Boolean));
    }

    // User locality + coords
    const loc = params.get('loc');
    const lat = params.get('lat');
    const lng = params.get('lng');

    if (loc) {
      setLocalityName(loc);
      const coords =
        lat && lng
          ? { lat: parseFloat(lat), lng: parseFloat(lng) }
          : LOCALITY_COORDS[loc] ?? null;

      setUserLocation(coords ? { name: loc, ...coords } : null);
    }
  }, [params]);

  const toggleFilter = (mat) =>
    setFilters(prev =>
      prev.includes(mat) ? prev.filter(f => f !== mat) : [...prev, mat]
    );

  return (
    <section
      id="drop-points-section"
      style={{
        scrollMarginTop: 80,
        padding: 'clamp(48px,7vw,88px) clamp(20px,4vw,40px)',
        maxWidth: 1240,
        margin: '0 auto',
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 56px)',
          color: C.plum,
          marginBottom: 8,
          lineHeight: 1.1,
        }}>
          Drop Points Near You
        </h2>
        <p style={{ fontFamily: 'var(--font-hindi)', color: C.saffron, fontSize: '1.05rem', marginBottom: 8 }}>
          नज़दीकी संग्रह केंद्र
        </p>

        {localityName ? (
          <p style={{
            fontFamily: 'var(--font-body)',
            color: C.saffron,
            fontSize: '0.95rem',
            marginTop: 6,
          }}>
            📍 Showing results near <strong>{localityName}</strong>
            {filters.length > 0 && (
              <span style={{ color: C.plumLt }}>
                {' '}· filtered by {filters.join(', ')}
              </span>
            )}
          </p>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', color: C.plumLt, fontSize: '0.92rem' }}>
            8 verified eco-drop centres across Delhi · Tap a marker for details
          </p>
        )}
      </div>

      {/* ── Filter chips ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
        justifyContent: 'center', marginBottom: 24,
      }}>
        {ALL_MATERIALS.map(mat => {
          const active = filters.includes(mat);
          return (
            <button
              key={mat}
              onClick={() => toggleFilter(mat)}
              style={{
                padding: '8px 16px',
                fontSize: '0.82rem',
                borderRadius: 50,
                border: `1.5px solid ${active ? C.saffron : C.border}`,
                background: active ? C.saffron : 'rgba(255,255,255,0.85)',
                color: active ? 'white' : C.plum,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: active ? 600 : 400,
                transition: 'all 0.18s ease',
                boxShadow: active ? '0 4px 14px rgba(212,136,26,0.28)' : 'none',
              }}
            >
              {mat}
            </button>
          );
        })}

        {filters.length > 0 && (
          <button
            onClick={() => setFilters([])}
            style={{
              padding: '8px 16px', fontSize: '0.82rem', borderRadius: 50,
              border: '1.5px solid rgba(192,57,43,0.35)',
              background: 'transparent', color: '#C0392B',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              transition: 'all 0.18s',
            }}
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* ── Map ──────────────────────────────────────────────────────── */}
      <div style={{
        height: 'clamp(380px, 55vh, 560px)',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid rgba(232,135,26,0.22)',
        boxShadow: '0 8px 40px rgba(61,26,58,0.12)',
      }}>
        <MapClient filterMaterials={filters} userLocation={userLocation} />
      </div>

      {/* ── Legend ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 20, justifyContent: 'center',
        flexWrap: 'wrap', marginTop: 16,
      }}>
        <LegendItem
          dot="linear-gradient(135deg,#E8871A,#FFB347)"
          label="Eco drop point"
        />
        <LegendItem dot="#4285F4" label="Your locality" />
      </div>
    </section>
  );
}

function LegendItem({ dot, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: '0.8rem', color: C.plumLt, fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: 12, height: 12, borderRadius: '50%',
        background: dot, flexShrink: 0,
        border: '2px solid white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }} />
      {label}
    </div>
  );
}

// ── Public export (wrapped in Suspense for useSearchParams) ───────────────
export default function DropPointsSection() {
  return (
    <Suspense fallback={
      <div style={{
        height: 500, display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-body)', color: C.plumLt,
      }}>
        Loading map…
      </div>
    }>
      <DropPointsInner />
    </Suspense>
  );
}
