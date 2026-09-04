// =========================================================================
// PaharRakshak - Main App Shell & State Orchestrator
// Coordinates B1, B6, B7 Modules, i18n, Service Worker, Gemma AI Setup & PWA Shell
// =========================================================================

import { t, setLanguage, getLanguage, translations } from './i18n.js';
import { initLandslideReporter, renderSlopeReportQueue } from './landslide-reporter.js';
import { initRoadMesh, renderRoadMesh } from './road-mesh.js';
import { initDisasterGuide, renderGuidanceArticles, renderSheltersList } from './disaster-guide.js';
import { initPeerRelay, renderRelayedAlerts, triggerEmergencySiren } from './peer-relay.js';
import { syncAllPendingReports } from './db.js';
import { aiEngine } from './ai-engine.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Setup Service Worker & PWA Install Prompt
  registerServiceWorker();
  setupPwaInstallPrompt();

  // 2. Setup Language Switcher
  setupLanguageSwitcher();

  // 3. Setup Sunlight High-Contrast Mode
  setupHighContrastMode();

  // 4. Setup Tab Navigation
  setupTabNavigation();

  // 5. Setup Network Status Monitor with Auto-Sync Background check
  setupNetworkMonitor();

  // 6. Setup Gemma AI Setup Modal & Status Pill
  setupAiStatusAndModal();

  // 7. Setup Emergency Horn Button
  const hornBtn = document.getElementById('global-horn-btn');
  if (hornBtn) {
    hornBtn.addEventListener('click', () => {
      triggerEmergencySiren();
    });
  }

  // 8. Initialize Feature Modules
  initLandslideReporter();
  initRoadMesh();
  await initDisasterGuide();
  initPeerRelay();

  // 9. Apply Initial Localized Strings
  updateAllTranslations();
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('✅ Service Worker registered with scope:', reg.scope))
        .catch((err) => console.warn('Service Worker registration failed:', err));
    });
  }
}

function setupLanguageSwitcher() {
  const langSelect = document.getElementById('global-lang-select');
  if (langSelect) {
    langSelect.value = getLanguage();
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      updateAllTranslations();
      renderSlopeReportQueue();
      renderRoadMesh();
      renderGuidanceArticles();
      renderSheltersList();
      renderRelayedAlerts();
    });
  }
}

function setupHighContrastMode() {
  const contrastToggle = document.getElementById('high-contrast-toggle');
  const savedContrast = localStorage.getItem('pahar_high_contrast') === 'true';

  if (savedContrast) {
    document.body.classList.add('high-contrast');
    if (contrastToggle) contrastToggle.checked = true;
  }

  if (contrastToggle) {
    contrastToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('high-contrast');
        localStorage.setItem('pahar_high_contrast', 'true');
      } else {
        document.body.classList.remove('high-contrast');
        localStorage.setItem('pahar_high_contrast', 'false');
      }
    });
  }
}

function setupTabNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  navTabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTab = btn.dataset.tab;

      navTabs.forEach(t => t.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

function setupNetworkMonitor() {
  const statusBadge = document.getElementById('network-status-badge');

  async function updateStatus() {
    if (!statusBadge) return;
    if (navigator.onLine) {
      statusBadge.className = 'status-badge online';
      statusBadge.innerHTML = `<span class="status-dot"></span> ${t('statusOnline')}`;
      
      // Auto-flip queued reports to synced when hotspot/network is detected (Phase 4 requirement)
      const syncedCount = await syncAllPendingReports();
      if (syncedCount > 0) {
        console.log(`⚡ Connectivity restored: ${syncedCount} queued reports auto-synced.`);
        renderSlopeReportQueue();
      }
    } else {
      statusBadge.className = 'status-badge offline';
      statusBadge.innerHTML = `<span class="status-dot"></span> ${t('statusOffline')}`;
    }
  }

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();
}

function setupAiStatusAndModal() {
  const pill = document.getElementById('ai-status-pill');
  const pillLabel = document.getElementById('ai-status-label');
  const modal = document.getElementById('gemma-setup-modal');
  const closeModalBtn = document.getElementById('btn-close-gemma-modal');
  const activeEngineLabel = document.getElementById('modal-active-engine');
  const endpointInput = document.getElementById('input-ollama-endpoint');
  const modelInput = document.getElementById('input-ollama-model');
  const saveConfigBtn = document.getElementById('btn-save-ai-config');
  const refreshBtn = document.getElementById('btn-refresh-ollama');
  const testBtn = document.getElementById('btn-run-gemma-test');
  const testInput = document.getElementById('input-test-prompt');
  const testOutput = document.getElementById('gemma-test-output');
  const testStatus = document.getElementById('test-sandbox-status');
  const modelsDatalist = document.getElementById('installed-models-datalist');

  function updateAiUi(status) {
    const backendName = status.activeBackend;
    if (pillLabel) {
      pillLabel.textContent = `🤖 ${backendName}`;
    }
    if (pill) {
      if (status.hasOllama || status.hasChromeAi) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    }
    if (activeEngineLabel) {
      activeEngineLabel.textContent = `${backendName} · ${status.hasOllama ? '🟢 Local Gemma Connected' : status.hasChromeAi ? '🟢 Built-in Prompt API Active' : '🟢 Standalone Local Matrix Ready'}`;
    }
    if (endpointInput) {
      endpointInput.value = status.ollamaEndpoint;
    }
    if (modelInput) {
      modelInput.value = status.ollamaModel;
    }
    if (modelsDatalist && status.installedModels.length > 0) {
      modelsDatalist.innerHTML = status.installedModels.map(m => `<option value="${m}"></option>`).join('');
    }
  }

  aiEngine.onStateChange(updateAiUi);
  updateAiUi(aiEngine.getAiStatus());

  // Modal open/close
  if (pill) {
    pill.addEventListener('click', () => {
      if (modal) modal.classList.remove('hidden');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // OS setup guide tabs
  const osTabs = document.querySelectorAll('[data-os-tab]');
  osTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.osTab;
      osTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      ['win', 'mac', 'linux'].forEach(os => {
        const pane = document.getElementById(`os-tab-${os}`);
        if (pane) {
          if (os === target) pane.classList.remove('hidden');
          else pane.classList.add('hidden');
        }
      });
    });
  });

  // Save config & refresh
  if (saveConfigBtn) {
    saveConfigBtn.addEventListener('click', async () => {
      const ep = endpointInput.value || 'http://localhost:11434';
      const mod = modelInput.value || 'gemma2:2b';
      saveConfigBtn.disabled = true;
      saveConfigBtn.textContent = 'Connecting...';
      await aiEngine.setOllamaConfig(ep, mod);
      saveConfigBtn.disabled = false;
      saveConfigBtn.textContent = 'Save & Connect';
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true;
      refreshBtn.textContent = 'Scanning...';
      await aiEngine.checkOllama();
      refreshBtn.disabled = false;
      refreshBtn.textContent = '🔄 Re-scan Local Runner';
    });
  }

  // Live prompt test runner
  if (testBtn && testInput && testOutput) {
    testBtn.addEventListener('click', async () => {
      const prompt = testInput.value.trim();
      if (!prompt) return;

      testBtn.disabled = true;
      testBtn.textContent = 'Generating...';
      if (testStatus) testStatus.textContent = 'Running inference...';
      testOutput.textContent = 'Processing prompt on-device...';

      try {
        const start = performance.now();
        const response = await aiEngine.generateText(prompt);
        const duration = Math.round(performance.now() - start);

        testOutput.textContent = response;
        if (testStatus) {
          testStatus.textContent = `Completed in ${duration}ms (${aiEngine.getActiveBackendName()})`;
        }
      } catch (err) {
        testOutput.textContent = `Error: ${err.message}`;
        if (testStatus) testStatus.textContent = 'Failed';
      } finally {
        testBtn.disabled = false;
        testBtn.textContent = '⚡ Run Test';
      }
    });
  }
}

export function updateAllTranslations() {
  const translatables = document.querySelectorAll('[data-i18n]');
  translatables.forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (key) {
      elem.innerText = t(key);
    }
  });

  const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  placeholders.forEach(elem => {
    const key = elem.getAttribute('data-i18n-placeholder');
    if (key) {
      elem.setAttribute('placeholder', t(key));
    }
  });
}

let deferredInstallPrompt = null;

function setupPwaInstallPrompt() {
  const installBtn = document.getElementById('btn-install-pwa');

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredInstallPrompt = e;
    console.log('📲 PWA install prompt ready.');
    
    if (installBtn) {
      installBtn.classList.remove('hidden');
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredInstallPrompt = null;
        installBtn.classList.add('hidden');
      } else {
        alert('To install PaharRakshak on your device:\n\n• Chrome/Edge: Click the install icon in the URL address bar or Menu (⋮) -> "Install App".\n• iOS Safari: Tap Share -> "Add to Home Screen".');
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('✅ PaharRakshak PWA was successfully installed.');
    if (installBtn) installBtn.classList.add('hidden');
  });
}

