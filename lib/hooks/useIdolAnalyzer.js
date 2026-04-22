import { useState } from 'react';

// Map Gemini material strings → WhatDoYouHave item keys
const MATERIAL_TO_KEY = {
    'PoP':        'pop',
    'Clay':       'clay',
    'Metal':      'clay',        // closest catch-all
    'Paper Pulp': 'flowers',     // closest catch-all
    'Unknown':    null,
};

export function useIdolAnalyzer({ onMaterialDetected } = {}) {
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    const analyze = async (file) => {
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setStatus('analyzing');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch('/api/idol-analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Analysis failed');

            setResult(data);
            setStatus('done');

            // Notify parent of detected material so it can auto-select the pill
            if (onMaterialDetected) {
                const key = MATERIAL_TO_KEY[data.material] ?? null;
                onMaterialDetected(key);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    const reset = () => {
        setStatus('idle');
        setResult(null);
        setPreview(null);
        setError(null);
    };

    return { status, result, preview, error, analyze, reset };
}