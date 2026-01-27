(function(){
  const fab = document.getElementById('fab');
  const overlay = document.getElementById('overlay');
  const panel = document.getElementById('panel');
  const jp = document.getElementById('jp');
  const copyBtn = document.getElementById('copyBtn');
  const toast = document.getElementById('toast');

  // ---- Language system (extendable) ----
  const LANG_KEY = 'uiLang';
  const LANGS = {
    en: { label: 'EN',  googleTl: 'en',  deeplTl: 'en' },
    zh: { label: '中文', googleTl: 'zh-CN', deeplTl: 'zh' }
  };
  const langToggle = document.getElementById('langToggle');

  function getLang(){ return localStorage.getItem(LANG_KEY) || 'en'; }
  function applyLang(lang){
    document.querySelectorAll('[data-en][data-zh]').forEach(el=>{
      el.innerHTML = (lang === 'zh') ? el.getAttribute('data-zh') : el.getAttribute('data-en');
    });
    if(langToggle) langToggle.textContent = (LANGS[lang]?.label || 'EN');
  }
  function setLang(lang){
    if(!LANGS[lang]) lang = 'en';
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
  }
  function cycleLang(){
    const keys = Object.keys(LANGS);
    const cur = getLang();
    const next = keys[(keys.indexOf(cur)+1) % keys.length];
    setLang(next);
  }
  if(langToggle) langToggle.addEventListener('click', cycleLang);
  applyLang(getLang());

  function currentGoogleTl(){ return (LANGS[getLang()]?.googleTl || 'en'); }
  function currentDeeplTl(){ return (LANGS[getLang()]?.deeplTl || 'en'); }


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
      showToast('文章を入力してください');
      return;
    }
    const q = encodeURIComponent(text);
    let url = '';
    if(t === 'google'){
      url = `https://translate.google.com/?sl=ja&tl=${currentGoogleTl()}&text=${q}&op=translate`;
    }else if(t === 'deepl'){
      url = `https://www.deepl.com/translator#ja/${currentDeeplTl()}/${q}`;
    }else if(t === 'gemini'){
      url = 'https://gemini.google.com/';
    }else if(t === 'chatgpt'){
      url = 'https://chatgpt.com/';
    }
    window.open(url, '_blank', 'noopener');
  });

  // Copy button (placed next to title)
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
      // Fallback
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
function switchLang(lang){
  document.querySelectorAll('.card').forEach(card=>{
    const target = card.dataset[lang];
    const fallback = card.dataset.en;
    card.href = target || fallback;
  });
}
