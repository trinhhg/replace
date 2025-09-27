import { translations } from './translations.js';
import { showNotification, countWords, updateWordCount, saveInputState } from './utils.js';
import { exportToPDF } from './replace.js';

export let currentSplitMode = 2;

export function updateSplitModeUI(mode) {
  currentSplitMode = mode;
  const splitContainer = document.querySelector('.split-container');
  if (!splitContainer) return;
  splitContainer.classList.remove(...Array.from({length: 9}, (_, i) => `split-${i+2}`));
  splitContainer.classList.add(`split-${mode}`);

  const splitOutputs = document.getElementById('split-outputs');
  if (!splitOutputs) return;
  splitOutputs.innerHTML = '';

  for (let i = 1; i <= mode; i++) {
    const section = document.createElement('div');
    section.id = `output${i}-section`;
    section.className = 'output-section flex-1 min-w-[200px] bg-white dark:bg-gray-700 p-4 rounded shadow-md';

    const textarea = document.createElement('textarea');
    textarea.id = `output${i}-text`;
    textarea.placeholder = translations.vn[`output${i}Text`] || `Kết quả chương ${i} sẽ xuất hiện ở đây...`;
    textarea.rows = 10;
    textarea.className = 'w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100';
    textarea.addEventListener('input', () => updateWordCount(`output${i}-text`, `output${i}-word-count`));

    const counter = document.createElement('p');
    counter.id = `output${i}-word-count`;
    counter.textContent = translations.vn.wordCount.replace('{count}', 0);
    counter.className = 'text-gray-600 dark:text-gray-400 text-sm mt-1 text-center';

    const copyButton = document.createElement('button');
    copyButton.textContent = translations.vn.copyButton + ` ${i}`;
    copyButton.className = 'bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded w-full mt-2';
    copyButton.addEventListener('click', () => copyOutput(i));

    const exportButton = document.createElement('button');
    exportButton.textContent = translations.vn.exportPDF;
    exportButton.className = 'bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded w-full mt-1';
    exportButton.addEventListener('click', () => {
      const text = document.getElementById(`output${i}-text`).value;
      exportToPDF(text, `Chương ${i}`);
    });

    section.appendChild(textarea);
    section.appendChild(counter);
    section.appendChild(copyButton);
    section.appendChild(exportButton);
    splitOutputs.appendChild(section);
  }

  const inputText = document.getElementById('split-input-text');
  if (inputText) {
    inputText.value = '';
    updateWordCount('split-input-text', 'split-input-word-count');
  }
  saveInputState();
}

function copyOutput(index) {
  const textarea = document.getElementById(`output${index}-text`);
  if (textarea && textarea.value) {
    navigator.clipboard.writeText(textarea.value).then(() => {
      showNotification(translations.vn.textCopied, 'success');
    }).catch(() => {
      showNotification(translations.vn.failedToCopy, 'error');
    });
  } else {
    showNotification(translations.vn.noTextToCopy, 'error');
  }
}

export function handleSplit() {
  showLoadingUI();
  setTimeout(() => {
    const inputTextArea = document.getElementById('split-input-text');
    if (!inputTextArea || !inputTextArea.value.trim()) {
      showNotification(translations.vn.noTextToSplit, 'error');
      hideLoadingUI();
      return;
    }

    let text = DOMPurify.sanitize(inputTextArea.value);
    let chapterNum = 1;
    let chapterTitle = '';

    const chapterRegex = /^[Cc]hương\s+(\d+)(?::\s*(.*))?$/m;
    const lines = text.split('\n');
    let contentStartIndex = 0;

    const firstLine = lines[0].trim();
    const match = firstLine.match(chapterRegex);
    if (match) {
      chapterNum = parseInt(match[1]);
      chapterTitle = match[2] ? `: ${match[2]}` : '';
      contentStartIndex = 1;
    }

    const content = lines.slice(contentStartIndex).join('\n');
    const paragraphs = content.split('\n').filter(p => p.trim());
    const totalWords = countWords(content);
    const wordsPerPart = Math.floor(totalWords / currentSplitMode);

    let parts = [];
    let wordCount = 0;
    let startIndex = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      const wordsInParagraph = countWords(paragraphs[i]);
      wordCount += wordsInParagraph;
      if (parts.length < currentSplitMode - 1 && wordCount >= wordsPerPart * (parts.length + 1)) {
        parts.push(paragraphs.slice(startIndex, i + 1).join('\n\n'));
        startIndex = i + 1;
      }
    }
    parts.push(paragraphs.slice(startIndex).join('\n\n'));

    parts.forEach((part, index) => {
      const textarea = document.getElementById(`output${index + 1}-text`);
      if (textarea) {
        const newChapterTitle = `Chương ${chapterNum}.${index + 1}${chapterTitle}`;
        textarea.value = `${newChapterTitle}\n\n${part}`;
        updateWordCount(`output${index + 1}-text`, `output${index + 1}-word-count`);
      }
    });

    inputTextArea.value = '';
    updateWordCount('split-input-text', 'split-input-word-count');
    showNotification(translations.vn.splitSuccess, 'success');
    saveInputState();
    hideLoadingUI();
  }, 100);
}

