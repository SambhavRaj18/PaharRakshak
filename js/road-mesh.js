// =========================================================================
// PaharRakshak - Module B6: Road Status Mesh & Route Status Board
// Crowd-sourced Blockage Logging (Photo, Location, Time, Passability),
// On-device Spatio-Temporal AI Deduplication & Route Summaries
// =========================================================================

import { t, getLanguage } from './i18n.js';
import { aiEngine } from './ai-engine.js';
import { saveRoadReport, getAllRoadReports } from './db.js';
import { escapeHtml, stringSimilarity } from './utils.js';

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
    corridorSelect.innerHTML = MOUNTAIN_CORRIDORS.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
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

/**
 * Performs Spatio-Temporal Clustering & Deduplication on raw road reports
 * Clusters reports within 2 hours having matching corridor and fuzzy landmark similarity
 */
export function clusterAndDeduplicateReports(reports) {
  if (!reports || reports.length === 0) return [];

  // Sort by timestamp descending (newest first)
  const sorted = [...reports].sort((a, b) => b.timestamp - a.timestamp);
  const clusters = [];
  const assigned = new Set();
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

  for (let i = 0; i < sorted.length; i++) {
    if (assigned.has(i)) continue;

    const base = sorted[i];
    assigned.add(i);

    const cluster = {
      primary: base,
      corridor: base.corridor,
      reports: [base],
      locations: [base.locationDetail],
      hasPhoto: Boolean(base.photo),
      photo: base.photo,
      earliestTimestamp: base.timestamp,
      latestTimestamp: base.timestamp
    };

    for (let j = i + 1; j < sorted.length; j++) {
      if (assigned.has(j)) continue;

      const candidate = sorted[j];
      const isSameCorridor = candidate.corridor === base.corridor;
      const isWithinTimeWindow = Math.abs(base.timestamp - candidate.timestamp) <= TWO_HOURS_MS;
      const similarity = stringSimilarity(base.locationDetail, candidate.locationDetail);

      // Match if same corridor AND (within 2 hours OR landmark fuzzy similarity >= 0.45)
      if (isSameCorridor && (isWithinTimeWindow || similarity >= 0.45)) {
        assigned.add(j);
        cluster.reports.push(candidate);
        if (!cluster.locations.includes(candidate.locationDetail)) {
          cluster.locations.push(candidate.locationDetail);
        }
        if (!cluster.photo && candidate.photo) {
          cluster.photo = candidate.photo;
          cluster.hasPhoto = true;
        }
        cluster.earliestTimestamp = Math.min(cluster.earliestTimestamp, candidate.timestamp);
        cluster.latestTimestamp = Math.max(cluster.latestTimestamp, candidate.timestamp);
      }
    }

    // Determine consensus passability
    if (cluster.reports.some(r => r.passable === 'no')) {
      cluster.consensusPassability = 'no';
    } else if (cluster.reports.some(r => r.passable === 'caution')) {
      cluster.consensusPassability = 'caution';
    } else {
      cluster.consensusPassability = 'yes';
    }

    cluster.witnessCount = cluster.reports.length;
    clusters.push(cluster);
  }

  return clusters;
}

export async function renderRoadMesh() {
  const statusBoardContainer = document.getElementById('route-status-board');
  const feedContainer = document.getElementById('road-reports-feed');
  if (!statusBoardContainer || !feedContainer) return;

  const allReports = await getAllRoadReports();

  // 1. Group & Cluster by Corridor
  const corridorClusters = {};
  MOUNTAIN_CORRIDORS.forEach(c => { corridorClusters[c] = []; });

  allReports.forEach(r => {
    if (corridorClusters[r.corridor]) {
      corridorClusters[r.corridor].push(r);
    }
  });

  // 2. Render AI Summarized Route Board
  const summaryPromises = MOUNTAIN_CORRIDORS.map(async (corridor) => {
    const rawReports = corridorClusters[corridor] || [];
    const deduplicatedEvents = clusterAndDeduplicateReports(rawReports);
    const summaryText = await aiEngine.summarizeCorridorMesh(corridor, rawReports);
    
    let statusClass = 'status-open';
    if (deduplicatedEvents.some(e => e.consensusPassability === 'no')) {
      statusClass = 'status-blocked';
    } else if (deduplicatedEvents.some(e => e.consensusPassability === 'caution')) {
      statusClass = 'status-caution';
    } else if (rawReports.length === 0) {
      statusClass = 'status-neutral';
    }

    const dupNote = rawReports.length > deduplicatedEvents.length 
      ? `<span class="badge badge-synced" style="font-size: 0.7rem; margin-left: 6px;">⚡ ${rawReports.length - deduplicatedEvents.length} Duplicates Deduplicated</span>`
      : '';

    return `
      <div class="route-status-card card ${statusClass}">
        <div class="route-status-header">
          <h4 class="route-name">${escapeHtml(corridor)}</h4>
          <div>
            <span class="report-badge-pill">${deduplicatedEvents.length} event(s)</span>
            ${dupNote}
          </div>
        </div>
        <p class="route-summary-text">${escapeHtml(summaryText)}</p>
      </div>
    `;
  });

  const boardHtmls = await Promise.all(summaryPromises);
  statusBoardContainer.innerHTML = boardHtmls.join('');

  // 3. Render Deduplicated Live Mesh Feed
  const deduplicatedFeed = clusterAndDeduplicateReports(allReports);

  if (deduplicatedFeed.length === 0) {
    feedContainer.innerHTML = `<div class="empty-state">${t('noReportsYet')}</div>`;
    return;
  }

  feedContainer.innerHTML = deduplicatedFeed.slice(0, 10).map(cluster => {
    const timeAgo = formatTimeAgo(cluster.latestTimestamp);
    const passClass = cluster.consensusPassability === 'no' ? 'badge-critical' :
                      cluster.consensusPassability === 'caution' ? 'badge-high' : 'badge-synced';
    const passLabel = cluster.consensusPassability === 'no' ? t('passableNo') :
                      cluster.consensusPassability === 'caution' ? t('passableCaution') : t('passableYes');

    const witnessBadge = cluster.witnessCount > 1 
      ? `<span class="badge badge-synced" style="font-size: 0.72rem;">👥 ${cluster.witnessCount} Witness Confirmations (Deduplicated)</span>`
      : '';

    const locationsMerged = cluster.locations.map(l => escapeHtml(l)).join(' • ');

    return `
      <div class="feed-item card">
        <div class="feed-header">
          <span class="badge ${passClass}">${escapeHtml(passLabel)}</span>
          ${witnessBadge}
          <span class="feed-time">🕒 ${escapeHtml(timeAgo)}</span>
        </div>
        <div class="feed-body" style="display: flex; gap: 10px; align-items: flex-start;">
          ${cluster.photo ? `<img src="${cluster.photo}" style="width: 54px; height: 54px; border-radius: 6px; object-fit: cover; flex-shrink: 0;" alt="Blockage" />` : ''}
          <div>
            <strong>${escapeHtml(cluster.corridor)}</strong>
            <p class="feed-location" style="margin-top: 2px;">📍 ${locationsMerged}</p>
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
