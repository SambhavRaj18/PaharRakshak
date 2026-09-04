// =========================================================================
// PaharRakshak - IndexedDB Storage Engine
// 100% Client-Side Persistent Offline Storage for B1, B6, B7
// =========================================================================

const DB_NAME = 'PaharRakshakDB';
const DB_VERSION = 1;

let dbInstance = null;

export function initDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      return resolve(dbInstance);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Slope Reports Store (B1)
      if (!db.objectStoreNames.contains('slopeReports')) {
        const slopeStore = db.createObjectStore('slopeReports', { keyPath: 'id', autoIncrement: true });
        slopeStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        slopeStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 2. Road Mesh Reports Store (B6)
      if (!db.objectStoreNames.contains('roadReports')) {
        const roadStore = db.createObjectStore('roadReports', { keyPath: 'id', autoIncrement: true });
        roadStore.createIndex('corridor', 'corridor', { unique: false });
        roadStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 3. Relayed Alerts Store (B1/B6)
      if (!db.objectStoreNames.contains('relayedAlerts')) {
        const alertStore = db.createObjectStore('relayedAlerts', { keyPath: 'id', autoIncrement: true });
        alertStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
}

// -------------------------------------------------------------
// B1: Slope Hazard Reports CRUD
// -------------------------------------------------------------
export async function saveSlopeReport(report) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('slopeReports', 'readwrite');
    const store = tx.objectStore('slopeReports');
    const item = {
      ...report,
      syncStatus: report.syncStatus || 'queued',
      timestamp: report.timestamp || Date.now()
    };
    const req = store.add(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllSlopeReports() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('slopeReports', 'readonly');
    const store = tx.objectStore('slopeReports');
    const req = store.getAll();
    req.onsuccess = () => {
      // Sort newest first
      const items = req.result || [];
      items.sort((a, b) => b.timestamp - a.timestamp);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function syncAllPendingReports() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('slopeReports', 'readwrite');
    const store = tx.objectStore('slopeReports');
    const req = store.getAll();

    req.onsuccess = () => {
      const items = req.result || [];
      let updatedCount = 0;
      items.forEach((item) => {
        if (item.syncStatus === 'queued') {
          item.syncStatus = 'synced';
          item.syncedAt = Date.now();
          store.put(item);
          updatedCount++;
        }
      });
      resolve(updatedCount);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearAllSlopeReports() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('slopeReports', 'readwrite');
    const store = tx.objectStore('slopeReports');
    const req = store.clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// -------------------------------------------------------------
// B6: Road Mesh Reports CRUD
// -------------------------------------------------------------
export async function saveRoadReport(roadReport) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('roadReports', 'readwrite');
    const store = tx.objectStore('roadReports');
    const item = {
      ...roadReport,
      timestamp: roadReport.timestamp || Date.now()
    };
    const req = store.add(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllRoadReports() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('roadReports', 'readonly');
    const store = tx.objectStore('roadReports');
    const req = store.getAll();
    req.onsuccess = () => {
      const items = req.result || [];
      items.sort((a, b) => b.timestamp - a.timestamp);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

// -------------------------------------------------------------
// B1/B6: Relayed Emergency Alerts CRUD
// -------------------------------------------------------------
export async function saveRelayedAlert(alert) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('relayedAlerts', 'readwrite');
    const store = tx.objectStore('relayedAlerts');
    const item = {
      ...alert,
      timestamp: alert.timestamp || Date.now()
    };
    const req = store.add(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllRelayedAlerts() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('relayedAlerts', 'readonly');
    const store = tx.objectStore('relayedAlerts');
    const req = store.getAll();
    req.onsuccess = () => {
      const items = req.result || [];
      items.sort((a, b) => b.timestamp - a.timestamp);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}
