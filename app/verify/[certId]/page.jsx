'use client';
import { useState, useEffect } from 'react';

export default function VerifyPage({ params }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [certId, setCertId] = useState('');

    useEffect(() => {
        async function load() {
            const resolved = await params;
            setCertId(resolved.certId);
            try {
                const res = await fetch(`/api/drop-offs/${resolved.certId}`);
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [params]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #FFF8F0, #F3E8F5)',
                fontFamily: "'DM Sans', sans-serif",
                color: '#6B5B4E',
            }}>
                Verifying certificate…
            </div>
        );
    }

    if (error || !data) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #FFF8F0, #F3E8F5)',
                fontFamily: "'DM Sans', sans-serif",
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '48px 32px',
                    maxWidth: 420,
                }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>❌</div>
                    <div style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: '#3D1A3A',
                        marginBottom: 12,
                    }}>
                        Certificate Not Found
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6B5B4E', lineHeight: 1.7 }}>
                        The certificate ID <strong style={{ color: '#E8871A' }}>{certId}</strong> does not
                        match any record on the Visarjan platform.
                    </div>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(data.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #FFF8F0, #F3E8F5)',
            fontFamily: "'DM Sans', sans-serif",
            padding: '40px 20px',
        }}>
            <div style={{
                background: 'white',
                borderRadius: 24,
                padding: '48px 36px',
                maxWidth: 480,
                width: '100%',
                boxShadow: '0 12px 48px rgba(61,26,58,0.12)',
                border: '1.5px solid rgba(232,135,26,0.2)',
                textAlign: 'center',
            }}>
                {/* Verified badge */}
                <div style={{
                    width: 64, height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #27AE60, #2ECC71)',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 20px',
                    fontSize: 28,
                    boxShadow: '0 4px 16px rgba(39,174,96,0.35)',
                }}>
                    ✓
                </div>

                <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#3D1A3A',
                    marginBottom: 6,
                }}>
                    Verified Certificate
                </div>
                <div style={{
                    fontSize: '0.8rem',
                    color: '#6B5B4E',
                    letterSpacing: '0.1em',
                    marginBottom: 32,
                }}>
                    ID: {data.certId}
                </div>

                {/* Details */}
                <div style={{
                    background: 'rgba(232,135,26,0.06)',
                    borderRadius: 16,
                    padding: '24px 20px',
                    textAlign: 'left',
                    marginBottom: 24,
                }}>
                    <DetailRow label="Citizen" value={data.userName} />
                    <DetailRow label="Item Dropped" value={data.item} />
                    <DetailRow label="NGO" value={data.ngoName} />
                    <DetailRow label="Date" value={formattedDate} />
                    <DetailRow label="Pollutants Diverted" value={`${data.weightKg} kg`} last />
                </div>

                <div style={{
                    fontSize: '0.78rem',
                    color: '#6B5B4E',
                    lineHeight: 1.7,
                }}>
                    This drop-off was recorded on the <strong style={{ color: '#E8871A' }}>Visarjan</strong> platform.
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, last = false }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: '10px 0',
            borderBottom: last ? 'none' : '1px solid rgba(232,135,26,0.12)',
        }}>
            <span style={{ fontSize: '0.82rem', color: '#6B5B4E' }}>{label}</span>
            <span style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#3D1A3A',
                textAlign: 'right',
                maxWidth: '60%',
            }}>
                {value}
            </span>
        </div>
    );
}
