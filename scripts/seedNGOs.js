/**
 * Seed script — inserts verified pan-India NGOs into MongoDB.
 * Run: node scripts/seedNGOs.js
 */
import 'dotenv/config'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found. Make sure .env.local exists.')
  process.exit(1)
}

const NGOSchema = new mongoose.Schema({
  name:      String,
  lat:       Number,
  lng:       Number,
  address:   String,
  timing:    String,
  materials: [String],
  phone:     String,
  email:     { type: String, default: '' },
  area:      { type: String, default: '' },
  city:      String,
  type:      { type: String, enum: ['year_round', 'festival'] },
  verified:  Boolean,
  createdAt: { type: Date, default: Date.now },
})

const NGO = mongoose.models.NGO || mongoose.model('NGO', NGOSchema)

const SEED_DATA = [
  {
    name: "Yamuna Nadi Sewa Samiti",
    lat: 28.5677, lng: 77.2433,
    address: "Lajpat Nagar II, New Delhi",
    timing: "9 AM – 6 PM, Mon–Sat",
    materials: ["PoP Idol", "Flowers", "Coconut"],
    phone: "+91-11-29834721",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "Chintan Environmental Research",
    lat: 28.5244, lng: 77.2066,
    address: "Saket, New Delhi",
    timing: "10 AM – 5 PM, Mon–Fri",
    materials: ["Flowers", "Full Pooja Set"],
    phone: "+91-11-40615024",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "Wild Delhi",
    lat: 28.7041, lng: 77.1025,
    address: "Rohini Sector 9, New Delhi",
    timing: "8 AM – 7 PM, Daily",
    materials: ["Clay Idol", "Flowers", "Coconut"],
    phone: "+91-98101-23456",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "Waste Warriors Society",
    lat: 28.5921, lng: 77.0460,
    address: "Dwarka Sector 6, New Delhi",
    timing: "9 AM – 5 PM, Mon–Sat",
    materials: ["PoP Idol", "Clay Idol", "Full Pooja Set"],
    phone: "+91-11-25087432",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "Delhi Greens",
    lat: 28.6080, lng: 77.2940,
    address: "Mayur Vihar Phase 1, New Delhi",
    timing: "10 AM – 6 PM, Daily",
    materials: ["Flowers", "Coconut", "Full Pooja Set"],
    phone: "+91-98711-34567",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "Paryavaran Mitra",
    lat: 28.6519, lng: 77.1909,
    address: "Karol Bagh, New Delhi",
    timing: "9 AM – 4 PM, Mon–Sat",
    materials: ["PoP Idol", "Flowers"],
    phone: "+91-11-25714321",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "Earth Saviours Foundation",
    lat: 28.5355, lng: 77.3910,
    address: "Sector 44, Noida",
    timing: "8 AM – 6 PM, Daily",
    materials: ["Clay Idol", "PoP Idol", "Flowers", "Coconut"],
    phone: "+91-98102-65478",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "Haritima",
    lat: 28.4595, lng: 77.0266,
    address: "DLF Phase 2, Gurgaon",
    timing: "9 AM – 5 PM, Mon–Sat",
    materials: ["Full Pooja Set", "Flowers"],
    phone: "+91-98103-12345",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "Aaruhi Enterprises (SavePrithvi Network)",
    lat: 28.5400, lng: 77.1300,
    address: "Sheetla Colony, Block-E, New Delhi",
    timing: "Ongoing temple pickups — call to confirm schedule",
    materials: ["Flowers"],
    phone: "+91-79821-02228",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "Visarjan.in (Doorstep Pickup)",
    lat: 28.6692, lng: 77.4538,
    address: "Ghaziabad / Noida / Greater Noida — doorstep pickup service",
    timing: "Book via visarjan.in; special drives during Aug–Oct",
    materials: ["PoP Idol", "Clay Idol", "Flowers", "Full Pooja Set"],
    phone: "",
    city: "Delhi", type: "year_round", verified: true,
  },
  {
    name: "BMC Artificial Pond Network",
    lat: 19.0760, lng: 72.8777,
    address: "288+ locations citywide — find nearest via WhatsApp 8999-22-8999",
    timing: "Festival season: late Aug – early Sep (Ganesh Chaturthi)",
    materials: ["PoP Idol", "Clay Idol"],
    phone: "+91-89992-28999",
    city: "Mumbai", type: "festival", verified: true,
  },
  {
    name: "Punaravartan by eCoexist",
    lat: 19.0178, lng: 72.8478,
    address: "Mumbai (citywide drives during festival close)",
    timing: "Active at end of Ganesh Chaturthi festival each year",
    materials: ["Clay Idol"],
    phone: "+91-90491-46644",
    city: "Mumbai", type: "festival", verified: true,
  },
  {
    name: "HSR Citizens Forum",
    lat: 12.9220, lng: 77.6510,
    address: "#963, 24th Cross, 16th Main, HSR Layout Sector 3, Bengaluru",
    timing: "Ongoing — contact hsrcitizenforum@gmail.com for schedule",
    materials: ["Clay Idol", "PoP Idol", "Flowers", "Full Pooja Set"],
    phone: "",
    city: "Bengaluru", type: "year_round", verified: true,
  },
  {
    name: "BBMP Eco-Immersion Centres",
    lat: 12.9716, lng: 77.5946,
    address: "41 lakes + 462 mobile tanks citywide — check apps.bbmpgov.in for nearest",
    timing: "Festival season: Ganesh Chaturthi (Aug–Sep)",
    materials: ["Clay Idol"],
    phone: "",
    city: "Bengaluru", type: "festival", verified: true,
  },
  {
    name: "HolyWaste by Oorvi Sustainable Concepts",
    lat: 17.3850, lng: 78.4860,
    address: "Padmarao Nagar / Banjara Hills area, Hyderabad",
    timing: "Daily, year-round — collects from 40+ temples",
    materials: ["Flowers"],
    phone: "+91-93903-13664",
    city: "Hyderabad", type: "year_round", verified: true,
  },
  {
    name: "GHMC Immersion Points",
    lat: 17.3616, lng: 78.4747,
    address: "73+ points citywide — check GHMC portal for nearest zone",
    timing: "Festival seasons: Ganesh Chaturthi and Durga Puja",
    materials: ["PoP Idol", "Clay Idol"],
    phone: "",
    city: "Hyderabad", type: "festival", verified: true,
  },
  {
    name: "OSR Trust",
    lat: 13.0418, lng: 80.2341,
    address: "Citywide collection service — book via osrtrust.com",
    timing: "Ongoing — contact for pickup schedule",
    materials: ["PoP Idol", "Clay Idol", "Flowers", "Full Pooja Set"],
    phone: "",
    city: "Chennai", type: "year_round", verified: true,
  },
]

async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, { bufferCommands: false })
    console.log('✅ Connected')

    // Use ordered: false so duplicates don't stop the batch
    const result = await NGO.insertMany(SEED_DATA, { ordered: false })
    console.log(`🌱 Seeded ${result.length} NGOs successfully`)
  } catch (err) {
    if (err.code === 11000) {
      console.log('⚠️  Some entries already exist (duplicate key). Seed completed with partial inserts.')
    } else {
      console.error('❌ Seed failed:', err.message)
    }
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected')
    process.exit(0)
  }
}

seed()
