// =========================================================================
// PaharRakshak - Module B7: Disaster-Ready Hills Assistant (Unifying Shell)
// Offline RAG Q&A, Curated Knowledge Base, Geolocation Shelter Locator
// =========================================================================

import { t, getLanguage } from './i18n.js';
import { aiEngine } from './ai-engine.js';

let emergencyKb = [];
let sheltersData = [];
let userLocation = { lat: 27.0360, lng: 88.2627, acquired: false }; // Default: Darjeeling Center

export async function initDisasterGuide() {
  const askAiBtn = document.getElementById('btn-ask-ai-guide');
  const askInput = document.getElementById('input-ai-question');
  const filterBtns = document.querySelectorAll('.shelter-filter-btn');

  // 1. Load Datasets
  await loadKnowledgeBase();
  await loadSheltersData();

  // 2. Request Geolocation
  acquireUserLocation();

  // 3. AI Query Handler
  if (askAiBtn && askInput) {
    askAiBtn.addEventListener('click', async () => {
      await handleAiQuery();
    });

    askInput.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        await handleAiQuery();
      }
    });
  }

  // 4. Shelter Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderSheltersList(e.target.dataset.filter);
    });
  });

  // Initial render
  renderGuidanceArticles();
  renderSheltersList('all');
}

async function loadKnowledgeBase() {
  try {
    const res = await fetch('./assets/data/emergency-kb.json');
    emergencyKb = await res.json();
  } catch (err) {
    console.warn('Failed to fetch emergency-kb.json, fallback array active:', err);
  }
}

async function loadSheltersData() {
  try {
    const res = await fetch('./assets/data/shelters.json');
    sheltersData = await res.json();
  } catch (err) {
    console.warn('Failed to fetch shelters.json:', err);
  }
}

function acquireUserLocation() {
  const gpsNotice = document.getElementById('gps-status-note');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          acquired: true
        };
        if (gpsNotice) {
          gpsNotice.innerText = `📍 GPS Active: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
        }
        renderSheltersList();
      },
      (err) => {
        console.warn('Geolocation error or permission denied, using hill center:', err);
        if (gpsNotice) {
          gpsNotice.innerText = t('gpsDisabledNote');
        }
        renderSheltersList();
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  }
}

async function handleAiQuery() {
  const askInput = document.getElementById('input-ai-question');
  const answerBox = document.getElementById('ai-answer-box');
  const askBtn = document.getElementById('btn-ask-ai-guide');

  const query = askInput.value.trim();
  if (!query) return;

  if (askBtn) {
    askBtn.disabled = true;
    askBtn.innerText = 'Searching Offline Knowledge Base...';
  }

  const result = await aiEngine.queryEmergencyKnowledgeBase(query, emergencyKb);

  if (answerBox) {
    answerBox.innerHTML = `
      <div class="ai-response-card card animate-fade-in">
        <div class="response-badge">🤖 Offline AI Response (Local RAG)</div>
        <div class="response-text">${formatMarkdown(result.answer)}</div>
      </div>
    `;
    answerBox.classList.remove('hidden');
  }

  if (askBtn) {
    askBtn.disabled = false;
    askBtn.innerText = t('askAiButton');
  }
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export function renderGuidanceArticles() {
  const container = document.getElementById('guidance-articles-accordion');
  if (!container || emergencyKb.length === 0) return;

  const lang = getLanguage();

  container.innerHTML = emergencyKb.map((item, idx) => {
    const title = item[`title_${lang}`] || item.title_en;
    const steps = item[`steps_${lang}`] || item.steps_en;
    const isFirst = idx === 0 ? 'open' : '';

    return `
      <details class="guide-accordion-item card" ${isFirst}>
        <summary class="guide-summary">
          <span class="guide-category-tag">${item.category}</span>
          <h4 class="guide-title">${title}</h4>
        </summary>
        <div class="guide-content">
          <ol class="guide-steps-list">
            ${steps.map(s => `<li>${s}</li>`).join('')}
          </ol>
        </div>
      </details>
    `;
  }).join('');
}

export function renderSheltersList(filter = 'all') {
  const container = document.getElementById('shelters-distance-list');
  if (!container || sheltersData.length === 0) return;

  const lang = getLanguage();

  // 1. Calculate Haversine Distance
  const rankedList = sheltersData.map(shelter => {
    const distanceKm = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      shelter.lat,
      shelter.lng
    );
    return { ...shelter, distanceKm };
  });

  // 2. Sort closest first
  rankedList.sort((a, b) => a.distanceKm - b.distanceKm);

  // 3. Filter if necessary
  const filtered = rankedList.filter(s => {
    if (filter === 'hospitals') return s.type.toLowerCase().includes('hospital') || s.type.toLowerCase().includes('phc');
    if (filter === 'shelters') return s.type.toLowerCase().includes('shelter') || s.type.toLowerCase().includes('camp');
    return true;
  });

  container.innerHTML = filtered.map(s => {
    const name = s[`name_${lang}`] || s.name;
    return `
      <div class="shelter-card card">
        <div class="shelter-card-header">
          <div>
            <h4 class="shelter-name">${name}</h4>
            <span class="shelter-type">${s.type}</span>
          </div>
          <div class="distance-badge">
            <span class="dist-num">${s.distanceKm.toFixed(1)}</span>
            <span class="dist-unit">${t('km')}</span>
          </div>
        </div>

        <div class="shelter-details">
          <div class="detail-row">
            <span>⛰️ ${t('elevationLabel')} ${s.elevation}</span>
            <span>🛏️ ${t('bedsLabel')} ${s.beds} beds</span>
          </div>
          <div class="detail-row">
            <span>📍 ${s.address}</span>
          </div>
          <div class="facilities-tags">
            ${s.facilities.map(f => `<span class="facility-pill">${f}</span>`).join('')}
          </div>
        </div>

        <div class="shelter-card-actions">
          <a href="tel:${s.contact.split('/')[0].trim()}" class="btn btn-sm btn-outline">📞 Call: ${s.contact}</a>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Haversine Distance formula in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}
