import { translations } from './translations.js';

export let currentLang = 'vn';

export function showMainUI() {
  const container = document.querySelector(".container");
  const loginContainer = document.querySelector(".login-container");
  if (container) container.style.display = "block";
  if (loginContainer) loginContainer.classList.add('hidden');
}

export function showLoginUI() {
  const container = document.querySelector(".container");
  const loginContainer = document.querySelector(".login-container");
  if (container) container.classList.add('hidden');
  if (loginContainer) loginContainer.classList.remove('hidden');
}

export function showLoadingUI() {
  const container = document.querySelector(".container");
  const loginContainer = document.querySelector(".login-container");
  if (container) container.classList.add('hidden');
  if (loginContainer) loginContainer.classList.add('hidden');
  let loadingDiv = document.getElementById('loading');
  if (!loadingDiv) {
    loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-4 rounded shadow-lg text-gray-800 dark:text-gray-200 z-50';
    loadingDiv.textContent = translations.vn.loading;
    document.body.appendChild(loadingDiv);
  }
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
    findPlaceholder: document.querySelector('#punctuation-list .find'),
    replacePlaceholder: document.querySelector('#punctuation-list .replace'),
    removeButton: document.querySelector('#punctuation-list .remove'),
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
    exportSettings: document.getElementById('export-settings'),
    importSettings: document.getElementById('import-settings'),
    logoutLink: document.getElementById('logout-link')
  };

  if (elements.appTitle) elements.appTitle.textContent = translations[lang].appTitle;
  if (elements.contactText1) {
    const textNode = Array.from(elements.contactText1.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = translations[lang].contactText1;
    else elements.contactText1.insertBefore(document.createTextNode(translations[lang].contactText1), elements.contactText1.firstChild);
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
}

export function attachTabEvents() {
  const tabButtons = document.querySelectorAll('.tab-button');
  if (!tabButtons) return;
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      const tabContents = document.querySelectorAll('.tab-content');
      const allButtons = document.querySelectorAll('.tab-button');
      tabContents.forEach(tab => tab.classList.add('hidden'));
      allButtons.forEach(btn => btn.classList.remove('active'));

      const selectedTab = document.getElementById(tabName);
      if (selectedTab) selectedTab.classList.remove('hidden');
      button.classList.add('active');
    });
  });
}

export function showUpdateDialog() {
  const overlay = document.createElement('div');
  overlay.id = 'update-overlay';
  overlay.className = 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40';
  const dialog = document.createElement('div');
  dialog.id = 'update-dialog';
  dialog.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-gray-800 dark:text-gray-200 z-50 max-w-md w-11/12 text-center';
  const title = document.createElement('h3');
  title.textContent = 'Thông báo từ TRINOVAVERS';
  title.className = 'text-xl font-bold mb-4';
  const message = document.createElement('p');
  message.textContent = translations.vn.updateAvailable;
  message.className = 'mb-6 text-gray-600 dark:text-gray-300';
  const reloadButton = document.createElement('button');
  reloadButton.id = 'reload-btn';
  reloadButton.textContent = translations.vn.reloadButton;
  reloadButton.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
  reloadButton.addEventListener('click', () => {
    const userConfirmed = confirm("🔄 Trang đã có phiên bản mới.\nNhấn OK hoặc bấm F5 để tải lại.");
    if (userConfirmed) {
      saveInputState();
      location.replace(location.pathname + '?v=' + Date.now());
    }
  });

  dialog.appendChild(title);
  dialog.appendChild(message);
  dialog.appendChild(reloadButton);
  document.body.appendChild(overlay);
  document.body.appendChild(dialog);

  overlay.addEventListener('click', () => {
    overlay.remove();
    dialog.remove();
  });
}

export function addThemeSwitch() {
  const header = document.getElementById('header');
  if (!header) return;
  const themeButton = document.createElement('button');
  themeButton.textContent = 'Chuyển theme';
  themeButton.className = 'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded';
  themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark-theme');
  }
  header.appendChild(themeButton);
}

export function addTooltips() {
  const replaceButton = document.getElementById('replace-button');
  if (replaceButton) replaceButton.title = 'Nhấn để thay thế dấu câu trong văn bản đầu vào';
  const splitButton = document.getElementById('split-button');
  if (splitButton) splitButton.title = 'Nhấn để chia văn bản thành các chương';
}
