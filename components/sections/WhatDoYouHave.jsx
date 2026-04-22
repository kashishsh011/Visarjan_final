'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IdolAnalyzer from '@/components/sections/IdolAnalyzer';

const C = {
  cream: '#F0E2EE',
  saffron: '#D4881A',
  saffronPale: '#FBE9C4',
  saffronLt: 'rgba(212,136,26,0.4)',
  terracotta: '#2D1B4E',
  brownDeep: '#2D1B4E',
  brownMid: 'rgba(45, 27, 78, 0.8)',
  brownLt: 'rgba(45, 27, 78, 0.5)',
  creamBorder: 'rgba(45, 27, 78, 0.12)',
};

const ITEMS = [
  { key: 'pop', label: 'PoP Idol', icon: '🏺' },
  { key: 'clay', label: 'Clay Idol', icon: '🪔' },
  { key: 'flowers', label: 'Flowers / Nirmalya', icon: '🌸' },
  { key: 'coconut', label: 'Coconut / Prasad', icon: '🥥' },
  { key: 'fullset', label: 'Full Pooja Set', icon: '🙏' },
];

// Localities across India — used for autocomplete & map centring
const LOCALITIES = [
  // ── Delhi NCR ───────────────────────────────────────────────
  { name: 'Connaught Place', zone: 'Delhi', lat: 28.6315, lng: 77.2167 },
  { name: 'Chandni Chowk', zone: 'Delhi', lat: 28.6581, lng: 77.2310 },
  { name: 'Karol Bagh', zone: 'Delhi', lat: 28.6510, lng: 77.1900 },
  { name: 'Lajpat Nagar', zone: 'Delhi', lat: 28.5672, lng: 77.2436 },
  { name: 'Saket', zone: 'Delhi', lat: 28.5245, lng: 77.2066 },
  { name: 'Dwarka', zone: 'Delhi', lat: 28.5921, lng: 77.0460 },
  { name: 'Rohini', zone: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Janakpuri', zone: 'Delhi', lat: 28.6219, lng: 77.0878 },
  { name: 'Pitampura', zone: 'Delhi', lat: 28.7027, lng: 77.1311 },
  { name: 'Noida', zone: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
  { name: 'Gurgaon', zone: 'Haryana', lat: 28.4595, lng: 77.0266 },
  { name: 'Faridabad', zone: 'Haryana', lat: 28.4089, lng: 77.3178 },
  { name: 'Ghaziabad', zone: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },

  // ── Mumbai & Maharashtra ─────────────────────────────────────
  { name: 'Mumbai', zone: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Andheri', zone: 'Mumbai', lat: 19.1136, lng: 72.8697 },
  { name: 'Dadar', zone: 'Mumbai', lat: 19.0178, lng: 72.8478 },
  { name: 'Bandra', zone: 'Mumbai', lat: 19.0544, lng: 72.8405 },
  { name: 'Borivali', zone: 'Mumbai', lat: 19.2307, lng: 72.8567 },
  { name: 'Thane', zone: 'Maharashtra', lat: 19.2183, lng: 72.9781 },
  { name: 'Navi Mumbai', zone: 'Maharashtra', lat: 19.0330, lng: 73.0297 },
  { name: 'Pune', zone: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Shivajinagar', zone: 'Pune', lat: 18.5308, lng: 73.8475 },
  { name: 'Nashik', zone: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Aurangabad', zone: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
  { name: 'Nagpur', zone: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Kolhapur', zone: 'Maharashtra', lat: 16.7050, lng: 74.2433 },
  { name: 'Solapur', zone: 'Maharashtra', lat: 17.6805, lng: 75.9064 },

  // ── Karnataka ────────────────────────────────────────────────
  { name: 'Bengaluru', zone: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Indiranagar', zone: 'Bengaluru', lat: 12.9716, lng: 77.6412 },
  { name: 'Koramangala', zone: 'Bengaluru', lat: 12.9352, lng: 77.6245 },
  { name: 'Whitefield', zone: 'Bengaluru', lat: 12.9698, lng: 77.7499 },
  { name: 'Mysuru', zone: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { name: 'Mangaluru', zone: 'Karnataka', lat: 12.9141, lng: 74.8560 },
  { name: 'Hubballi', zone: 'Karnataka', lat: 15.3647, lng: 75.1240 },
  { name: 'Udupi', zone: 'Karnataka', lat: 13.3409, lng: 74.7421 },

  // ── Tamil Nadu ───────────────────────────────────────────────
  { name: 'Chennai', zone: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'T. Nagar', zone: 'Chennai', lat: 13.0418, lng: 80.2341 },
  { name: 'Anna Nagar', zone: 'Chennai', lat: 13.0891, lng: 80.2109 },
  { name: 'Coimbatore', zone: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', zone: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { name: 'Tiruchirappalli', zone: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
  { name: 'Salem', zone: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
  { name: 'Tirunelveli', zone: 'Tamil Nadu', lat: 8.7139, lng: 77.7567 },

  // ── Telangana & Andhra ───────────────────────────────────────
  { name: 'Hyderabad', zone: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Banjara Hills', zone: 'Hyderabad', lat: 17.4100, lng: 78.4400 },
  { name: 'Secunderabad', zone: 'Telangana', lat: 17.4399, lng: 78.4983 },
  { name: 'Warangal', zone: 'Telangana', lat: 17.9689, lng: 79.5941 },
  { name: 'Visakhapatnam', zone: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { name: 'Vijayawada', zone: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  { name: 'Tirupati', zone: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },

  // ── Kerala ───────────────────────────────────────────────────
  { name: 'Kochi', zone: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Thiruvananthapuram', zone: 'Kerala', lat: 8.5241, lng: 76.9366 },
  { name: 'Kozhikode', zone: 'Kerala', lat: 11.2588, lng: 75.7804 },
  { name: 'Thrissur', zone: 'Kerala', lat: 10.5276, lng: 76.2144 },

  // ── West Bengal ──────────────────────────────────────────────
  { name: 'Kolkata', zone: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Howrah', zone: 'West Bengal', lat: 22.5958, lng: 88.2636 },
  { name: 'Salt Lake', zone: 'Kolkata', lat: 22.5867, lng: 88.4018 },
  { name: 'Dum Dum', zone: 'Kolkata', lat: 22.6200, lng: 88.3964 },
  { name: 'Siliguri', zone: 'West Bengal', lat: 26.7271, lng: 88.3953 },
  { name: 'Durgapur', zone: 'West Bengal', lat: 23.5204, lng: 87.3119 },

  // ── Gujarat ──────────────────────────────────────────────────
  { name: 'Ahmedabad', zone: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Surat', zone: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { name: 'Vadodara', zone: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  { name: 'Rajkot', zone: 'Gujarat', lat: 22.3039, lng: 70.8022 },
  { name: 'Gandhinagar', zone: 'Gujarat', lat: 23.2156, lng: 72.6369 },
  { name: 'Somnath', zone: 'Gujarat', lat: 20.8880, lng: 70.4012 },
  { name: 'Dwarka', zone: 'Gujarat', lat: 22.2393, lng: 68.9678 },

  // ── Rajasthan ────────────────────────────────────────────────
  { name: 'Jaipur', zone: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Udaipur', zone: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
  { name: 'Jodhpur', zone: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { name: 'Ajmer', zone: 'Rajasthan', lat: 26.4499, lng: 74.6399 },
  { name: 'Pushkar', zone: 'Rajasthan', lat: 26.4899, lng: 74.5513 },
  { name: 'Kota', zone: 'Rajasthan', lat: 25.2138, lng: 75.8648 },

  // ── Uttar Pradesh ────────────────────────────────────────────
  { name: 'Lucknow', zone: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Varanasi', zone: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Prayagraj', zone: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
  { name: 'Agra', zone: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'Mathura', zone: 'Uttar Pradesh', lat: 27.4924, lng: 77.6737 },
  { name: 'Vrindavan', zone: 'Uttar Pradesh', lat: 27.5794, lng: 77.7020 },
  { name: 'Kanpur', zone: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { name: 'Ayodhya', zone: 'Uttar Pradesh', lat: 26.7922, lng: 82.1998 },

  // ── Madhya Pradesh ───────────────────────────────────────────
  { name: 'Bhopal', zone: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Indore', zone: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Ujjain', zone: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },
  { name: 'Jabalpur', zone: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },

  // ── Punjab & Haryana ─────────────────────────────────────────
  { name: 'Amritsar', zone: 'Punjab', lat: 31.6340, lng: 74.8723 },
  { name: 'Ludhiana', zone: 'Punjab', lat: 30.9010, lng: 75.8573 },
  { name: 'Chandigarh', zone: 'Punjab / Haryana', lat: 30.7333, lng: 76.7794 },
  { name: 'Jalandhar', zone: 'Punjab', lat: 31.3260, lng: 75.5762 },

  // ── Bihar & Jharkhand ────────────────────────────────────────
  { name: 'Patna', zone: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Gaya', zone: 'Bihar', lat: 24.7955, lng: 85.0002 },
  { name: 'Ranchi', zone: 'Jharkhand', lat: 23.3441, lng: 85.3096 },

  // ── Odisha ───────────────────────────────────────────────────
  { name: 'Bhubaneswar', zone: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { name: 'Puri', zone: 'Odisha', lat: 19.8135, lng: 85.8312 },
  { name: 'Cuttack', zone: 'Odisha', lat: 20.4625, lng: 85.8828 },

  // ── Uttarakhand ──────────────────────────────────────────────
  { name: 'Haridwar', zone: 'Uttarakhand', lat: 29.9457, lng: 78.1642 },
  { name: 'Rishikesh', zone: 'Uttarakhand', lat: 30.0869, lng: 78.2676 },
  { name: 'Dehradun', zone: 'Uttarakhand', lat: 30.3165, lng: 78.0322 },

  // ── Assam & North East ───────────────────────────────────────
  { name: 'Guwahati', zone: 'Assam', lat: 26.1445, lng: 91.7362 },
  { name: 'Dibrugarh', zone: 'Assam', lat: 27.4728, lng: 94.9120 },

  // ── Goa ──────────────────────────────────────────────────────
  { name: 'Panaji', zone: 'Goa', lat: 15.4909, lng: 73.8278 },
  { name: 'Margao', zone: 'Goa', lat: 15.2832, lng: 73.9862 },

  // ── Himachal Pradesh ─────────────────────────────────────────
  { name: 'Shimla', zone: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
];

export default function WhatDoYouHave() {
  const router = useRouter();
  const [selected, setSelected] = useState(new Set());
  const [aiOpen, setAiOpen] = useState(false);
  const [locality, setLocality] = useState('');
  const [ddOpen, setDdOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const togglePill = (key) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAI = () => {
    setAiOpen(prev => {
      const isOpening = !prev;
      setSelected(s => {
        const next = new Set(s);
        if (isOpening) next.add('not-sure');
        else next.delete('not-sure');
        return next;
      });
      return isOpening;
    });
  };

  const hasRealItem = Array.from(selected).some(s => s !== 'not-sure');
  const isFormValid = (hasRealItem || aiOpen) && locality.trim() !== '';

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Find nearest locality using straight-line distance
        const nearest = LOCALITIES.reduce((closest, loc) => {
          const dist = Math.sqrt(
            Math.pow(loc.lat - latitude, 2) +
            Math.pow(loc.lng - longitude, 2)
          );
          return dist < closest.dist ? { loc, dist } : closest;
        }, { loc: null, dist: Infinity });

        if (nearest.loc) {
          setLocality(nearest.loc.name);
          setLocationError('');
        } else {
          setLocationError('Could not match your location to a Delhi locality.');
        }
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setLocationError('Location access denied. Please allow it in your browser settings.');
        } else {
          setLocationError('Could not detect location. Please enter manually.');
        }
      },
      { timeout: 8000 }
    );
  };

  // Update URL without navigating so the Drop Points section can read the params
  const handleContinue = () => {
    if (!isFormValid) return;

    const params = new URLSearchParams();
    Array.from(selected)
      .filter(s => s !== 'not-sure')
      .forEach(s => params.append('m', s));

    if (locality) {
      params.append('loc', locality);
      const locData = LOCALITIES.find(l => l.name === locality);
      if (locData) {
        params.append('lat', locData.lat);
        params.append('lng', locData.lng);
      }
    }

    router.replace(`?${params.toString()}`, { scroll: false });

    setTimeout(() => {
      document.getElementById('drop-points-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div
      className="vis-discover-layer"
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 40,
        backgroundColor: C.cream, margin: '0 auto', maxWidth: 1240,
        border: `1px solid rgba(45,27,78,0.05)`,
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .vis-discover-layer .abs-bg {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
        }
        .vis-discover-layer .content-z {
          position: relative; z-index: 10;
        }
        .vd-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 20px; border-radius: 50px;
          font-family: var(--font-body), sans-serif;
          font-size: 0.95rem; font-weight: 500;
          cursor: pointer; transition: all 0.22s ease; user-select: none;
        }
        .vd-pill-reg {
          background: rgba(255,255,255,0.85);
          border: 1.5px solid ${C.creamBorder};
          color: ${C.brownDeep};
        }
        .vd-pill-reg:hover {
          background: ${C.saffronPale};
          border-color: ${C.saffronLt};
          transform: translateY(-2px);
          box-shadow: 0 4px 18px rgba(212,136,26,0.18);
        }
        .vd-pill-reg.active {
          background: ${C.saffron};
          border-color: ${C.saffron};
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(212,136,26,0.32);
        }
        .vd-pill-ai {
          background: transparent;
          border: 1.5px dashed ${C.saffron};
          color: ${C.saffron};
        }
        .vd-pill-ai:hover { background: rgba(212,136,26,0.1); }
        .vd-pill-ai.active {
          background: ${C.terracotta};
          border: 1.5px solid ${C.terracotta};
          color: white;
        }
        .vd-input-wrap {
          display: flex; gap: 12px; max-width: 600px;
          margin: 0 auto; flex-wrap: wrap; position: relative;
        }
        .vd-input {
          flex: 1; min-width: 250px;
          padding: 15px 24px; border-radius: 50px;
          border: 1.5px solid ${C.creamBorder};
          background: rgba(255,255,255,0.9);
          font-family: var(--font-body), sans-serif;
          font-size: 1rem; color: ${C.brownDeep};
          outline: none; transition: border-color 0.25s;
        }
        .vd-input:focus { border-color: ${C.saffron}; }
        .vd-cta {
          display: inline-flex; align-items: center;
          justify-content: center; gap: 6px;
          padding: 15px 32px; border-radius: 50px;
          background: ${C.saffron}; color: white;
          font-family: var(--font-body), sans-serif;
          font-size: 0.95rem; font-weight: 600;
          border: none; cursor: pointer; transition: all 0.2s ease;
        }
        .vd-cta.valid:hover {
          background: #c07a14;
          transform: translateY(-2px);
        }
        .vd-cta.disabled { opacity: 0.5; pointer-events: none; }
        @keyframes vdFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vd-anim-up { animation: vdFadeUp 0.6s ease both; }
      `}} />

      {/* Backgrounds */}
      <div className="abs-bg" style={{ backgroundImage: "url('/visarjan-scene.png')", backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.1 }} />
      <div className="abs-bg" style={{ background: 'linear-gradient(to bottom, rgba(240,226,238,0.55) 0%, rgba(240,226,238,0.38) 40%, rgba(240,226,238,0.85) 100%)' }} />
      <div className="abs-bg" style={{ backgroundImage: 'radial-gradient(circle, rgba(212,136,26,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="content-z" style={{ width: '100%' }}>

        {/* ── Heading ── */}
        <div className="vd-anim-up" style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 64px)', color: C.brownDeep, marginBottom: 16, lineHeight: 1 }}>
            What Do You Have?
          </h2>
          <p style={{ fontFamily: 'var(--font-hindi)', color: C.saffron, fontSize: '1.1rem', marginBottom: 16 }}>
            आपके पास क्या है?
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: C.brownMid, fontSize: '1rem', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            Select what you want to dispose. We'll find the nearest responsible drop point for you.
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="vd-anim-up" style={{ animationDelay: '150ms', display: 'flex', alignItems: 'center', gap: 14, margin: '40px auto', maxWidth: 860 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: C.creamBorder }} />
          <div style={{ width: 8, height: 8, backgroundColor: C.saffron, transform: 'rotate(45deg)' }} />
          <div style={{ flex: 1, height: 1, backgroundColor: C.creamBorder }} />
        </div>

        {/* ── Pills ── */}
        <div className="vd-anim-up" style={{ animationDelay: '250ms', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: C.brownLt, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 16 }}>
            Select all that apply
          </span>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
            {ITEMS.map(item => (
              <div
                key={item.key}
                onClick={() => togglePill(item.key)}
                className={`vd-pill vd-pill-reg ${selected.has(item.key) ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </div>
            ))}
            <div
              onClick={toggleAI}
              className={`vd-pill vd-pill-ai ${aiOpen ? 'active' : ''}`}
            >
              Not Sure → AI Analyzer
            </div>
          </div>

          {/* ── AI Analyzer panel ── */}
          <div style={{
            overflow: 'hidden',
            transition: 'max-height 0.4s ease, opacity 0.3s ease',
            maxHeight: aiOpen ? 700 : 0,
            opacity: aiOpen ? 1 : 0,
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
              border: `1.5px solid ${C.creamBorder}`,
              borderRadius: 16,
              padding: 28,
              maxWidth: 600,
              margin: '16px auto 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  background: C.terracotta, color: 'white',
                  padding: '4px 10px', borderRadius: 50,
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em',
                }}>
                  ✦ Gemini Vision
                </div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: C.brownDeep }}>
                  AI Idol Analyzer
                </h3>
              </div>
              <IdolAnalyzer onMaterialDetected={(materialKey) => {
                if (materialKey) {
                  setSelected(prev => {
                    const next = new Set(prev);
                    next.add(materialKey);
                    return next;
                  });
                }
              }} />
            </div>
          </div>
        </div>

        {/* ── Locality input + CTA ── */}
        <div className="vd-anim-up" style={{ animationDelay: '380ms', marginTop: 40, textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: C.brownLt, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 16 }}>
            Your city / locality
          </span>
          <div className="vd-input-wrap">
            <input
              type="text"
              className="vd-input"
              placeholder="e.g. Mumbai, Varanasi, Bengaluru…"
              value={locality}
              onChange={(e) => {
                const val = e.target.value;
                setLocality(val);
                if (!val) { setFiltered([]); setDdOpen(false); return; }
                const matches = LOCALITIES
                  .filter(l => l.name.toLowerCase().includes(val.toLowerCase()))
                  .slice(0, 5);
                setFiltered(matches);
                setDdOpen(matches.length > 0);
              }}
              onBlur={() => setTimeout(() => setDdOpen(false), 200)}
            />

            {ddOpen && filtered.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, width: '100%',
                background: 'white', border: `1px solid ${C.creamBorder}`,
                borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                zIndex: 20, overflow: 'hidden', textAlign: 'left', marginTop: 8,
              }}>
                {filtered.map(loc => (
                  <div
                    key={loc.name}
                    onMouseDown={() => { setLocality(loc.name); setDdOpen(false); }}
                    style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: `1px solid ${C.creamBorder}` }}
                  >
                    <span style={{ fontSize: '0.95rem', color: C.brownDeep }}>📍 {loc.name}</span>
                    <span style={{ fontSize: '0.85rem', color: C.brownLt, marginLeft: 8 }}>{loc.zone}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleContinue}
              className={`vd-cta ${isFormValid ? 'valid' : 'disabled'}`}
            >
              Show Map →
            </button>
          </div>

          {/* 📍 Use my location button */}
          <button
            onClick={handleUseLocation}
            disabled={locating}
            style={{
              marginTop: 12,
              background: 'none',
              border: 'none',
              cursor: locating ? 'wait' : 'pointer',
              color: locating ? C.brownLt : C.saffron,
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 50,
              transition: 'all 0.2s',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            {locating ? '⏳ Detecting location...' : '📍 Use my current location'}
          </button>

          {locationError && (
            <p style={{ marginTop: 6, fontSize: '0.78rem', color: '#C0392B', fontFamily: 'var(--font-body)' }}>
              {locationError}
            </p>
          )}

          {/* Helper hints */}
          {!hasRealItem && !aiOpen && (
            <p style={{ marginTop: 12, fontSize: '0.8rem', color: C.brownLt, fontFamily: 'var(--font-body)' }}>
              ☝️ Select at least one item above to continue
            </p>
          )}
          {hasRealItem && !locality && (
            <p style={{ marginTop: 12, fontSize: '0.8rem', color: C.brownLt, fontFamily: 'var(--font-body)' }}>
              📍 Enter your locality to find the nearest drop point
            </p>
          )}
        </div>

      </div>
    </div>
  );
}