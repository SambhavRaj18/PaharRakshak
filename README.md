# 🏔️ PaharRakshak (पहाडरक्षक / পাহাড়রক্ষক)
### Offline Landslide Reporter (B1) + Road Status Mesh (B6) + Disaster-Ready Hills Assistant (B7)
**GDG Siliguri — Code for Communities (Toy Train Edition)**

---

## 📌 Project Overview
**PaharRakshak** is a unified, 100% offline civic Progressive Web App (PWA) built specifically for the Darjeeling Himalayan Railway (DHR) corridor and mountain communities. During intense monsoon cloudbursts and landslides (like the October 2025 disaster where >300 mm of rain severed communication), cell towers and power grids routinely fail.

PaharRakshak absorbs **Problem Statements B1, B6, and B7** into one cohesive civic survival system:
1. **B1: Offline Landslide Reporter & Queue**:
   - Camera photo capture (`getUserMedia`) of slope fissures, rockfalls, or retaining wall bulges.
   - On-device vision analysis & AI hazard classification.
   - Generates plain-language risk notes and actionable safety steps.
   - Persistent `IndexedDB` storage with offline queuing (`queued`) and automatic sync status flipping (`synced`).
2. **B6: Road Status Mesh**:
   - Crowd-sourced road blockage reporting across key mountain corridors (NH-55, Rohini Road, Pankhabari Road, NH-110, Peshok Road, Mirik Road).
   - On-device AI deduplication and real-time route status board summarization.
3. **B7: Disaster-Ready Hills Assistant (Unifying Shell)**:
   - Curated emergency knowledge base for 12+ hill emergency scenarios (Landslides, Cloudbursts, Flash Floods, Cold Exposure/Hypothermia, PHC Medical Isolation, Spring Water Disinfection).
   - Conversational offline RAG Q&A assistant.
   - Distance-ranked Primary Health Centre (PHC), District Hospital, and Emergency Shelter Locator using browser Geolocation and Haversine distance calculations.
4. **B1/B6: P2P Zero-Network Alert Relay**:
   - Optical high-contrast QR beacon generator for zero-signal phone-to-phone alert transmission.
   - WebRTC DataChannel / Web Bluetooth transport simulation.
   - Client-side Web Audio emergency horn & Web Speech API Text-to-Speech (TTS).
5. **Belonging & Multilingual Engine**:
   - 100% full translation coverage for **Nepali (नेपाली), Hindi (हिंदी), Bengali (বাংলা), and English** across all UI strings, guides, and AI risk outputs.
   - **Sunlight High-Contrast Mode** optimized for low-end mobile screens under harsh mountain sunlight.

---

## 🤖 On-Device AI Architecture & Google Gemma Setup

PaharRakshak integrates Google's open **Gemma** models alongside the Chrome Prompt API and offline semantic fallback matrix:

| Layer | Technology | Role | Fallback Behavior |
|---|---|---|---|
| **Tier 1 (Local Gemma)** | **Google Gemma (`gemma4:e4b`, `gemma3:4b`, `gemma2:2b`, `codegemma:2b`)** via Local Runner (Ollama `http://localhost:11434`) | High-fidelity local conversational reasoning, RAG synthesis & slope risk narration | Shifts to Tier 2 if runner is inactive |
| **Tier 2 (Browser AI)** | **Chrome Built-in Prompt API (`window.ai` / Gemini Nano)** | Direct in-browser on-device LLM | Automatically shifts to Tier 3 if not present |
| **Tier 3 (Vision & Geology)** | **HTML5 Canvas Pixel Luminance & Edge Strain Matrix** | Slope moisture saturation & tension crack detection | Extracts texture gradient & edge variance locally |
| **Tier 4 (Local NLP Matrix)** | **Embedded Semantic Disaster Reasoning Engine & Local RAG** | Deterministic hazard risk categorization, localized action steps, corridor summarization | **Zero external server calls, 100% uptime guaranteed in Airplane Mode** |

---

### 📦 Gemma Offline Model Setup (GDG Siliguri Guidelines)

Complete this setup on your laptop before boarding or entering zero-connectivity zones:

