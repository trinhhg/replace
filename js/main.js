import { initFirebase } from './firebase.js';
import { translations } from './translations.js';
import { handleAuthStateChange, handleLogin, handleLogout, addPaymentButton } from './auth.js';
import { updateLanguage, attachTabEvents, showUpdateDialog, addThemeSwitch, addTooltips } from './ui.js';
import { loadModes, saveSettings, exportSettings, importSettings } from './settings.js';
import { replaceText } from './replace.js';
import { updateSplitModeUI, handleSplit, addSplitModeButtons } from './split.js';
import { showNotification, resetActivity, checkIdle, restoreInputState, updateWordCount, saveInputState } from './utils.js';
import { currentMode, matchCaseEnabled } from './settings.js'; // Export nếu cần

document.addEventListener('DOMContentLoaded', () => {
  const { auth, db } = initFirebase();

  // Gắn sự kiện hoạt động
  ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'].forEach(event => document.addEventListener(event, resetActivity));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkIdle();
  });
  setInterval(checkIdle, CHECK_INTERVAL);

  // Auth and UI
  handleAuthStateChange(auth, db);
  handleLogin(auth, db);
  handleLogout(auth);
  addPaymentButton(); // Nâng cấp auth/gia hạn

  // Check version
  checkVersionLoop();

  // Update language and load
  updateLanguage('vn');
  loadModes();
  attachTabEvents();
  addSplitModeButtons();
  updateSplitModeUI(2);
  addThemeSwitch(); // Nâng cấp UI/UX
  addTooltips(); // Nâng cấp UI/UX

  // Attach button events
  attachButtonEvents();

  function attachButtonEvents() {
    const matchCaseButton = document.getElementById('match-case');
    if (matchCaseButton) matchCaseButton.addEventListener('click', () => {
      matchCaseEnabled = !matchCaseEnabled;
      matchCaseButton.textContent = matchCaseEnabled ? translations.vn.matchCaseOn : translations.vn.matchCaseOff;
      matchCaseButton.style.background = matchCaseEnabled ? '#28a745' : '#6c757d';
      saveSettings();
    });

    const addModeButton = document.getElementById('add-mode');
    if (addModeButton) addModeButton.addEventListener('click', () => {
      const newMode = prompt(translations.vn.newModePrompt);
      if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
        let settings = JSON.parse(localStorage.getItem('local_settings')) || { modes: { default: { pairs: [], matchCase: false } } };
        if (settings.modes[newMode]) return showNotification(translations.vn.invalidModeName, 'error');
        settings.modes[newMode] = { pairs: [], matchCase: false };
        localStorage.setItem('local_settings', JSON.stringify(settings));
        currentMode = newMode;
        loadModes();
        showNotification(translations.vn.modeCreated.replace('{mode}', newMode), 'success');
      } else {
        showNotification(translations.vn.invalidModeName, 'error');
      }
    });

    const replaceButton = document.getElementById('replace-button');
    if (replaceButton) replaceButton.addEventListener('click', () => {
      const inputTextArea = document.getElementById('input-text');
      let settings = JSON.parse(localStorage.getItem('local_settings')) || { modes: { default: { pairs: [], matchCase: false } } };
      const modeSettings = settings.modes[currentMode] || { pairs: [], matchCase: false };
      const pairs = modeSettings.pairs || [];
      if (pairs.length === 0) return showNotification(translations.vn.noPairsConfigured, 'error');
      const outputText = replaceText(inputTextArea.value, pairs, modeSettings.matchCase);
      const outputTextArea = document.getElementById('output-text');
      outputTextArea.value = outputText;
      inputTextArea.value = '';
      updateWordCount('input-text', 'input-word-count');
      updateWordCount('output-text', 'output-word-count');
      showNotification(translations.vn.textReplaced, 'success');
      saveInputState();
    });

    const splitButton = document.getElementById('split-button');
    if (splitButton) splitButton.addEventListener('click', handleSplit);

    const exportSettingsButton = document.getElementById('export-settings');
    if (exportSettingsButton) exportSettingsButton.addEventListener('click', exportSettings);

    const importSettingsButton = document.getElementById('import-settings');
    if (importSettingsButton) importSettingsButton.addEventListener('click', importSettings);

    const saveSettingsButton = document.getElementById('save-settings');
    if (saveSettingsButton) saveSettingsButton.addEventListener('click', saveSettings);

    const addPairButton = document.getElementById('add-pair');
    if (addPairButton) addPairButton.addEventListener('click', () => addPair());

    // Tương tự cho các button khác từ original
  }
});

async function checkVersionLoop() {
  try {
    const baseURL = 'https://trinhhg.github.io/tienichtrinhhg';
    const versionResponse = await fetch(`${baseURL}/version.json?${Date.now()}`, {
      cache: 'no-store'
    });
    if (!versionResponse.ok) throw new Error('Không thể tải version.json');
    const versionData = await versionResponse.json();

    if (!currentVersion) {
      currentVersion = versionData.version;
    } else if (versionData.version !== currentVersion) {
      setTimeout(() => {
        showUpdateDialog();
      }, 360000);
      return;
    }
    setTimeout(checkVersionLoop, 5000);
  } catch (err) {
    setTimeout(checkVersionLoop, 5000);
  }
}
let currentVersion = null;
checkVersionLoop();
