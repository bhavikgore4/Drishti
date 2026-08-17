# DRISHTI - Disaster & Public Grievance Management System

> **Official AI-Powered Civic Redressal & Emergency Alert Portal (CPGRAMS Aligned)**  
> *Government of Maharashtra & Nagpur Municipal Corporation (NMC) Regional Division*

---

## 🏛️ Executive Overview

**DRISHTI** (*Disaster Relief, Integrated Surveillance, Hazard Tracking & Incident Redressal System*) is a modern, unified citizen-centric civic grievance redressal and geospatial disaster management platform built to standards aligned with **CPGRAMS** (Centralized Public Grievance Redress and Monitoring System). 

Designed specifically with regional administrative precision for **Nagpur Metropolitan Region**, DRISHTI bridges the communication gap between citizens, the **Nagpur Municipal Corporation (NMC)**, the **Public Works Department (PWD)**, and the **National Disaster Response Force (NDRF)**. It combines AI-powered auto-triage, real-time GIS hazard mapping, live meteorological tracking, crowd-verified neighborhood feeds, and an end-to-end nodal accountability escalation workflow.

---

## 🌟 Key Capabilities & Features

### 1. 🇮🇳 Official Government Portal Parity
- **State Emblem & Formal Typography:** Features the Ashoka Stambh emblem bearing *"सत्यमेव जयते"* with authentic Government of India and Government of Maharashtra color palettes (India Saffron, Ashoka Navy `#002B49`, and Deep Forest Green).
- **Accessibility & Sovereign Design:** High-contrast color ratios compliant with WCAG AA standards, formal header hierarchies, breadcrumb navigation, and clean structural framing.
- **Official Contact & Emergency Badges:** Instant access to 24x7 control room helplines (`1800-233-3764`, `0712-2567035`), emergency SOS triggers, and direct appellate authority escalation desks.

### 2. 🌐 Comprehensive Multi-Language Localization (i18n)
- **Tri-Lingual Support:** Full dynamic interface localization across **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.
- **Context-Aware Regional Vernaculars:** Precise Marathi and Hindi terminology for municipal departments (*नागपूर महानगरपालिका*, *सार्वजनिक बांधकाम विभाग*), administrative designations (*विभागीय नोडल अधिकारी*), and grievance workflows.

### 3. 🤖 DRISHTI Mitra AI Assistant & Voice Interface
- **AI-Powered Citizen Guidance:** Integrated floating and inline assistant ("Drishti Mitra") trained on municipal charters, citizen rights, and grievance drafting guidelines.
- **Multilingual Voice Capabilities:** Speech recognition and audio synthesis supporting 22 Eighth Schedule Indian languages.
- **Smart Form Pre-Filling:** Analyzes unstructured citizen descriptions to automatically categorize grievances into relevant ministries, departments, and priority bands.

### 4. 🔐 Multi-Portal Authentication & Onboarding
- **Citizen Login & OTP Authentication:** Secure mobile/email authentication with instant 6-digit OTP verification and demo-mode credential support.
- **Detailed Citizen Registration:** Capture of essential demographic data, Nagpur Municipal Zone selection (Dharampeth, Laxmi Nagar, Hanuman Nagar, Nehru Nagar, etc.), Ward numbers, and PIN codes.
- **Nodal PG Officer Portal (Parichay SSO):** Specialized administrative dashboard for authorized municipal officers with Government Single Sign-On (Parichay/Jan Parichay) authentication, role-based access control, and SLA timers.

### 5. 📊 Citizen Control Dashboard & Audit Trail
- **Live KPI Counter Cards:** Instant visual tracking of *Total Registered Grievances*, *Active / Under Investigation*, *Pending Officer Action*, and *Closed / Resolved* dockets.
- **Profile & Credential Management:** Update residential addresses, primary contact channels, emergency contact numbers, and security passwords.
- **Account Activity Audit Trail:** Immutable timestamped logs detailing portal logins, grievance submissions, status updates, reminder dispatches, and appeal filings.

