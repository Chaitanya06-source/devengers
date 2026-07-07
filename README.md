🏛️ Companion — GenAI-Powered Civic Platform
Companion is an intelligent, GenAI-powered civic assistant platform designed to simplify government information, manage document requirements, log public complaints, and provide real-time accessibility accommodations to bridge the gap between citizens and local government.

🚀 Features
1. 🤖 Multilingual AI Companion (AI Chat)
Intelligent Guidance: Answers citizen queries about passports, voter registration, utility subsidies, and business licenses.
Multilingual Support: Supports dynamic chat switching between English 🇺🇸, Español 🇪🇸, हिन्दी 🇮🇳, Français 🇫🇷, العربية 🇸🇦, and 中文 🇨🇳.
Quick Action Chips: One-click shortcuts for standard service procedures.
Voice Simulation: Input prompts via simulated microphone controls.
Live Gemini Integration: Features a setup to hook into the Google Gemini API client-side or use a high-fidelity local rules simulator.
2. 📋 Document Helper & Rules Simplifier
Document Checklist: Check off items for a specific service (like passport applications) and see your preparation percentage.
Rules Simplifier: Paste confusing, jargon-heavy municipal legalese and notices to get clean, simplified action steps.
3. 📢 Civic Issue Reporter & Status Tracker
Interactive City Map Grid: Click to set neighborhood coordinates (Downtown, Westside, etc.) without heavy map packages.
AI Auto-categorization: Simulates image-scanning algorithms to detect and assign category tags to incident reports based on file attachments.
Incident Tracking Timeline: Track your submissions dynamically from Submitted ➔ Under Review ➔ Assigned ➔ Resolved.
4. 📊 Transparency & Analytics Dashboard
SVG Data Visualizations: Real-time trackers for average city resolution rates, turnaround times, and report distributions.
Capital Infrastructure Projects: Live tracking of voter-approved municipal development projects with budget amounts and completion bars.
5. ♿ Universal Accessibility Panel (Digital Inclusion)
Contrast Toggles: Switch between Dark Mode, Light Mode, High Contrast Dark (Black/Yellow), and High Contrast Light (White/Blue).
Dynamic Sizing: Adjust typography scales on-the-fly (100% to 150%).
Hover Screen Reader: Turn on the native Web SpeechSynthesis Screen Reader to read text elements aloud in the selected language.
🛠️ Technology Stack
Framework: React 19 + Vite 8
Styling: Vanilla CSS (highly custom HSL variables, responsive flex/grids, cyber-glass visuals)
API Model: Google Gemini 2.5 Flash API (with dynamic local fallback)
📁 Directory Structure
text

src/
├── assets/             # SVGs & Base Assets
├── components/         # Modular Components
│   ├── AIChat.jsx             # AI Assistant interface
│   ├── AccessibilityManager.jsx # Theme, scale, and speech synthesizers
│   ├── DeveloperSettings.jsx   # Gemini credential validations
│   ├── DocumentHelper.jsx     # Checklists & simplified guides
│   ├── IssueReporter.jsx      # Map selection & ticket submissions
│   ├── Sidebar.jsx            # Main app navigation
│   └── StatsDashboard.jsx     # Analytical dashboards
├── mockData/
│   └── servicesDb.js   # Local database of municipal services & procedures
├── utils/
│   └── aiEngine.js     # Fallback local analyzer & client-side Gemini connector
├── App.jsx             # Layout structure and core state
├── index.css           # Design tokens, variables, & accessibility overrides
└── main.jsx            # React root mount
💻 Local Installation & Setup
Clone / Download the Repository and navigate to the project root:

bash

cd devengers
Install dependencies:

bash

npm install
Run the development server:

bash

npm run dev
Open your browser and navigate to the local link (typically http://localhost:5173).
Build for production:

bash

npm run build
Generates optimized assets inside the /dist directory.
🔑 Developer API Key Configuration
To connect Companion to live generative AI:

Open the application and select Developer Settings on the bottom left sidebar.
Input your Gemini API key (you can generate a free key from Google AI Studio).
Click Test Connection to confirm connectivity.
Companion will transition from local database matching to real-time, context-aware AI text generation.
