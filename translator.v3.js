const ta = document.getElementById('jpText');
const copyBtn = document.getElementById('copyBtn');

ta.value = localStorage.getItem('jpText') || '';

ta.addEventListener('input', () => {
  localStorage.setItem('jpText', ta.value);
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(ta.value);
  copyBtn.textContent = '✓ コピーしました';
  setTimeout(()=>copyBtn.textContent='📋 入力文をコピー',1500);
});
