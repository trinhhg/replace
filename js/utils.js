import { translations } from './translations.js';

export const INPUT_STORAGE_KEY = 'input_state';
export const INACTIVITY_LIMIT = 36000000;
export const CHECK_INTERVAL = 10000;

let lastActivity = Date.now();

export function saveInputState() {
  const state = {
    inputText: document.getElementById('input-text')?.value || '',
    outputText: document.getElementById('output-text')?.value || '',
    splitInputText: document.getElementById('split-input-text')?.value || '',
    outputs: Array.from({length: 10}, (_, i) => document.getElementById(`output${i+1}-text`)?.value || ''),
    punctuationItems: Array.from(document.querySelectorAll('.punctuation-item')).map(item => ({
      find: item.querySelector('.find')?.value || '',
      replace: item.querySelector('.replace')?.value || ''
    }))
  };
  localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(state));
}

export function restoreInputState() {
  const state = JSON.parse(localStorage.getItem(INPUT_STORAGE_KEY));
  if (!state) return;

  if (state.inputText) document.getElementById('input-text').value = state.inputText;
  if (state.outputText) document.getElementById('output-text').value = state.outputText;
  if (state.splitInputText) document.getElementById('split-input-text').value = state.splitInputText;
  state.outputs.forEach((text, i) => {
    const textarea = document.getElementById(`output${i+1}-text`);
    if (textarea) textarea.value = text;
  });
  const list = document.getElementById('punctuation-list');
  if (list && state.punctuationItems && state.punctuationItems.length > 0) {
    list.innerHTML = '';
    state.punctuationItems.slice().reverse().forEach(pair => {
      addPair(pair.find, pair.replace);
    });
  }
}

export function resetActivity() {
  lastActivity = Date.now();
  saveInputState();
}

export function checkIdle() {
  const now = Date.now();
  if (now - lastActivity > INACTIVITY_LIMIT && document.visibilityState === 'visible') {
    saveInputState();
    location.replace(location.pathname + '?v=' + Date.now());
  }
}

export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
  return str.replace(/[&<>"']/g, match => htmlEntities[match]);
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function showNotification(message, type = 'success') {
  const container = document.getElementById('notification-container');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `notification ${type} p-3 rounded shadow transition-opacity duration-300`;
  notification.textContent = message;
  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('opacity-0');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

export function countWords(text) {
  return text.trim() ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
}

export function updateWordCount(textareaId, counterId) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);
  if (textarea && counter) {
    const wordCount = countWords(textarea.value);
    counter.textContent = translations.vn.wordCount.replace('{count}', wordCount);
  }
}

export function addPair(find = '', replace = '') {
  const list = document.getElementById('punctuation-list');
  if (!list) return;

  const item = document.createElement('div');
  item.className = 'punctuation-item flex flex-col md:flex-row gap-2 mb-2';

  const findInput = document.createElement('input');
  findInput.type = 'text';
  findInput.className = 'find border p-2 mr-2 flex-1 rounded dark:border-gray-600 dark:bg-gray-700';
  findInput.placeholder = translations.vn.findPlaceholder;
  findInput.value = find;

  const replaceInput = document.createElement('input');
  replaceInput.type = 'text';
  replaceInput.className = 'replace border p-2 mr-2 flex-1 rounded dark:border-gray-600 dark:bg-gray-700';
  replaceInput.placeholder = translations.vn.replacePlaceholder;
  replaceInput.value = replace;

  const removeButton = document.createElement('button');
  removeButton.className = 'remove bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded';
  removeButton.textContent = translations.vn.removeButton;

  item.appendChild(findInput);
  item.appendChild(replaceInput);
  item.appendChild(removeButton);

  if (list.firstChild) {
    list.insertBefore(item, list.firstChild);
  } else {
    list.appendChild(item);
  }

  removeButton.addEventListener('click', () => {
    item.remove();
    saveInputState();
  });

  findInput.addEventListener('input', saveInputState);
  replaceInput.addEventListener('input', saveInputState);
}