### 6. 📝 Smart Grievance Registration & Immediate Summary Receipt
- **Multi-Media Evidence Upload:** Support for geo-tagged disaster photos, PDFs, and incident recordings with auto-validation.
- **Intelligent Triage & Auto-Assignment:** Dynamic routing to appropriate authorities (e.g., NMC Water Works, PWD Road Infrastructure, MahaMetro, MSEB Electricity).
- **Instant Printable Docket Summary:** Generates an official submission receipt containing unique Registration Number (`NMC-PG-2026-XXXX`), assigned Nodal Officer details (Name, Contact, Official Email, Office Address), expected SLA resolution date, and a downloadable PDF/print summary.

### 7. ⏱️ Interactive Status Tracking & Escalation ("Send Reminder")
- **Step-by-Step Horizontal Stepper:** Real-time visual timeline showing *Submitted → Under Preliminary Scrutiny → Forwarded to Nodal Officer → Field Inspection Ongoing → Resolution in Progress → Redressal Report Published*.
- **"Send Reminder" Escalation Action:** Citizens can dispatch formal reminder dockets if resolution exceeds predefined SLAs, triggering instant administrative notifications, priority escalation flags, and official audit entries.

### 8. 🏢 Local Nodal Officers Directory (Nagpur Region)
- **Nagpur Municipal Corporation (NMC) Directory:** Comprehensive directory across all 10 administrative zones (Dharampeth, Laxmi Nagar, Mangalwari, Satranjipura, Gandhibagh, Ashi Nagar, Nehru Nagar, Hanuman Nagar, Dhantoli, Lakadganj).
- **Public Works Department (PWD Nagpur Division):** Direct contact information for Superintending Engineers, Executive Engineers, and Assistant Engineers responsible for state highways, bridges, and flood barriers.

### 9. 👥 Community Hub & Crowd Verification ("Nearby Grievances")
- **Locality-Based Civic Feed:** Discover public grievances filed within a 2km to 10km radius across Nagpur localities (e.g., Sitabuldi, Sadar, Ramdaspeth, Trimurti Nagar, Pardi, Ambazari).
- **Crowd Verification & Upvoting:** Upvote community issues to increase municipal priority weighting and submit verified eyewitness comments while protecting citizen privacy.

### 10. 🗺️ GIS Disaster & Live Weather Risk Map
- **77 Nagpur Risk Hotspots:** Interactive geospatial map detailing high-risk flood, waterlogging, and structural vulnerability zones along the Nag River basin, Pili River corridor, Ambazari overflow channel, and major highway underpasses.
- **Live Open-Meteo Weather Model:** Real-time weather API integration with precipitation mm tracking, wind speeds, temperature, and dynamic 7-day risk forecasts (🔴 Severe, 🟡 Moderate, 🟢 Normal).
- **NDRF Station Locator & 1-Click SOS:** Direct contact information for nearest SDRF/NDRF rescue battalions, emergency shelters, and immediate hazard reporting tools.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 / Vite / TypeScript | Ultra-responsive, strictly typed single-page application |
| **Styling & Design System** | Tailwind CSS | Official Indian administrative design theme, custom tokens, WCAG AA contrast |
| **Geospatial & Mapping** | Leaflet / OpenStreetMap | Interactive GIS map with custom SVG pulsing markers and contour layers |
| **Meteorological Engine** | Open-Meteo REST API | Live hourly and 7-day weather forecasting for Nagpur coordinates (`21.1458° N, 79.0882° E`) |
| **Iconography & UI Assets** | Lucide React | Clean, scalable vector icons across all municipal workflows |
| **Internationalization** | Custom Multi-lingual Context | Fast, zero-overhead dynamic localization engine (EN / HI / MR) |
| **Animation & Transitions** | Motion / CSS3 Hardware-Accelerated | Smooth modal transitions, drawer animations, and status indicators |

---

## 📂 Project Directory Structure

