import { translations } from './translations.js';
import { showNotification } from './utils.js';
import { addPair } from './utils.js';
import { matchCaseEnabled, currentMode } from './main.js'; // Giả định export từ main

const LOCAL_STORAGE_KEY = 'local_settings';

export function loadModes() {
  const modeSelect = document.getElementById('mode-select');
  if (!modeSelect) return;
  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  const modes = Object.keys(settings.modes);
  modeSelect.innerHTML = '';
  modes.forEach(mode => {
    const option = document.createElement('option');
    option.value = mode;
    option.textContent = mode;
    modeSelect.appendChild(option);
  });
  modeSelect.value = currentMode;
  loadSettings();
}

export function loadSettings() {
  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  const modeSettings = settings.modes?.[currentMode] || { pairs: [], matchCase: false };
  const list = document.getElementById('punctuation-list');
  if (list) {
    list.innerHTML = '';
    if (!modeSettings.pairs || modeSettings.pairs.length === 0) {
      addPair('', '');
    } else {
      modeSettings.pairs.slice().reverse().forEach(pair => {
        addPair(pair.find || '', pair.replace || '');
      });
    }
  }
  matchCaseEnabled = modeSettings.matchCase || false;
}

export function saveSettings() {
  const pairs = [];
  const items = document.querySelectorAll('.punctuation-item');
  if (items.length === 0) {
    showNotification(translations.vn.noPairsToSave, 'error');
    return;
  }
  items.forEach(item => {
    const find = DOMPurify.sanitize(item.querySelector('.find')?.value || ''); // Bảo mật: sanitize input
    const replace = DOMPurify.sanitize(item.querySelector('.replace')?.value || ''); // Bảo mật
    if (find) pairs.push({ find, replace });
  });

  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  settings.modes[currentMode] = {
    pairs: pairs,
    matchCase: matchCaseEnabled
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  loadSettings();
  showNotification(translations.vn.settingsSaved.replace('{mode}', currentMode), 'success');
}

// Mới: Export settings to JSON
export function exportSettings() {
  let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'extension_settings.json';
  a.click();
  URL.revokeObjectURL(url);
  showNotification(translations.vn.settingsExported, 'success');
}

// Mới: Import settings from JSON
export function importSettings() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target.result);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          loadModes();
          showNotification(translations.vn.settingsImported, 'success');
        } catch (err) {
          console.error('Lỗi khi phân tích JSON:', err);
          showNotification(translations.vn.importError, 'error');
        }
      };
      reader.readAsText(file);
    }
  });
  input.click();
}
