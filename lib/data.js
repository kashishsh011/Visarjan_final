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

export const IMPACT_STATS = {
    totalWeightKg: 2840,
    familiesServed: 1200,
    flowersKg: 340,
    dropPoints: 18,
};

export const WHY_CARDS = [
    {
        title: 'Abandoned in Plain Sight',
        desc: 'Broken murtis under trees. Nirmalya heaped at temple gates. Pooja waste left at street corners with nowhere to go. Sacred by intention, forgotten by system.',
    },
    {
        title: 'Our Rivers Are Paying the Price',
        desc: 'PoP never dissolves, it sinks releasing lead and mercury into water we call holy. Flowers consume oxygen. What enters the river as offering leaves as poison.',
    },
    {
        title: 'Faith Can Be Sustainable',
        desc: 'Flowers become compost. Coconut shells become fuel. Idol clay returns to earth. When sacred waste finds the right hands, nothing is wasted and nothing is lost.',
    },
];

export const ITEM_OPTIONS = [
    'PoP Idol', 'Clay Idol', 'Flowers / Nirmalya',
    'Coconut / Prasad', 'Full Pooja Set', 'Multiple Items'
];

export const NGO_OPTIONS = [
    // Delhi NCR
    "Yamuna Nadi Sewa Samiti – Lajpat Nagar, Delhi",
    "Chintan Environmental Research – Saket, Delhi",
    "Wild Delhi – Rohini, Delhi",
    "Waste Warriors Society – Dwarka, Delhi",
    "Delhi Greens – Mayur Vihar, Delhi",
    "Paryavaran Mitra – Karol Bagh, Delhi",
    "Earth Saviours Foundation – Noida",
    "Haritima – Gurgaon",
    "Aaruhi Enterprises (SavePrithvi) – Sheetla Colony, Delhi",
    "Visarjan.in – Ghaziabad / Noida / Greater Noida",
    // Mumbai
    "BMC Artificial Pond – Mumbai (nearest to your locality)",
    "Punaravartan by eCoexist – Mumbai",
    // Bengaluru
    "HSR Citizens Forum – HSR Layout, Bengaluru",
    "BBMP Eco-Immersion Centre – Bengaluru (nearest lake)",
    // Hyderabad
    "HolyWaste by Oorvi – Banjara Hills, Hyderabad",
    "GHMC Immersion Point – Hyderabad (nearest zone)",
    // Chennai
    "OSR Trust – Chennai",
];

export const KG_MAP = {
    'PoP Idol': '4.2', 'Clay Idol': '1.8',
    'Flowers / Nirmalya': '1.5', 'Coconut / Prasad': '0.8',
    'Full Pooja Set': '6.5', 'Multiple Items': '5.0'
};

export const ALL_INDIA_AREAS = [
    // Delhi NCR
    "Lajpat Nagar", "Saket", "Rohini", "Dwarka", "Mayur Vihar",
    "Karol Bagh", "Connaught Place", "Vasant Kunj", "Janakpuri",
    "Pitampura", "Preet Vihar", "Shahdara",
    "Noida Sector 18", "Noida Sector 62", "Greater Noida",
    "Gurgaon Sector 29", "Gurgaon DLF Phase 1", "Faridabad",
    "Ghaziabad Raj Nagar",
    // Mumbai
    "Andheri West", "Andheri East", "Bandra West", "Bandra East",
    "Colaba", "Dharavi", "Juhu", "Powai", "Thane",
    "Borivali", "Malad", "Goregaon", "Kandivali", "Chembur",
    "Kurla", "Dadar", "Worli", "Lower Parel", "Navi Mumbai",
    // Pune
    "Koregaon Park", "Kothrud", "Hinjawadi", "Viman Nagar",
    "Aundh", "Baner", "Wakad", "Kharadi", "Hadapsar", "Shivajinagar",
    // Bengaluru
    "Indiranagar", "Jayanagar", "Whitefield", "Koramangala",
    "HSR Layout", "Electronic City", "Rajajinagar", "Malleswaram",
    "Bannerghatta Road", "Sarjapur Road", "MG Road", "Hebbal",
    // Hyderabad
    "Banjara Hills", "Jubilee Hills", "Kondapur", "Gachibowli",
    "Madhapur", "Secunderabad", "Ameerpet", "Kukatpally",
    "Hitech City", "Padmarao Nagar",
    // Chennai
    "T. Nagar", "Adyar", "Anna Nagar", "Velachery", "Mylapore",
    "Tambaram", "Porur", "Nungambakkam", "Guindy", "Perambur",
    // Kolkata
    "Salt Lake", "Howrah", "Park Street", "Tollygunge", "Ballygunge",
    "New Town", "Dum Dum", "Jadavpur",
    // Ahmedabad
    "Navrangpura", "Satellite", "Bodakdev", "Vastrapur",
    "Maninagar", "Bopal", "SG Highway",
    // Jaipur
    "Malviya Nagar", "Mansarovar", "Vaishali Nagar", "C-Scheme",
    // Lucknow
    "Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar",
    // Chandigarh
    "Sector 17", "Sector 22", "Sector 35", "Mohali",
    // Other cities
    "Nagpur Sitabuldi", "Surat Adajan", "Kochi Ernakulam",
    "Coimbatore RS Puram", "Visakhapatnam Dwaraka Nagar",
    "Bhopal MP Nagar", "Indore Vijay Nagar",
];

export const MATERIALS = [
    'Flowers / Nirmalya', 'PoP Idol', 'Clay Idol',
    'Coconut / Prasad', 'Full Pooja Set'
];

export const PARTNER_LOGOS = [
    'Phool', 'eCoexist', 'Holywaste',
    'Sampurnam', 'GreenVidai', 'YamunaClean'
];

export const COMMUNITY_CARDS = [
    { name: "Priya S.", area: "Andheri West, Mumbai", material: "Ganesh Idol (PoP)", date: "Sep 2024" },
    { name: "Arjun M.", area: "HSR Layout, Bengaluru", material: "Full Pooja Set", date: "Sep 2024" },
    { name: "Fatima K.", area: "Banjara Hills, Hyderabad", material: "Temple Flowers", date: "Oct 2024" },
    { name: "Rahul D.", area: "Noida Sector 62, Delhi", material: "Clay Idol", date: "Oct 2024" },
    { name: "Sneha P.", area: "T. Nagar, Chennai", material: "Pooja Samagri", date: "Nov 2024" },
    { name: "Vikram T.", area: "Koramangala, Bengaluru", material: "Clay Idol", date: "Sep 2024" },
    { name: "Meera J.", area: "Lajpat Nagar, Delhi", material: "Flowers & Garlands", date: "Aug 2024" },
    { name: "Ankit R.", area: "Ghaziabad, Delhi NCR", material: "PoP Idol + Pooja Set", date: "Sep 2024" },
];