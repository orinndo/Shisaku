(function(){
  const fab = document.getElementById('fab');
  const overlay = document.getElementById('overlay');
  const panel = document.getElementById('panel');
  const jp = document.getElementById('jp');
  const copyBtn = document.getElementById('copyBtn');
  const toast = document.getElementById('toast');

  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>toast.classList.remove('show'), 1400);
  }

  function openPanel(){
    panel.classList.remove('hidden');
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden','false');
    // overlay is transparent so background color will NOT change
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    setTimeout(()=>{ try{ jp.focus(); }catch(e){} }, 0);
  }

  function closePanel(){
    panel.classList.add('hidden');
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden','true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  fab?.addEventListener('click', ()=>{
    if(panel.classList.contains('hidden')) openPanel();
    else closePanel();
  });

  overlay?.addEventListener('click', closePanel);

  // Translation buttons
  panel?.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-t]');
    if(!btn) return;
    const t = btn.getAttribute('data-t');
    const text = (jp?.value || '').trim();
    if(!text){
      showToast('文章を入力してください');
      return;
    }
    const q = encodeURIComponent(text);
    let url = '';
    if(t === 'google'){
      url = `https://translate.google.com/?sl=ja&tl=en&text=${q}&op=translate`;
    }else if(t === 'deepl'){
      url = `https://www.deepl.com/translator#ja/en/${q}`;
    }else if(t === 'gemini'){
      url = 'https://gemini.google.com/';
    }
    window.open(url, '_blank', 'noopener');
  });

  // Copy button
  copyBtn?.addEventListener('click', async ()=>{
    const text = jp?.value ?? '';
    if(!text.trim()){
      showToast('コピーする文章がありません');
      return;
    }
    try{
      await navigator.clipboard.writeText(text);
      showToast('コピーしました');
    }catch(err){
      try{
        jp.focus();
        jp.select();
        const ok = document.execCommand('copy');
        showToast(ok ? 'コピーしました' : 'コピーに失敗しました');
      }catch(e){
        showToast('コピーに失敗しました');
      }
    }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && !panel.classList.contains('hidden')) closePanel();
  });
})();