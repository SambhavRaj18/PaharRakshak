# 🏔️ PaharRakshak (पहाडरक्षक / পাহাড়রক্ষक)
### Offline Landslide Reporter (B1) + Road Status Mesh (B6) + Disaster-Ready Hills Assistant (B7)
**GDG Siliguri — Code for Communities (Toy Train Edition)**

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

> **Design Decision**: On standard field smartphones in airplane mode without Ollama or Chrome experimental flags, Tier 3 (Sobel Vision Classifier & Spatio-Temporal Deduplication) and Tier 4 (Embedded RAG & Geo Search) execute locally with zero latency, ensuring no user is ever left stranded. When connected to a local emergency station running Gemma, Tier 1 is activated automatically.

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

## 🚀 Live Demo & Offline Testing (Airplane Mode Pass)

### 1. Local Run
```bash
# Using Python static server:
python -m http.server 8080

# Open http://localhost:8080 in your browser
```

### 2. Airplane Mode Demo Steps
1. Open the web app once to allow the Service Worker (`sw.js`) to cache all assets, icons, and datasets.
2. **Turn on Airplane Mode** on your device or disconnect Wi-Fi.
3. Refresh the page: the app loads instantaneously from the Service Worker cache with zero network errors.
4. Test the unified features:
   - **Slope Reporter (B1)**: Snap or upload a slope photo -> Notice the **⚡ AI Vision Classifier** automatically detect the hazard (e.g. Tension Crack) with confidence score -> Click **"Analyze with On-Device AI"** -> View the localized risk note and verify offline IndexedDB queuing.
   - **Road Mesh (B6)**: Log multiple reports for the same corridor (e.g., NH-55 Paglajhora) -> Notice the **Spatio-Temporal Deduplicator** merge them into a single incident with witness confirmation counts.
   - **Hills Assistant (B7)**: Ask an emergency question (e.g., *"Where is the nearest hospital?"*) -> View grounded RAG advice and distance-ranked medical centers sorted by your current GPS coordinates.
   - **P2P Relay**: Generate a real ISO QR code beacon and scan it with a second phone camera or optical scanner.
   - **Sunlight Contrast**: Toggle the high-contrast view for direct outdoor visibility.
   - **Language Toggle**: Switch between **Nepali, Hindi, Bengali, and English**.

---

## 📂 File Structure
```
PaharRakshak/
├── index.html                   # Master responsive PWA shell with 4 tabs
├── manifest.json                # PWA web app manifest
├── sw.js                        # Cache-first offline service worker
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
