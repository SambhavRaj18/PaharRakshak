// =========================================================================
// PaharRakshak - Module B1: Offline Landslide Reporter & Queue
// Camera Capture, On-Device AI Classification & Risk Note, IndexedDB Storage
// =========================================================================

import { t, getLanguage } from './i18n.js';
import { VisionAnalyzer } from './vision-analyzer.js';
import { aiEngine } from './ai-engine.js';
import { saveSlopeReport, getAllSlopeReports, syncAllPendingReports, clearAllSlopeReports } from './db.js';

let currentPhotoDataUrl = null;
let videoStream = null;

export function initLandslideReporter() {
  const cameraBtn = document.getElementById('btn-camera-capture');
  const fileInput = document.getElementById('input-photo-file');
  const analyzeBtn = document.getElementById('btn-analyze-report');
  const syncBtn = document.getElementById('btn-sync-reports');
  const clearBtn = document.getElementById('btn-clear-reports');
  const videoElem = document.getElementById('camera-preview-video');
  const snapBtn = document.getElementById('btn-camera-snap');
  const closeCamBtn = document.getElementById('btn-camera-close');

  if (cameraBtn) {
    cameraBtn.addEventListener('click', async () => {
      await startCamera(videoElem);
    });
  }

  if (snapBtn) {
    snapBtn.addEventListener('click', () => {
      snapPhoto(videoElem);
    });
  }

  if (closeCamBtn) {
    closeCamBtn.addEventListener('click', () => {
      stopCamera();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPhotoPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
      await processAndSaveReport();
    });
  }

  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      const count = await syncAllPendingReports();
      alert(getLanguage() === 'ne' ? `${count} वटा रिपोर्टहरू सिंक गरियो!` :
            getLanguage() === 'hi' ? `${count} रिपोर्ट सफलतापूर्वक सिंक हुईं!` :
            getLanguage() === 'bn' ? `${count}টি রিপোর্ট সফলভাবে সিঙ্ক হয়েছে!` :
            `${count} report(s) successfully synced!`);
      await renderSlopeReportQueue();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (confirm(getLanguage() === 'ne' ? 'सबै रिपोर्टहरू मेटाउन चाहनुहुन्छ?' :
                  getLanguage() === 'hi' ? 'क्या आप सभी रिपोर्ट हटाना चाहते हैं?' :
                  getLanguage() === 'bn' ? 'সব রিপোর্ট মুছে ফেলতে চান?' :
                  'Are you sure you want to clear all stored reports?')) {
        await clearAllSlopeReports();
        await renderSlopeReportQueue();
      }
    });
  }

  // Load existing reports
  renderSlopeReportQueue();
}

async function startCamera(videoElem) {
  const container = document.getElementById('camera-stream-container');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Camera API is not supported in this browser. Please use the file upload option.');
    return;
  }

  try {
    if (videoStream) {
      stopCamera();
    }
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    videoElem.srcObject = videoStream;
    videoElem.play();
    if (container) container.classList.remove('hidden');
  } catch (err) {
    console.warn('Camera access error:', err);
    // Fallback trigger file input
    document.getElementById('input-photo-file').click();
  }
}

function snapPhoto(videoElem) {
  const canvas = document.createElement('canvas');
  canvas.width = videoElem.videoWidth || 640;
  canvas.height = videoElem.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  setPhotoPreview(dataUrl);
  stopCamera();
}

function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
  const container = document.getElementById('camera-stream-container');
  if (container) container.classList.add('hidden');
}

function setPhotoPreview(dataUrl) {
  currentPhotoDataUrl = dataUrl;
  const previewImg = document.getElementById('photo-preview-img');
  const previewContainer = document.getElementById('photo-preview-card');
  if (previewImg && previewContainer) {
    previewImg.src = dataUrl;
    previewContainer.classList.remove('hidden');
  }
}

