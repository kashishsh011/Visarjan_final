// lib/data.js

export const ITEM_PILLS = [
    { emoji: '🏺', label: 'PoP Idol' },
    { emoji: '🪔', label: 'Clay Idol' },
    { emoji: '🌸', label: 'Flowers / Nirmalya' },
    { emoji: '🥥', label: 'Coconut / Prasad' },
    { emoji: '🧺', label: 'Full Pooja Set' },
    { emoji: '❓', label: 'Not Sure → AI Analyzer' },
];

export const PARTNERS = [
    { name: 'Phool', emoji: '🌺', desc: 'Flowers → incense & bio-products' },
    { name: 'eCoexist', emoji: '♻️', desc: 'PoP collection & landfill diversion' },
    { name: 'HolyWaste', emoji: '💧', desc: 'Yamuna water quality monitoring' },
    { name: 'Sampurnam', emoji: '🌿', desc: 'Zero-waste Ganesh festival kits' },
];

export const IMPACT_STATS = [
    { val: '2.3T', lbl: 'kg PoP kept out of Yamuna' },
    { val: '18,400', lbl: 'Families served' },
    { val: '94K', lbl: 'Flowers converted by Phool' },
    { val: '312', lbl: 'NGO drop points mapped' },
];

export const WHY_CARDS = [
    {
        icon: '🥀',
        hindi: 'रास्ते में छूट गई आस्था',
        title: 'Abandoned in Plain Sight',
        desc: 'Broken murtis under trees. Nirmalya heaped at temple gates. Pooja waste left at street corners with nowhere to go. Sacred by intention, forgotten by system.',
    },
    {
        icon: '☠️',
        hindi: 'नदियों की कीमत',
        title: 'Our Rivers Are Paying the Price',
        desc: 'PoP never dissolves, it sinks releasing lead and mercury into water we call holy. Flowers consume oxygen. What enters the river as offering leaves as poison.',
    },
    {
        icon: '🌱',
        hindi: 'हरित श्रद्धा',
        title: 'Faith Can Be Sustainable',
        desc: 'Flowers become compost. Coconut shells become fuel. Idol clay returns to earth. When sacred waste finds the right hands, nothing is wasted and nothing is lost.',
    },
];

export const ITEM_OPTIONS = [
    'PoP Idol', 'Clay Idol', 'Flowers / Nirmalya',
    'Coconut / Prasad', 'Full Pooja Set', 'Multiple Items'
];

export const NGO_OPTIONS = [
    'Phool NGO - Connaught Place', 'eCoexist Hub - Lajpat Nagar',
    'Holywaste - Dwarka', 'Sampurnam - Rohini',
    'GreenVidai - Saket', 'YamunaClean - Noida Sec 18',
    'PrakritiSeva - Pitampura', 'EcoVisarjan - Janakpuri'
];

export const KG_MAP = {
    'PoP Idol': '4.2', 'Clay Idol': '1.8',
    'Flowers / Nirmalya': '1.5', 'Coconut / Prasad': '0.8',
    'Full Pooja Set': '6.5', 'Multiple Items': '5.0'
};

export const DELHI_AREAS = [
    'Connaught Place', 'Lajpat Nagar', 'Dwarka', 'Rohini',
    'Saket', 'Janakpuri', 'Pitampura', 'Karol Bagh',
    'Greater Kailash', 'Vasant Kunj', 'Nehru Place',
    'Preet Vihar', 'Rajouri Garden', 'Punjabi Bagh', 'Noida Sec 18'
];

export const MATERIALS = [
    'Flowers / Nirmalya', 'PoP Idol', 'Clay Idol',
    'Coconut / Prasad', 'Full Pooja Set'
];

export const PARTNER_LOGOS = [
    'Phool', 'eCoexist', 'Holywaste',
    'Sampurnam', 'GreenVidai', 'YamunaClean'
];

export const ROADMAP = [
    { icon: '📱', title: 'QR Verification', desc: 'Scan to confirm your drop, earn verified eco-points.' },
    { icon: '📊', title: 'Real-time NGO Dashboard', desc: 'NGOs see live incoming drop requests and capacity.' },
    { icon: '🌆', title: 'City Expansion', desc: 'Mumbai, Pune, Hyderabad — beyond Delhi in 2025.' },
];

export const COMMUNITY_CARDS = [
    { name: 'Riya Sharma', area: 'Lajpat Nagar', material: 'PoP Idol', date: 'Apr 14' },
    { name: 'Amit Verma', area: 'Dwarka', material: 'Flowers + Coconut', date: 'Apr 13' },
    { name: 'Priya Nair', area: 'Rohini', material: 'Full Pooja Set', date: 'Apr 14' },
    { name: 'Kiran Joshi', area: 'Saket', material: 'Clay Idol', date: 'Apr 12' },
    { name: 'Sunil Kapoor', area: 'Pitampura', material: 'Nirmalya', date: 'Apr 15' },
    { name: 'Meera Das', area: 'Janakpuri', material: 'PoP Idol + Flowers', date: 'Apr 13' },
    { name: 'Rahul Singh', area: 'Connaught Place', material: 'Coconut + Prasad', date: 'Apr 14' },
    { name: 'Anjali Gupta', area: 'Greater Kailash', material: 'Full Pooja Set', date: 'Apr 15' },
];