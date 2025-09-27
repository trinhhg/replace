import { translations } from './translations.js';

export let currentLang = 'vn';

export function showMainUI() {
  document.querySelector(".container").style.display = "block";
  document.querySelector(".login-container").style.display = "none";
}

export function showLoginUI() {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".login-container").style.display = "flex";
}

export function showLoadingUI() {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".login-container").style.display = "none";
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; color: #333;';
  loadingDiv.textContent = translations.vn.loading;
  document.body.appendChild(loadingDiv);
}

export function hideLoadingUI() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) loadingDiv.remove();
}

export function updateLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  const elements = {
    appTitle: document.getElementById('app-title'),
    contactText1: document.getElementById('contact-text1'),
    settingsTab: document.getElementById('settings-tab'),
    replaceTab: document.getElementById('replace-tab'),
    splitTab: document.getElementById('split-tab'),
    settingsTitle: document.getElementById('settings-title'),
    modeLabel: document.getElementById('mode-label'),
    addMode: document.getElementById('add-mode'),
    copyMode: document.getElementById('copy-mode'),
    matchCase: document.getElementById('match-case'),
    findPlaceholder: document.getElementById('find-placeholder'),
    replacePlaceholder: document.getElementById('replace-placeholder'),
    removeButton: document.getElementById('remove-button'),
    addPair: document.getElementById('add-pair'),
    saveSettings: document.getElementById('save-settings'),
    replaceTitle: document.getElementById('replace-title'),
    inputText: document.getElementById('input-text'),
    replaceButton: document.getElementById('replace-button'),
    outputText: document.getElementById('output-text'),
    copyButton: document.getElementById('copy-button'),
    splitTitle: document.getElementById('split-title'),
    splitInputText: document.getElementById('split-input-text'),
    splitButton: document.getElementById('split-button'),
    output1Text: document.getElementById('output1-text'),
    output2Text: document.getElementById('output2-text'),
    output3Text: document.getElementById('output3-text'),
    output4Text: document.getElementById('output4-text'),
    copyButton1: document.getElementById('copy-button1'),
    copyButton2: document.getElementById('copy-button2'),
    copyButton3: document.getElementById('copy-button3'),
    copyButton4: document.getElementById('copy-button4'),
    exportSettings: document.getElementById('export-settings'),
    importSettings: document.getElementById('import-settings'),
    logoutLink: document.getElementById('logout-link')
  };

  if (elements.appTitle) elements.appTitle.textContent = translations[lang].appTitle;
  const textNode = Array.from(elements.contactText1.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
  if (textNode) {
    textNode.textContent = translations[lang].contactText1;
  } else {
    elements.contactText1.insertBefore(document.createTextNode(translations[lang].contactText1), elements.contactText1.firstChild);
  }
  if (elements.settingsTab) elements.settingsTab.textContent = translations[lang].settingsTab;
  if (elements.replaceTab) elements.replaceTab.textContent = translations[lang].replaceTab;
  if (elements.splitTab) elements.splitTab.textContent = translations[lang].splitTab;
  if (elements.settingsTitle) elements.settingsTitle.textContent = translations[lang].settingsTitle;
  if (elements.modeLabel) elements.modeLabel.textContent = translations[lang].modeLabel;
  if (elements.addMode) elements.addMode.textContent = translations[lang].addMode;
  if (elements.copyMode) elements.copyMode.textContent = translations[lang].copyMode;
  if (elements.matchCase) elements.matchCase.textContent = matchCaseEnabled ? translations[lang].matchCaseOn : translations[lang].matchCaseOff;
  if (elements.findPlaceholder) elements.findPlaceholder.placeholder = translations[lang].findPlaceholder;
  if (elements.replacePlaceholder) elements.replacePlaceholder.placeholder = translations[lang].replacePlaceholder;
  if (elements.removeButton) elements.removeButton.textContent = translations[lang].removeButton;
  if (elements.addPair) elements.addPair.textContent = translations[lang].addPair;
  if (elements.saveSettings) elements.saveSettings.textContent = translations[lang].saveSettings;
  if (elements.replaceTitle) elements.replaceTitle.textContent = translations[lang].replaceTitle;
  if (elements.inputText) elements.inputText.placeholder = translations[lang].inputText;
  if (elements.replaceButton) elements.replaceButton.textContent = translations[lang].replaceButton;
  if (elements.outputText) elements.outputText.placeholder = translations[lang].outputText;
  if (elements.copyButton) elements.copyButton.textContent = translations[lang].copyButton;
  if (elements.splitTitle) elements.splitTitle.textContent = translations[lang].splitTitle;
  if (elements.splitInputText) elements.splitInputText.placeholder = translations[lang].splitInputText;
  if (elements.splitButton) elements.splitButton.textContent = translations[lang].splitButton;
  if (elements.output1Text) elements.output1Text.placeholder = translations[lang].output1Text;
  if (elements.output2Text) elements.output2Text.placeholder = translations[lang].output2Text;
  if (elements.output3Text) elements.output3Text.placeholder = translations[lang].output3Text;
  if (elements.output4Text) elements.output4Text.placeholder = translations[lang].output4Text;
  if (elements.copyButton1) elements.copyButton1.textContent = translations[lang].copyButton + ' 1';
  if (elements.copyButton2) elements.copyButton2.textContent = translations[lang].copyButton + ' 2';
  if (elements.copyButton3) elements.copyButton3.textContent = translations[lang].copyButton + ' 3';
  if (elements.copyButton4) elements.copyButton4.textContent = translations[lang].copyButton + ' 4';
  if (elements.exportSettings) elements.exportSettings.textContent = translations[lang].exportSettings;
  if (elements.importSettings) elements.importSettings.textContent = translations[lang].importSettings;
  if (elements.logoutLink) elements.logoutLink.textContent = translations[lang].logoutText;

  const punctuationItems = document.querySelectorAll('.punctuation-item');
  punctuationItems.forEach(item => {
    const findInput = item.querySelector('.find');
    const replaceInput = item.querySelector('.replace');
    const removeBtn = item.querySelector('.remove');
    if (findInput) findInput.placeholder = translations[lang].findPlaceholder;
    if (replaceInput) replaceInput.placeholder = translations[lang].replacePlaceholder;
    if (removeBtn) removeBtn.textContent = translations[lang].removeButton;
  });

  const modeSelect = document.getElementById('mode-select');
  if (modeSelect) {
    loadModes();
  }
}

