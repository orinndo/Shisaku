(function(){
  const fab = document.getElementById('fab');
  const overlay = document.getElementById('overlay');
  const panel = document.getElementById('panel');
  const jp = document.getElementById('jp');
  const copyBtn = document.getElementById('copyBtn');
  const toast = document.getElementById('toast');

  // Scroll lock that preserves background gradient position (prevents iOS "dimming"/shift)
  let scrollY = 0;
  function lockScroll(){
    scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  function unlockScroll(){
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }

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
    lockScroll();
    setTimeout(()=>{ try{ jp.focus(); }catch(e){} }, 0);
  }

  function closePanel(){
    panel.classList.add('hidden');
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden','true');
    unlockScroll();
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
      showToast('请输入文字');
      return;
    }
    const q = encodeURIComponent(text);
    let url = '';
    if(t === 'google'){
      url = `https://translate.google.com/?sl=ja&tl=en&text=${q}&op=translate`;
    }else if(t === 'deepl'){
      url = `https://www.deepl.com/translator#ja/zh/${q}`;
    }else if(t === 'gemini'){
      url = 'https://gemini.google.com/';
    }else if(t === 'chatgpt'){
      url = 'https://chat.openai.com/';
    }
    window.open(url, '_blank', 'noopener');
  });

  // Copy button (placed next to title)
  copyBtn?.addEventListener('click', async ()=>{
    const text = jp?.value ?? '';
    if(!text.trim()){
      showToast('没有可复制的内容');
      return;
    }
    try{
      await navigator.clipboard.writeText(text);
      showToast('已复制');
    }catch(err){
      // Fallback
      try{
        jp.focus();
        jp.select();
        const ok = document.execCommand('copy');
        showToast(ok ? '已复制' : '复制失败');
      }catch(e){
        showToast('复制失败');
      }
    }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && !panel.classList.contains('hidden')) closePanel();
  });
})();