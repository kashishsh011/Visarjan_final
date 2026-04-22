'use client';
import { useRef } from 'react';
import { useIdolAnalyzer } from '@/lib/hooks/useIdolAnalyzer';

const RISK_COLORS = {
    High: '#C0392B',
    Medium: '#E67E22',
    Low: '#27AE60',
};

const DROP_POINT_LABELS = {
    controlled_pond: '🌊 Nearest controlled immersion pond',
    clay_reuse: '🏺 Artisan clay reuse program',
    phool_partner: '🌸 Phool drop point → incense',
    metal_recycler: '⚙️ Metal recycling centre',
    general_ngo: '🤝 General NGO collection point',
};

export default function IdolAnalyzer({ onMaterialDetected } = {}) {
    const inputRef = useRef(null);
    const { status, result, preview, error, analyze, reset } = useIdolAnalyzer({ onMaterialDetected });

    const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        analyze(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    };

    return (
        <div style={{ maxWidth: 560, margin: '0 auto' }}>

            {/* ── IDLE: Upload zone ── */}
            {status === 'idle' && (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    style={{
                        border: '2px dashed rgba(232,135,26,0.4)',
                        borderRadius: 16, padding: '48px 24px',
                        textAlign: 'center', cursor: 'pointer',
                        background: 'rgba(232,135,26,0.03)',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(232,135,26,0.07)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(232,135,26,0.03)'}
                >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
                    <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '1rem',
                        fontWeight: 700, color: 'var(--plum)', marginBottom: 8,
                    }}>
                        Photograph your idol
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                        color: 'var(--warm-gray)',
                    }}>
                        Click to upload or drag and drop<br />JPG, PNG · Max 4MB
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: 'none' }}
                        onChange={e => handleFile(e.target.files[0])}
                    />
                </div>
            )}

            {/* ── ANALYZING ── */}
            {status === 'analyzing' && (
                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                    {preview && (
                        <img src={preview} alt="Uploading"
                            style={{
                                width: 160, height: 160, objectFit: 'cover',
                                borderRadius: 12, marginBottom: 24, opacity: 0.7,
                            }}
                        />
                    )}
                    <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '1rem',
                        color: 'var(--plum)', marginBottom: 8,
                    }}>
                        Gemini is analyzing your idol...
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                        color: 'var(--warm-gray)',
                    }}>
                        Identifying material · Estimating pollution risk
                    </div>
                    <div style={{ marginTop: 20, display: 'flex', gap: 6, justifyContent: 'center' }}>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: 'var(--saffron)',
                                animation: `bounce 1.2s ${i * 0.2}s infinite`,
                            }} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── ERROR ── */}
            {status === 'error' && (
                <div style={{ textAlign: 'center', padding: '32px 24px' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                    <div style={{
                        fontFamily: 'var(--font-body)',
                        color: '#C0392B', marginBottom: 20,
                    }}>
                        {error}
                    </div>
                    <button className="cta-btn-warm" onClick={reset}>
                        Try again
                    </button>
                </div>
            )}

            {/* ── RESULT ── */}
            {status === 'done' && result && (
                <div>
                    {/* Image + material name */}
                    <div style={{
                        display: 'flex', gap: 16,
                        alignItems: 'flex-start', marginBottom: 20,
                    }}>
                        {preview && (
                            <img src={preview} alt="Your idol"
                                style={{
                                    width: 100, height: 100, objectFit: 'cover',
                                    borderRadius: 10, flexShrink: 0,
                                }}
                            />
                        )}
                        <div>
                            <div style={{
                                fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                                color: 'var(--warm-gray)', letterSpacing: '0.1em',
                                textTransform: 'uppercase', marginBottom: 4,
                            }}>
                                Material identified
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                                fontWeight: 800, color: 'var(--plum)',
                            }}>
                                {result.material}
                            </div>
                            <div style={{
                                display: 'inline-block', marginTop: 6,
                                padding: '3px 10px', borderRadius: 50,
                                background: RISK_COLORS[result.pollutionRisk] + '22',
                                border: `1px solid ${RISK_COLORS[result.pollutionRisk]}44`,
                                color: RISK_COLORS[result.pollutionRisk],
                                fontSize: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: 600,
                            }}>
                                {result.pollutionRisk} pollution risk
                            </div>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div style={{
                        padding: '16px',
                        background: 'rgba(232,135,26,0.06)',
                        borderRadius: 10,
                        border: '1px solid rgba(232,135,26,0.15)',
                        marginBottom: 16,
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                            color: 'var(--warm-gray)', lineHeight: 1.7,
                        }}>
                            {result.explanation}
                        </div>
                    </div>

                    {/* Drop point */}
                    <div style={{
                        padding: '16px',
                        background: 'rgba(61,26,58,0.04)',
                        borderRadius: 10,
                        border: '1px solid rgba(61,26,58,0.1)',
                        marginBottom: 24,
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                            color: 'var(--warm-gray)', letterSpacing: '0.08em',
                            textTransform: 'uppercase', marginBottom: 6,
                        }}>
                            Where to go
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-display)', fontSize: '0.95rem',
                            fontWeight: 700, color: 'var(--plum)',
                        }}>
                            {DROP_POINT_LABELS[result.dropPointType]}
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                            color: 'var(--warm-gray)', marginTop: 4,
                        }}>
                            {result.recommendation}
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                            className="cta-btn-warm"
                            onClick={() => document.getElementById('drop-points-section')
                                ?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Find drop point →
                        </button>
                        <button onClick={reset} style={{
                            padding: '12px 20px', borderRadius: 50,
                            border: '1.5px solid rgba(232,135,26,0.3)',
                            background: 'transparent', color: 'var(--warm-gray)',
                            fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                            cursor: 'pointer',
                        }}>
                            Analyze another
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}