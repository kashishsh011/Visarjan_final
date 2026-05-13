🌐 **Live Demo:** [visarjan.vercel.app](https://visarjan.vercel.app)

---

# 🪷 Visarjan: Eco-Conscious Devotion Platform

Visarjan is a full-stack web application designed to bridge the gap between religious devotion and environmental sustainability. Every year, millions of idols are immersed in water bodies, causing severe heavy-metal pollution. This platform provides users with an end-to-end flow to responsibly dispose of their Pooja waste, find verified eco-ponds, track community impact, and earn eco-certificates.

---

## ✨ Key Features

* **Advanced Scroll-Canvas Animation:** A highly optimized 400vh, 240-frame 60fps scrolling hero animation using `requestAnimationFrame` and image preloading, providing a cinematic storytelling experience without layout shifts.
* **Community Impact Wall (Live Data):** An interactive masonry grid that dynamically fetches real-time drop-off data from MongoDB. It uses dynamic material-based emoji mapping (e.g., ⚱️ for PoP, 🏺 for Clay) and elegant Framer Motion hover animations.
* **Eco-Certificate Generation:** Users who complete a responsible drop-off can generate a personalized, branded certificate. Built using `html2canvas`, the certificate is generated entirely client-side and automatically downloads as a PNG.
* **Google OAuth Authentication:** Secure user authentication handled seamlessly via `NextAuth.js`, allowing users to track their historical drop-offs and maintaining data integrity.
* **Interactive Mapping:** A dedicated drop-points section allowing users to locate nearby verified NGOs and eco-ponds for responsible disposal.

---

## 🛠 Tech Stack

**Frontend:**
* **Framework:** Next.js 14 (App Router)
* **Styling:** Custom CSS, Tailwind CSS conventions, dynamic CSS modules
* **Animations:** Framer Motion, HTML5 Canvas API
* **Utilities:** `html2canvas` for client-side image generation

**Backend & Database:**
* **API:** Next.js Serverless API Routes
* **Database:** MongoDB
* **ODM:** Mongoose
* **Authentication:** NextAuth.js (Google Provider)

---

## 🏗 Architecture & Data Flow

The platform utilizes a **"Closed-Loop" Architecture:**

1. **Authentication:** The user logs in securely via their Google account.
2. **Submission:** The user logs their dropped-off material (e.g., PoP idol, flowers) via the Certificate generation flow.
3. **Storage:** The data is pushed via a `POST /api/drop-offs` route and stored in MongoDB.
4. **Client Generation:** The browser captures the DOM node and generates a PNG certificate.
5. **Live Update:** The user is redirected to the home page, where the `/api/stats` endpoint bypasses Next.js cache (`force-dynamic`) to instantly reflect the new data on the Community Impact Wall.

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

**Prerequisites**
* Node.js (v18+)
* MongoDB Atlas Account (or local MongoDB instance)
* Google Cloud Console Project (for OAuth credentials)

**1. Clone the repository**
```bash
git clone https://github.com/your-username/Visarjan_final.git
cd Visarjan_final
```

**2. Install dependencies**
```bash
npm install
```

**3. Environment Variables**

Create a `.env.local` file in the root directory and add the following variables:
```
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a_random_secure_string
```

**4. Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🔮 Future Roadmap

* **TypeScript Migration:** Incrementally rewrite the codebase to `.tsx` to enforce strict type safety across database models and API payloads.
* **NGO Partner Dashboard:** Implement role-based routing (e.g., `/dashboard/ngo`) allowing partnered organizations to view aggregated drop-off statistics specific to their location.
* **Live Gemini API Integration:** Connect the "AI Analyzer" frontend directly to Google's Gemini Vision API to automatically classify uploaded idol photos and estimate pollution risk.
* **Geospatial Queries:** Enhance the Drop Points map using MongoDB `$near` queries for precise proximity-based searching.

---

Built with passion to protect our environment. 