async function processAndSaveReport() {
  const hazardTypeSelect = document.getElementById('select-hazard-type');
  const notesInput = document.getElementById('input-report-notes');
  const resultCard = document.getElementById('ai-analysis-result-card');
  const analyzeBtn = document.getElementById('btn-analyze-report');

  const hazardType = hazardTypeSelect.value;
  const notes = notesInput.value;

  // Show loading indicator
  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.innerText = t('analyzingText');
  }

  // 1. Analyze vision metrics if photo is present
  let visionData = { thumbnail: null, moistureIndex: 45, crackFissureDensity: 50 };
  if (currentPhotoDataUrl) {
    visionData = await VisionAnalyzer.analyzeImage(currentPhotoDataUrl);
  }

  // 2. Get AI Risk Note & Action Recommendations
  const aiResult = await aiEngine.explainSlopeRisk(hazardType, notes, visionData);

  // 3. Get current location coordinates if available
  let coordinates = { lat: 27.0360, lng: 88.2627, locationName: 'Darjeeling Hill Stretch' };
  try {
    if (navigator.geolocation) {
      const pos = await new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 });
      });
      coordinates = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        locationName: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`
      };
    }
  } catch (e) {
    // Geolocation fallback
  }

  // 4. Save to IndexedDB
  const newReport = {
    hazardType,
    userNotes: notes,
    thumbnail: visionData.thumbnail || currentPhotoDataUrl,
    riskLevel: aiResult.riskLevel,
    riskTitle: aiResult.riskTitle,
    riskExplanation: aiResult.riskExplanation,
    actionSteps: aiResult.actionSteps,
    coordinates,
    moistureIndex: visionData.moistureIndex,
    crackFissureDensity: visionData.crackFissureDensity,
    syncStatus: navigator.onLine ? 'synced' : 'queued',
    timestamp: Date.now()
  };

  await saveSlopeReport(newReport);

  // 5. Display AI Result Card
  displayAiResultCard(newReport);

  // 6. Reset form and refresh list
  if (analyzeBtn) {
    analyzeBtn.disabled = false;
    analyzeBtn.innerText = t('analyzeButton');
  }
  notesInput.value = '';

  await renderSlopeReportQueue();
}

function displayAiResultCard(report) {
  const resultCard = document.getElementById('ai-analysis-result-card');
  if (!resultCard) return;

  const severityBadgeClass = report.riskLevel === 'CRITICAL' ? 'badge-critical' :
                             report.riskLevel === 'HIGH' ? 'badge-high' : 'badge-medium';

  resultCard.innerHTML = `
    <div class="card result-banner animate-fade-in">
      <div class="result-header">
        <span class="badge ${severityBadgeClass}">⚠️ ${report.riskLevel} SEVERITY</span>
        <span class="badge badge-queued">${report.syncStatus === 'synced' ? '🟢 ' + t('syncedBadge') : '🟠 ' + t('queuedBadge')}</span>
      </div>
      <h3 class="result-title">${report.riskTitle}</h3>
      <p class="result-explanation">${report.riskExplanation}</p>
      
      <div class="vision-metrics-row">
        <div class="metric-box">
          <span class="metric-label">💧 Soil Moisture:</span>
          <span class="metric-val">${report.moistureIndex}%</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">⚡ Fissure Strain:</span>
          <span class="metric-val">${report.crackFissureDensity}%</span>
        </div>
      </div>

      <div class="action-steps-box">
        <h4>📋 Recommended Next Actions:</h4>
        <ul class="action-list">
          ${report.actionSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  resultCard.classList.remove('hidden');
}

export async function renderSlopeReportQueue() {
  const listContainer = document.getElementById('slope-reports-list');
  const countBadge = document.getElementById('queued-reports-count');
  if (!listContainer) return;

  const reports = await getAllSlopeReports();
  const queuedCount = reports.filter(r => r.syncStatus === 'queued').length;
  
  if (countBadge) {
    countBadge.innerText = `${queuedCount} queued`;
  }

  if (reports.length === 0) {
    listContainer.innerHTML = `<div class="empty-state">No hazard reports logged yet. Capture a slope observation above to queue offline.</div>`;
    return;
  }

  listContainer.innerHTML = reports.map(r => {
    const isSynced = r.syncStatus === 'synced';
    const dateStr = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const severityBadgeClass = r.riskLevel === 'CRITICAL' ? 'badge-critical' :
                               r.riskLevel === 'HIGH' ? 'badge-high' : 'badge-medium';

    return `
      <div class="report-queue-item card">
        <div class="item-header">
          <span class="badge ${severityBadgeClass}">${r.riskLevel}</span>
          <span class="badge ${isSynced ? 'badge-synced' : 'badge-queued'}">${isSynced ? t('syncedBadge') : t('queuedBadge')}</span>
          <span class="item-time">🕒 ${dateStr}</span>
        </div>

        <div class="item-body">
          ${r.thumbnail ? `<img src="${r.thumbnail}" class="item-thumbnail" alt="Slope observation" />` : ''}
          <div class="item-content">
            <h4 class="item-title">${r.riskTitle || t(r.hazardType)}</h4>
            <p class="item-note">${r.riskExplanation || r.userNotes || 'No additional note'}</p>
            <div class="item-meta">
              <span>📍 ${r.coordinates ? r.coordinates.locationName : 'Darjeeling Hill'}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