```
├── public/
│   └── favicon.svg                  # Portal branding icon
├── src/
│   ├── components/
│   │   ├── DisasterWeatherMap.tsx   # GIS Interactive Map with 77 Nagpur Hotspots & Weather
│   │   ├── UserDashboardWorkflow.tsx# Comprehensive Citizen Portal & Multi-Step Views
│   │   ├── GrievanceStatusTimeline.tsx# Visual Milestone Tracking & Reminder Action
│   │   ├── NearbyGrievancesHub.tsx  # Neighborhood Crowd Verification & Upvoting Feed
│   │   ├── NodalOfficersDirectory.tsx# NMC & PWD Nagpur Department Contact Directories
│   │   ├── DrishtiAiMitra.tsx       # AI Grievance Assistant & Voice Interface
│   │   ├── OfficialHeader.tsx       # State Emblem, Top Banner & Accessibility Bar
│   │   ├── Navbar.tsx               # Main Portal Navigation & Menu Controls
│   │   ├── LandingHero.tsx          # Official CPGRAMS-style Hero Section
│   │   ├── RegistrationPage.tsx     # Citizen Account Creation Form
│   │   ├── LoginPage.tsx            # Citizen Login & OTP Authentication
│   │   ├── OfficerLoginPage.tsx     # Parichay SSO Officer Login
│   │   ├── EditProfileView.tsx      # Profile, Password & Activity Audit Trail
│   │   ├── StatusLookupModal.tsx    # Fast Grievance Search by Docket Number
│   │   └── ...                      # Additional supporting UI modals
│   ├── utils/
│   │   ├── nagpurHotspotsData.ts    # Comprehensive dataset of 77 Nagpur Risk Sites & Math Models
│   │   ├── nodalOfficerData.ts      # NMC & PWD Officer Directory and Auto-assignment Rules
│   │   └── mockGrievanceData.ts     # Sample Civic Grievances & Status Logs
│   ├── types/
│   │   └── index.ts                 # Centralized TypeScript Interfaces & Enums
│   ├── App.tsx                      # Root Application, Hash Routing & Toast Provider
│   ├── index.css                    # Tailwind CSS Configuration & Custom Scrollbars
│   └── main.tsx                     # React DOM Entrypoint
├── metadata.json                    # Application Manifest & Major Capabilities
├── package.json                     # Project Dependencies & Scripts
├── tsconfig.json                    # TypeScript Compiler Configuration
└── vite.config.ts                   # Vite Build System Configuration
```

---

## 🚀 Quickstart & Installation Guide

### Prerequisites
- **Node.js** >= `18.0.0`
- **npm** >= `9.0.0` or **yarn** / **pnpm**

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/drishti-grievance-portal.git
   cd drishti-grievance-portal
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:3000` to access the live DRISHTI portal.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔒 Security & Citizen Privacy Safeguards

- **Anonymized Civic Feeds:** Public neighborhood feeds mask sensitive personal citizen details (e.g., `Rajesh S.`, `98******12`) while keeping incident telemetry accessible for public awareness.
- **Role-Based Access Control:** Officer escalation menus and internal disposition logs are strictly restricted to authenticated Nodal Officers with official government credentials (`@nic.in` / `@gov.in`).
- **Cryptographic Docket Integrity:** Every submitted grievance generates a SHA-verifiable unique registration key ensuring audit-proof lifecycle tracking.

---

## 📞 Administrative Contact & Support

- **Nagpur Municipal Corporation (NMC) Head Office:**  
  Mahanagar Palika Marg, Civil Lines, Nagpur, Maharashtra - 440001
- **24x7 Disaster Emergency Helpline:** `1800-233-3764` / `0712-2567035`
- **Email Redressal Cell:** `grievance-support@nmcnagpur.gov.in`
- **National Emergency Response Support System:** Dial `112` / `108`

---

*DRISHTI is dedicated to transparent, responsive, and accountable governance through civic technology.*
