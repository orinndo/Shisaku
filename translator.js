const ta = document.getElementById('jpText');
const copyBtn = document.getElementById('copyInputBtn');

// restore text
ta.value = localStorage.getItem('jpText') || '';

// save on input
ta.addEventListener('input', () => {
  localStorage.setItem('jpText', ta.value);
});

// copy
copyBtn.addEventListener('click', () => {
  if (!ta.value) return;
  navigator.clipboard.writeText(ta.value);
  copyBtn.textContent = '✓ コピーしました';
  setTimeout(() => {
    copyBtn.textContent = '📋 入力文をコピー';
  }, 1500);
});

// open translators
document.querySelectorAll('.translator-buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = ta.value;
    if (!text) return;

    const type = btn.dataset.t;
    let url = '';
    if (type === 'google') {
      url = 'https://translate.google.com/?sl=ja&tl=en&text=' + encodeURIComponent(text);
    } else if (type === 'deepl') {
      url = 'https://www.deepl.com/translator#ja/en/' + encodeURIComponent(text);
    } else if (type === 'gemini') {
      navigator.clipboard.writeText(text);
      url = 'https://gemini.google.com/';
    }
    window.open(url, '_blank');
  });
});