export function showUpdateDialog() {
  const overlay = document.createElement('div');
  overlay.id = 'update-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '10000';

  const dialog = document.createElement('div');
  dialog.id = 'update-dialog';
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.backgroundColor = '#fff';
  dialog.style.padding = '20px';
  dialog.style.borderRadius = '8px';
  dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  dialog.style.zIndex = '10001';
  dialog.style.maxWidth = '400px';
  dialog.style.width = '90%';
  dialog.style.textAlign = 'center';

  const title = document.createElement('h3');
  title.textContent = 'Thông báo từ TRINOVAVERS';
  title.style.margin = '0 0 10px 0';
  dialog.appendChild(title);

  const message = document.createElement('p');
  message.textContent = translations.vn.updateAvailable;
  message.style.margin = '20px 0';
  dialog.appendChild(message);

  const reloadButton = document.createElement('button');
  reloadButton.id = 'reload-btn';
  reloadButton.textContent = translations.vn.reloadButton;
  reloadButton.style.padding = '10px 20px';
  reloadButton.style.backgroundColor = '#007bff';
  reloadButton.style.color = '#fff';
  reloadButton.style.border = 'none';
  reloadButton.style.borderRadius = '5px';
  reloadButton.style.cursor = 'pointer';
  reloadButton.style.marginTop = '10px';
  reloadButton.addEventListener('click', () => {
    const userConfirmed = confirm("🔄 Trang đã có phiên bản mới.\nNhấn OK hoặc bấm F5 để tải lại.");
    if (userConfirmed) {
      saveInputState();
      location.replace(location.pathname + '?v=' + Date.now());
    }
  });
  dialog.appendChild(reloadButton);

  document.body.appendChild(overlay);
  document.body.appendChild(dialog);

  overlay.addEventListener('click', () => {
    overlay.remove();
    dialog.remove();
  });
}

// Mới: Thêm theme switch (dark/light)
export function addThemeSwitch() {
  const themeButton = document.createElement('button');
  themeButton.textContent = 'Chuyển theme';
  themeButton.className = 'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded';
  themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme'); // Thêm class CSS .dark-theme { background: #333; color: #fff; }
  });
  document.getElementById('header')?.appendChild(themeButton);
}

// Mới: Thêm tooltip hướng dẫn (ví dụ cho replace button)
export function addTooltips() {
  const replaceButton = document.getElementById('replace-button');
  if (replaceButton) {
    replaceButton.title = 'Nhấn để thay thế dấu câu trong văn bản đầu vào';
  }
  // Tương tự cho các element khác
}
