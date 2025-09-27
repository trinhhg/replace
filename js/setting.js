import { escapeRegExp } from './utils.js';
import { showNotification } from './utils.js';
import { translations } from './translations.js';

export function replaceText(inputText, pairs, matchCase) {
  if (!inputText || !inputText.trim()) {
    showNotification(translations.vn.noTextToReplace, 'error');
    return '';
  }
  let outputText = inputText;

  pairs.forEach(pair => {
    let find = pair.find;
    let replace = pair.replace !== null ? pair.replace : '';
    if (!find) return;

    const escapedFind = escapeRegExp(find);
    const regexFlags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(escapedFind, regexFlags);

    outputText = outputText.replace(regex, (match) => {
      if (matchCase) {
        return replace;
      } else {
        if (match === match.toUpperCase()) {
          return replace.toUpperCase();
        } else if (match === match.toLowerCase()) {
          return replace.toLowerCase();
        } else if (match[0] === match[0].toUpperCase()) {
          return replace.charAt(0).toUpperCase() + replace.slice(1).toLowerCase();
        }
        return replace;
      }
    });
  });

  pairs.forEach(pair => {
    let replace = pair.replace !== null ? pair.replace : '';
    if (!replace) return;

    if (replace === replace.toUpperCase() || /[A-Z]/.test(replace.slice(1))) {
      return;
    }

    const pattern = new RegExp(`(^|\\n|\\.\\s)(${escapeRegExp(replace)})`, 'g');
    outputText = outputText.replace(pattern, (match, prefix, word) => {
      return prefix + word.charAt(0).toUpperCase() + word.slice(1);
    });
  });

  const paragraphs = outputText.split('\n').filter(p => p.trim());
  return paragraphs.join('\n\n');
}

export function exportToPDF(text, title = 'Kết quả') {
  if (!text) {
    showNotification('Không có nội dung để xuất PDF.', 'error');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(title, 10, 10);
  doc.text(text, 10, 20);
  doc.save(`${title}.pdf`);
  showNotification('Đã xuất PDF thành công!', 'success');
}
