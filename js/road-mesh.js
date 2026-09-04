// =========================================================================
// PaharRakshak - Module B6: Road Status Mesh & Route Status Board
// Crowd-sourced Blockage Logging (Photo, Location, Time, Passability),
// On-device AI Deduplication & Route Summaries
// =========================================================================

import { t, getLanguage } from './i18n.js';
import { aiEngine } from './ai-engine.js';
import { saveRoadReport, getAllRoadReports } from './db.js';

const MOUNTAIN_CORRIDORS = [
  'NH-55 (Siliguri - Tindharia - Kurseong - Darjeeling)',
  'Rohini Road (Toll Gate - Kurseong bypass)',
  'Pankhabari Road (Longview - Kurseong steep ascent)',
  'NH-110 (Ghoom - Jorebunglow - Sonada stretch)',
  'Peshok Road (Jorebunglow - 6th Mile - Teesta Bridge)',
  'Mirik Road (Siliguri - Garidhura - Mirik - Sukhiapokhri)'
];

let roadPhotoDataUrl = null;

export function initRoadMesh() {
  const submitBtn = document.getElementById('btn-submit-road-report');
  const corridorSelect = document.getElementById('select-road-corridor');
  const photoInput = document.getElementById('input-road-photo-file');

  // Populate corridors
  if (corridorSelect && corridorSelect.children.length <= 1) {
    corridorSelect.innerHTML = MOUNTAIN_CORRIDORS.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          roadPhotoDataUrl = ev.target.result;
          const preview = document.getElementById('road-photo-preview-box');
          if (preview) {
            preview.innerHTML = `<img src="${roadPhotoDataUrl}" class="preview-image" alt="Road blockage observation" />`;
            preview.classList.remove('hidden');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      await handleRoadReportSubmission();
    });
  }

  renderRoadMesh();
}

async function handleRoadReportSubmission() {
  const corridorSelect = document.getElementById('select-road-corridor');
  const passabilitySelect = document.getElementById('select-road-passable');
  const locationInput = document.getElementById('input-road-location');
  const submitBtn = document.getElementById('btn-submit-road-report');

  const corridor = corridorSelect.value;
  const passable = passabilitySelect.value;
  const locationDetail = locationInput.value.trim() || 'General Milepost';

  if (!corridor) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = 'Broadcasting to Mesh...';
  }

  const report = {
    corridor,
    passable,
    locationDetail,
    photo: roadPhotoDataUrl,
    timestamp: Date.now()
  };

  await saveRoadReport(report);

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerText = t('submitRoadReport');
  }
  locationInput.value = '';
  roadPhotoDataUrl = null;
  const preview = document.getElementById('road-photo-preview-box');
  if (preview) preview.classList.add('hidden');

  await renderRoadMesh();
}

export async function renderRoadMesh() {
  const statusBoardContainer = document.getElementById('route-status-board');
  const feedContainer = document.getElementById('road-reports-feed');
  if (!statusBoardContainer || !feedContainer) return;

  const allReports = await getAllRoadReports();

  // 1. Group & Cluster by Corridor for Deduplication & Summarization (Spatial-temporal clustering)
  const corridorClusters = {};
  MOUNTAIN_CORRIDORS.forEach(c => { corridorClusters[c] = []; });

  allReports.forEach(r => {
    if (corridorClusters[r.corridor]) {
      corridorClusters[r.corridor].push(r);
    }
  });

  // 2. Render AI Summarized Route Board
  const summaryPromises = MOUNTAIN_CORRIDORS.map(async (corridor) => {
    const cluster = corridorClusters[corridor] || [];
    const summaryText = await aiEngine.summarizeCorridorMesh(corridor, cluster);
    
    let statusClass = 'status-open';
    if (cluster.some(r => r.passable === 'no')) {
      statusClass = 'status-blocked';
    } else if (cluster.some(r => r.passable === 'caution')) {
      statusClass = 'status-caution';
    } else if (cluster.length === 0) {
      statusClass = 'status-neutral';
    }

    return `
      <div class="route-status-card card ${statusClass}">
        <div class="route-status-header">
          <h4 class="route-name">${corridor}</h4>
          <span class="report-badge-pill">${cluster.length} report(s)</span>
        </div>
        <p class="route-summary-text">${summaryText}</p>
      </div>
    `;
  });

  const boardHtmls = await Promise.all(summaryPromises);
  statusBoardContainer.innerHTML = boardHtmls.join('');

  // 3. Render Recent Live Mesh Feed
  if (allReports.length === 0) {
    feedContainer.innerHTML = `<div class="empty-state">${t('noReportsYet')}</div>`;
    return;
  }

  feedContainer.innerHTML = allReports.slice(0, 10).map(r => {
    const timeAgo = formatTimeAgo(r.timestamp);
    const passClass = r.passable === 'no' ? 'badge-critical' :
                      r.passable === 'caution' ? 'badge-high' : 'badge-synced';
    const passLabel = r.passable === 'no' ? t('passableNo') :
                      r.passable === 'caution' ? t('passableCaution') : t('passableYes');

    return `
      <div class="feed-item card">
        <div class="feed-header">
          <span class="badge ${passClass}">${passLabel}</span>
          <span class="feed-time">🕒 ${timeAgo}</span>
        </div>
        <div class="feed-body" style="display: flex; gap: 10px;">
          ${r.photo ? `<img src="${r.photo}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" alt="Blockage" />` : ''}
          <div>
            <strong>${r.corridor}</strong>
            <p class="feed-location">📍 ${r.locationDetail}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function formatTimeAgo(ts) {
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 60) return t('timeAgoJustNow');
  const diffMin = Math.floor(diffSec / 60);
  return `${diffMin} ${t('timeAgoMins')}`;
}
