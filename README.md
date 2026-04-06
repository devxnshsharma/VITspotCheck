# VITspotCheck

**Campus Intelligence Platform** 🏢 *Real-time. Crowdsourced. Trust-weighted. FFCS-aware.*

---

## 🌌 The Vision

**VITspotCheck is not just a timetable viewer or a booking system. It is a living intelligence layer on top of VIT's physical campus.**

Built for the 25,000+ students at Vellore Institute of Technology (VIT), this platform eliminates the friction of wandering blocks like PRP, SJT or TT searching for open, well-connected study rooms. It combines crowdsourced room availability, network quality mapping, classroom condition reporting, and a self-hosted lab booking portal—all backed by a trust-weighted karma engine.

## ⚡ Core Capabilities

*   **Real-Time Campus Map:** Interactive, floor-navigable maps of all major blocks (SJT, TT, PRP, SMV, MB). Rooms pulse with live states: 🟢 Empty, 🔴 Occupied, or 🟡 Unverified.
*   **Crowdsourced Status Engine:** Real-time room status reporting from students on the ground, weighted by user Karma to ensure accuracy.
*   **WiFi Intelligence:** Integrated network speed benchmarking using `@cloudflare/speedtest` to map Mbps and latency per bench—see where to sit for the best connection.
*   **FFCS Classroom Intelligence:** Overlays schedule data to predict future availability based on FFCS cycles.
*   **Trust & Karma System:** A gamified trust engine (Observer to Oracle tiers). Accurate reports earn Karma (`+✦`); contested or false reports result in loss.
*   **Booking Portal:** Ad-hoc room and lab booking system for clubs and group study, with real-time conflict detection and instant map synchronization.

---

## 🛠️ Architecture & Tech Stack

The platform is built on a high-fidelity modern stack designed for speed, reliability, and real-time interaction.

### Frontend
*   **Framework:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [Framer Motion 12](https://www.framer.com/motion/) (High-performance animations)
*   **UI Components:** Highly customized [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
*   **State Management:** [Zustand 5](https://zustand-demo.pmnd.rs/) (Fast, global state)
*   **Icons:** [Lucide React](https://lucide.dev/)

### Backend & Database
*   **Runtimes:** [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) + [tsx](https://github.com/privatenumber/tsx)
*   **ORM:** [Prisma 6](https://www.prisma.io/)
*   **Database:** SQLite (local development) / Vercel Postgres (production ready) [not integrated]
*   **Authentication:** [Firebase Auth](https://firebase.google.com/products/auth) (Restricted to `@vitstudent.ac.in`)

---

## 🎨 Design Mandate:

*   **Palette:** Void black (`#0A0A0F`) base. Neon green (`#00FF94`) for primary actions. Electric purple (`#B14FFF`) for accents. Cyan (`#00E5FF`) for data.
*   **Typography:** [Outfit](https://fonts.google.com/specimen/Outfit) for geometric, futuristic headings. [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for data and speed numbers.
*   **Surfaces:** Glassmorphism everywhere. Semi-transparent panels (`backdrop-blur: 24px`) with subtle 1px neon borders.

---

## 🚀 Local Development

### 1. Prerequisites
*   Node.js 22+
*   npm (v10+)
*   Firebase Project (for authentication)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/devxnshsharma/VITspotCheckFinal.git
cd VITspotCheckFinal

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and populate it with your Firebase and Database credentials.
```env
# Database
DATABASE_URL="file:./dev.db"

# Firebase Config (Get these from Firebase Console)
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

### 4. Database Initialization
```bash
# Generate Prisma Client
npx prisma generate --schema=server/prisma/schema.prisma

# Push schema to local DB
npx prisma db push --schema=server/prisma/schema.prisma
```

### 5. Running the Application
To run the full stack, you need to start both the frontend and the backend server.

**Terminal 1: Frontend (Vite)**
```bash
npm run dev
# Vite will start on http://localhost:3003
```

**Terminal 2: Backend (Express)**
```bash
npm run server
# API will start on http://localhost:3001
```

---

## 🔒 Security & Data Privacy

*   **Domain Restriction:** Authentication is strictly limited to active VIT students via Google OAuth (`@vitstudent.ac.in`).
*   **Location Privacy:** Precise GPS locations are never stored. Only the selected classroom ID is logged during report submission.
*   **Data Freshness:** Room reports decay over time to ensure current status accuracy.

---

## 👥 Authors & Maintainers

*   **Devansh Sharma** (24BCE0717) - Architect & Lead Developer
*   **Devarsh Patel** (24BCT0267) - Architect & Lead Developer

---

"You dream it. We ship it. All in days, not quarters."

© 2026 VITspotCheck. All rights reserved.