#### 1. Windows Setup (PowerShell / Winget)
```powershell
# 1. Install Ollama local runner
winget install Ollama.Ollama

# 2. Pull the recommended Google Gemma model
ollama run gemma2:2b   # or gemma3:4b / gemma4:e4b

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

#### Recommended Model by Hardware:
- **8 GB RAM (Standard Laptops):** `gemma2:2b`, `gemma3:4b`, `gemma4:e4b`, `codegemma:2b`
- **16 GB+ RAM (Pro Laptops):** `gemma3:12b`, `gemma4:12b`, `codegemma:7b`

---

### 📱 Minimum Device Tested On
- **Minimum Hardware**: 2 GB RAM, Dual-Core Processor, 50 MB Free Storage.
- **Browsers**: Chrome 115+, Firefox 115+, Safari 16+, Edge 115+, or any modern PWA-compliant browser on Android/iOS/Windows/Linux/macOS.
- **Tested Environment**: Tested live in **Airplane Mode** (zero Wi-Fi, zero cellular data).

---

## 🚀 Live Demo & Offline Testing (Airplane Mode Pass)

### 1. Local Run
To run the PWA locally:
```bash
# Using Python
python -m http.server 8000

# Or using any static file server / VS Code Live Server
# Open http://localhost:8000 in your browser
```

### 2. Airplane Mode Demo Steps
1. Open the web app while connected once (to let the Service Worker cache all assets).
2. **Turn on Airplane Mode** on your device or disconnect Wi-Fi.
3. Refresh the page: notice the app loads instantaneously from the Service Worker cache.
4. Navigate through all 4 tabs:
   - **Slope Reporter (B1)**: Snap a photo or select an image -> Select hazard -> Click **"Analyze with On-Device AI"** -> View risk explanation and verify report is stored in the offline IndexedDB queue.
   - **Road Mesh (B6)**: Log a blockage on NH-55 -> Observe on-device AI updating the Route Status Board.
   - **Hills Assistant (B7)**: Type an emergency question (e.g., *"How to purify water?"*) -> Get grounded advice from the local knowledge base -> Check distance to nearest PHC/hospital.
   - **P2P Relay (B1/B6)**: Broadcast an emergency warning -> Generate the optical QR beacon -> Ingest alert on another device.
   - **Language Toggle**: Switch between Nepali, Hindi, Bengali, and English to see live localized UI and guidance.
   - **Sunlight Contrast**: Toggle the sunlight high-contrast mode for outdoor readability.

---

## 📂 File Structure
```
Code_for_Communities/
├── index.html                   # Master responsive PWA shell with 4 tabs
├── manifest.json                # PWA web app manifest
├── sw.js                        # Service worker with offline cache-first strategy
├── styles/
│   └── main.css                 # Glassmorphic mountain theme + sunlight high-contrast mode
├── js/
│   ├── app.js                   # Application orchestrator & tab state manager
│   ├── i18n.js                  # 4-language translation dictionary (EN, NE, HI, BN)
│   ├── db.js                    # IndexedDB persistent offline storage
│   ├── ai-engine.js             # Unified on-device AI reasoning & local RAG engine
│   ├── vision-analyzer.js       # Client-side canvas slope vision analyzer
│   ├── landslide-reporter.js    # B1 Landslide reporter & queue
│   ├── road-mesh.js             # B6 Road status mesh & route status board
│   ├── disaster-guide.js        # B7 Emergency RAG assistant & shelter GPS locator
│   └── peer-relay.js            # B1/B6 P2P alert relay, optical QR beacon & audio siren
└── assets/
    ├── icons/
    │   ├── icon-192.svg         # 192x192 SVG App Icon
    │   └── icon-512.svg         # 512x512 SVG App Icon
    └── data/
        ├── shelters.json        # Curated PHCs, hospitals & shelters with GPS coordinates
        └── emergency-kb.json    # 12+ hill emergency verified guidance articles
```

---

## 🏆 Hackathon Alignment Summary
- **Works Offline (25%)**: 100% functionality in Airplane Mode with Service Worker caching and IndexedDB.
- **Usefulness to the Hills (25%)**: Direct real-world utility for walkers (slope reporter), drivers (road mesh), and stranded citizens (disaster assistant & PHC locator).
- **On-Device AI Done Well (20%)**: Multi-tiered AI with local RAG, automated corridor clustering, and zero-fail local fallbacks.
- **Craft (15%)**: Ultra-lightweight zero-bloat bundle, fast cold load, sunlight high-contrast toggle, sound horn.
- **Belonging (15%)**: Authentic Himalayan context (NH-55, Rohini, Paglajhora, Tindharia DHR) and full 4-language support (**Nepali, Hindi, Bengali, English**).
