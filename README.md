# 🏔️ PaharRakshak (पहाडरक्षक / পাহাড়রক্ষक)
### Offline Landslide Reporter (B1) + Road Status Mesh (B6) + Disaster-Ready Hills Assistant (B7)
**GDG Siliguri — Code for Communities (Toy Train Edition)**

---

## 📋 Hackathon Submission Details

| Criterion | Submission Specification |
|---|---|
| **Public Live PWA URL** | **[https://sambhavraj18.github.io/PaharRakshak/](https://sambhavraj18.github.io/PaharRakshak/)** (Installs as PWA and works 100% offline after one online load) |
| **Public Source Repository** | **[https://github.com/SambhavRaj18/PaharRakshak](https://github.com/SambhavRaj18/PaharRakshak)** |
| **On-Device Model(s) Used** | **1. Google Gemma 2 (2B)** via Local Runner (`gemma2:2b` on Ollama loopback `http://127.0.0.1:11434`)<br>**2. Chrome Built-in Prompt API (Gemini Nano)** (`window.ai.languageModel`)<br>**3. Client-Side Sobel Edge & Gradient Vision Classifier** (`VisionAnalyzer` on Canvas API)<br>**4. Spatio-Temporal Fuzzy Levenshtein Deduplication Engine** (`road-mesh.js`) |
| **Minimum Device Tested On** | **2 GB RAM, Dual-Core Processor, 50 MB Storage** (Tested on budget Android smartphone & Windows laptop in **Airplane Mode** with zero cellular and zero Wi-Fi) |
| **What Happens When Model is Unavailable** | **Multi-Tier Zero-Fail Graceful Degradation**:<br>• If Ollama/Gemma is not active, the system checks for Chrome's built-in Gemini Nano.<br>• If no local LLM runtime exists (e.g. standard field mobile in Airplane Mode), the app uses the **Client-Side Sobel Vision Classifier** to auto-detect slope fissures/saturation, the **Spatio-Temporal Deduplicator** to group road reports, and the **Local Embedded RAG Knowledge Matrix** (12 hill disaster guides + 10 geolocated PHCs/hospitals across **Nepali, Hindi, Bengali, English**).<br>• Result: **100% offline uptime, zero network crashes, zero empty screens.** |

---

## 🎥 2-Minute Demo Video Guide (Airplane Mode Visibly ON)

| Time | Action / Feature Demo | What to Highlight on Screen |
|---|---|---|
| **0:00 - 0:15** | **Airplane Mode & PWA Cold Start** | Show **Airplane Mode icon visibly ON** in system tray / status bar. Refresh or launch PaharRakshak PWA from home screen / browser cache. |
| **0:15 - 0:45** | **Module B1: Offline Landslide Reporter** | 1. Snap or select a slope fissure photo.<br>2. Show the **⚡ AI Vision Classifier** automatically detect *Ground Tension Crack* (with confidence score).<br>3. Click **"Analyze with On-Device AI"** to generate localized risk explanation & safety actions.<br>4. Show report stored in persistent offline IndexedDB queue (`queued`). |
| **0:45 - 1:15** | **Module B6: Road Status Mesh & Deduplication** | 1. Log multiple blockage reports for *NH-55 (Paglajhora)*.<br>2. Show on-device **Spatio-Temporal Deduplicator** merge them into a single incident card with **👥 Witness Confirmation counts** and consensus passability. |
| **1:15 - 1:40** | **Module B7: Disaster-Ready Hills Assistant & PHC Locator** | 1. Ask emergency query: *"Where is the nearest hospital?"*<br>2. Show grounded RAG response and distance-sorted list of real PHCs/hospitals (Kurseong Sub-Divisional Hospital, Tindharia Block PHC, Darjeeling District Hospital) via Haversine calculation.<br>3. Toggle language between **Nepali (नेपाली), Hindi (हिंदी), Bengali (বাংলা), English**. |
| **1:40 - 2:00** | **P2P Zero-Network QR Relay & Emergency Horn** | 1. Click **"Transmit Alert Broadcast"** in P2P Relay to display real ISO standard QR beacon.<br>2. Scan via second device camera or simulate scanner.<br>3. Sound the **Emergency Horn** audio siren. |

---

## 📌 Project Overview
**PaharRakshak** is a unified, 100% offline civic Progressive Web App (PWA) engineered specifically for the Darjeeling Himalayan Railway (DHR) corridor and vulnerable mountain communities. During severe monsoon cloudbursts and landslides (such as the October 2025 disaster where >300 mm of rain severed communication), cell towers and power grids routinely fail.

PaharRakshak unifies **Problem Statements B1, B6, and B7** into one cohesive civic survival system:

1. **B1: Offline Landslide Reporter & Queue**:
   - **On-Device Vision Classifier**: Uses HTML5 Canvas and 2D **Sobel Edge Gradients**, pixel luminance, and vegetation/mud ratios to detect shear lines, tension cracks, and water seepage. Auto-predicts hazard classification (`hazardCrack`, `hazardSeepage`, `hazardWallBulge`, `hazardTiltedTrees`, `hazardDebris`) with confidence scoring.
   - Generates plain-language risk explanations and immediate safety action steps in 4 languages.
   - Persistent `IndexedDB` storage with offline queuing (`queued`) and automatic sync status flipping (`synced`).

2. **B6: Road Status Mesh & Route Status Board**:
   - Crowd-sourced road blockage reporting across key mountain corridors (NH-55, Rohini Road, Pankhabari Road, NH-110, Peshok Road, Mirik Road).
   - **On-Device Spatio-Temporal AI Deduplication**: Clusters incoming reports within a 2-hour window using corridor matching and fuzzy Levenshtein landmark similarity to determine consensus passability and aggregate witness confirmations.
   - Real-time route status board summarizing corridor health.

3. **B7: Disaster-Ready Hills Assistant (Unifying Shell)**:
   - Curated emergency knowledge base for 12+ hill emergency scenarios (Landslides, Cloudbursts, Flash Floods, Cold Exposure/Hypothermia, PHC Medical Isolation, Spring Water Disinfection).
   - Distance-ranked Primary Health Centre (PHC), District Hospital, and Emergency Shelter Locator using browser Geolocation and Haversine distance calculations.
   - Grounded Offline RAG Q&A assistant with dynamic spatial awareness.

4. **Zero-Network P2P Emergency Relay**:
   - **Real ISO QR Code Encoder**: Implements ISO/IEC 18004 standard QR generation with Reed-Solomon Error Correction (no third-party server or CDN required).
   - **Real Optical QR Scanner**: Reads broadcast QR codes directly via `BarcodeDetector` camera feed or captured photo.
   - WebRTC DataChannel / manual SDP exchange for device-to-device offline transmission.
   - Client-side Web Audio emergency horn & Web Speech API Text-to-Speech (TTS).

5. **Belonging & Multilingual Engine**:
   - 100% full translation coverage for **Nepali (नेपाली), Hindi (हिंदी), Bengali (বাংলা), and English** across all UI strings, guides, and AI risk outputs.
   - **Sunlight High-Contrast Mode** optimized for low-end mobile screens under harsh mountain sunlight.

---

## 🤖 Tiered On-Device AI Architecture

PaharRakshak uses a tiered offline architecture designed to operate seamlessly across both presenter laptops and low-end field mobile phones:

| Tier | Technology | Target Environment | Capabilities |
|---|---|---|---|
| **Tier 1 (Emergency Node / Presenter Laptop)** | **Google Gemma 2 (2B) / Gemma 3 / Gemma 4** via Local Runner (Ollama loopback `http://127.0.0.1:11434`) | Laptop / Emergency Control Node / Local Host | High-fidelity local conversational reasoning, situational RAG synthesis, dynamic risk analysis. |
| **Tier 2 (Modern Mobile Browser)** | **Chrome Built-in Prompt API (`window.ai` / Gemini Nano)** | Android / Chrome Canary on supported devices | On-device generative responses without local server daemons. |
| **Tier 3 (Algorithmic On-Device AI)** | **Client-Side Sobel Edge Filters, Color Metrics & Spatio-Temporal Mesh Clustering** | All Mobile & Desktop Browsers (100% universal) | Automated photo hazard classification, tension crack strain index, and road report deduplication. |
| **Tier 4 (Embedded Local RAG Matrix)** | **Local Knowledge Base & Haversine Geo-spatial Search** | All Devices (100% Offline) | Grounded emergency triage, distance-ranked hospital finder, and multi-language safety action steps. |

---

## 📦 Gemma Offline Model Setup

Complete this setup to run Google Gemma locally on your presenting laptop:

#### 1. Windows Setup (PowerShell / Winget)
```powershell
# 1. Install Ollama runner
winget install Ollama.Ollama

# 2. Pull the recommended Google Gemma model
ollama run gemma2:2b

# 3. Launch with browser CORS enabled (in a separate terminal)
$env:OLLAMA_ORIGINS="*" ; ollama serve
```

#### 2. macOS Setup (Homebrew)
```bash
brew install ollama
ollama run gemma2:2b
OLLAMA_ORIGINS="*" ollama serve
```

#### 3. Linux Setup (Terminal)
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run gemma2:2b
OLLAMA_ORIGINS="*" ollama serve
```

---

## 🚀 Local Run & PWA Offline Verification

```bash
# Start local static server
python -m http.server 8080

# Open in browser
http://localhost:8080
```

1. Load the page once so the Service Worker (`sw.js`) caches all assets.
2. Turn on **Airplane Mode**.
3. Reload and interact with all 4 modules completely offline.

---

## 📂 File Structure
```
PaharRakshak/
├── index.html                   # Master responsive PWA shell with 4 tabs
├── manifest.json                # PWA web app manifest
├── sw.js                        # Cache-first offline service worker (v1.1.0)
├── netlify.toml                 # Netlify PWA deployment & MIME headers
├── styles/
│   └── main.css                 # Glassmorphic mountain theme + sunlight high-contrast mode
├── js/
│   ├── app.js                   # Application orchestrator & tab state manager
│   ├── utils.js                 # Safe HTML escaping, Levenshtein distance & fuzzy string matching
│   ├── i18n.js                  # 4-language translation dictionary (EN, NE, HI, BN)
│   ├── db.js                    # IndexedDB persistent offline storage
│   ├── ai-engine.js             # Multi-tier AI engine (Ollama Gemma, Chrome Prompt API, Local RAG)
│   ├── vision-analyzer.js       # Sobel edge gradient & color hazard vision classifier
│   ├── qr-codec.js              # Standalone ISO/IEC 18004 QR encoder with Reed-Solomon ECC
│   ├── landslide-reporter.js    # B1 Landslide reporter & queue with auto-classification
│   ├── road-mesh.js             # B6 Road mesh with spatio-temporal deduplication
│   ├── disaster-guide.js        # B7 Emergency RAG assistant & Haversine shelter locator
│   └── peer-relay.js            # P2P alert relay, optical QR beacon & camera scanner
└── assets/
    ├── icons/
    │   ├── icon-192.svg         # 192x192 SVG App Icon
    │   └── icon-512.svg         # 512x512 SVG App Icon
    └── data/
        ├── shelters.json        # 10 real PHCs, hospitals & shelters with coordinates
        └── emergency-kb.json    # 12 hill emergency verified guidance articles (4 languages)
```

---

## 🏆 Hackathon Rubric Alignment
- **Works Offline (25%)**: 100% functionality in Airplane Mode with Service Worker caching and IndexedDB.
- **Usefulness to the Hills (25%)**: Direct real-world utility for pedestrians (slope reporter), drivers (road mesh), and isolated citizens (disaster assistant & PHC locator).
- **On-Device AI Done Well (20%)**: Multi-tiered AI with local Gemma 2 (2B) integration, client-side Sobel vision classification, and spatio-temporal road report deduplication.
- **Craft (15%)**: Zero-bloat vanilla architecture, fast cold start, sunlight high-contrast toggle, sound horn, and standard QR camera scanning.
- **Belonging (15%)**: Authentic Himalayan context (NH-55, Rohini, Paglajhora, Tindharia DHR) and full 4-language support (**Nepali, Hindi, Bengali, English**).