export function addSplitModeButtons() {
  const buttonsContainer = document.querySelector('.split-mode-buttons');
  if (!buttonsContainer) return;

  for (let mode = 2; mode <= 10; mode++) {
    const button = document.createElement('button');
    button.className = 'split-mode-button bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white py-1 px-2 rounded m-1';
    button.setAttribute('data-split-mode', mode);
    button.textContent = `Chia ${mode}`;
    button.addEventListener('click', () => updateSplitModeUI(mode));
    buttonsContainer.appendChild(button);
  }
}
    const exportButton = document.createElement('button');
    exportButton.textContent = translations.vn.exportPDF;
    exportButton.className = 'bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded ml-2';
    exportButton.addEventListener('click', () => {
      const text = document.getElementById(`output${i}-text`).value;
      exportToPDF(text, `Chương ${i}`);
    });

    section.appendChild(textarea);
    section.appendChild(counter);
    section.appendChild(copyButton);
    section.appendChild(exportButton);
    splitOutputs.appendChild(section);
  }

  const inputText = document.getElementById('split-input-text');
  if (inputText) inputText.value = '';
  updateWordCount('split-input-text', 'split-input-word-count');
  saveInputState();
}

function copyOutput(index) {
  const textarea = document.getElementById(`output${index}-text`);
  if (textarea && textarea.value) {
    navigator.clipboard.writeText(textarea.value).then(() => {
      showNotification(translations.vn.textCopied, 'success');
    }).catch(() => {
      showNotification(translations.vn.failedToCopy, 'error');
    });
  } else {
    showNotification(translations.vn.noTextToCopy, 'error');
  }
}

export function handleSplit() {
  showLoadingUI(); // Hiệu suất: thêm loading cho văn bản dài
  setTimeout(() => { // Simulate async for long text
    const inputTextArea = document.getElementById('split-input-text');
    if (!inputTextArea || !inputTextArea.value) {
      showNotification(translations.vn.noTextToSplit, 'error');
      hideLoadingUI();
      return;
    }

    let text = DOMPurify.sanitize(inputTextArea.value); // Bảo mật: sanitize input
    let chapterNum = 1;
    let chapterTitle = '';

    const chapterRegex = /^[Cc]hương\s+(\d+)(?::\s*(.*))?$/m;
    const lines = text.split('\n');
    let contentStartIndex = 0;

    const firstLine = lines[0].trim();
    const match = firstLine.match(chapterRegex);
    if (match) {
      chapterNum = parseInt(match[1]);
      chapterTitle = match[2] ? `: ${match[2]}` : '';
      contentStartIndex = 1;
    }

    const content = lines.slice(contentStartIndex).join('\n');
    const paragraphs = content.split('\n').filter(p => p.trim());
    const totalWords = countWords(content);
    const wordsPerPart = Math.floor(totalWords / currentSplitMode);

    let parts = [];
    let wordCount = 0;
    let startIndex = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      const wordsInParagraph = countWords(paragraphs[i]);
      wordCount += wordsInParagraph;
      if (parts.length < currentSplitMode - 1 && wordCount >= wordsPerPart * (parts.length + 1)) {
        parts.push(paragraphs.slice(startIndex, i + 1).join('\n\n'));
        startIndex = i + 1;
      }
    }
    parts.push(paragraphs.slice(startIndex).join('\n\n'));

    parts.forEach((part, index) => {
      const textarea = document.getElementById(`output${index + 1}-text`);
      if (textarea) {
        const newChapterTitle = `Chương ${chapterNum}.${index + 1}${chapterTitle}`;
        textarea.value = `${newChapterTitle}\n\n${part}`;
        updateWordCount(`output${index + 1}-text`, `output${index + 1}-word-count`);
      }
    });

    inputTextArea.value = '';
    updateWordCount('split-input-text', 'split-input-word-count');
    showNotification(translations.vn.splitSuccess, 'success');
    saveInputState();
    hideLoadingUI();
  }, 100); // Delay nhỏ để loading hiển thị
}

export function addSplitModeButtons() {
  const buttonsContainer = document.querySelector('.split-mode-buttons');
  if (!buttonsContainer) return;

  for (let mode = 2; mode <= 10; mode++) {
    const button = document.createElement('button');
    button.className = 'split-mode-button bg-gray-200 hover:bg-gray-400 text-black py-1 px-2 rounded m-1';
    button.setAttribute('data-split-mode', mode);
    button.textContent = `Chia ${mode}`;
    button.addEventListener('click', () => updateSplitModeUI(mode));
    buttonsContainer.appendChild(button);
  }
}
