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


  // === Pseudo-LLM (local assistant) ===
  // Phase can be set per page by adding: <body data-phase="pre|contrast|scan|post|menu">
  function getPhase(){
    try{
      return document.body?.getAttribute('data-phase') || 'any';
    }catch(e){ return 'any'; }
  }

  function normalizeText(text){
    return (text || '')
      .toString()
      .trim()
      .toLowerCase();
  }

  const INTENTS = [
    { name: 'pain',      keywords: ['痛い','いたい','痛み','疼','ヒリ','しみ','熱い','あつい','burn','hurt','pain','sting'] },
    { name: 'nausea',    keywords: ['吐き気','気持ち悪','むかむか','nausea','sick'] },
    { name: 'anxiety',   keywords: ['不安','怖い','こわい','心配','緊張','panic','scared','anxious','worried'] },
    { name: 'breath',    keywords: ['息','呼吸','息苦','息が','breath','breathe'] },
    { name: 'movement',  keywords: ['動い','動く','動いて','じっと','still','move'] },
    { name: 'time',      keywords: ['どのくらい','何分','多久','time','minutes','how long'] },
    { name: 'contrast',  keywords: ['造影','造影剤','コントラスト','contrast','dye'] },
    { name: 'iv',        keywords: ['点滴','ルート','針','注射','iv','cannula','needle'] }
  ];

  function detectIntent(text){
    const t = normalizeText(text);
    for(const intent of INTENTS){
      if(intent.keywords.some(k => t.includes(k))) return intent.name;
    }
    return 'unknown';
  }

  const RESPONSES = {
    pain: {
      contrast: {
        ja: '造影剤で一時的に熱く感じたり、注入部位に違和感が出ることがあります。つらい場合は我慢せず、すぐに教えてください。',
        en: 'With contrast, you may feel warmth or discomfort at the injection site. If it becomes uncomfortable, please tell us right away.'
      },
      scan: {
        ja: '体勢や息止めでつらい場合は、無理せず教えてください。必要に応じて中断して調整します。',
        en: 'If the position or breath-hold feels difficult, please let us know. We can pause and adjust as needed.'
      },
      any: {
        ja: '痛みがある場合は我慢せず教えてください。状況を確認して対応します。',
        en: 'If you have pain, please tell us. We will check what’s happening and help you.'
      }
    },
    nausea: {
      any: {
        ja: '吐き気がある場合はすぐに教えてください。体勢を整えたり、必要に応じて中断します。',
        en: 'If you feel nauseated, please tell us immediately. We can adjust your position or pause if needed.'
      }
    },
    anxiety: {
      any: {
        ja: '不安なことがあれば遠慮なく教えてください。検査は短時間で、スタッフが近くで見守っています。',
        en: 'If you feel anxious, please tell us. The exam is short, and staff are right here with you.'
      }
    },
    breath: {
      scan: {
        ja: '息止めの合図が聞こえたら、息を吸って止めてください。止めるのがつらい場合は教えてください。',
        en: 'When you hear the breath-hold instruction, take a breath in and hold it. If it’s difficult, please tell us.'
      },
      any: {
        ja: '呼吸がつらい場合はすぐに教えてください。安全を優先して対応します。',
        en: 'If breathing feels difficult, please tell us right away. We will prioritize your safety.'
      }
    },
    movement: {
      any: {
        ja: '画像をきれいに撮るため、できるだけ動かないようお願いします。つらい場合は我慢せず教えてください。',
        en: 'To get clear images, please stay as still as possible. If it’s uncomfortable, tell us and we’ll help.'
      }
    },
    time: {
      any: {
        ja: '検査自体は短時間です。準備を含めると状況により前後しますが、スタッフが流れを案内します。',
        en: 'The scan itself is quick. Including preparation, the total time can vary, and staff will guide you through each step.'
      }
    },
    contrast: {
      any: {
        ja: '造影剤は血管をはっきり写すために使用します。注入時に熱く感じることがありますが、多くはすぐにおさまります。',
        en: 'Contrast helps us see blood vessels clearly. You may feel warmth during injection, which usually passes quickly.'
      }
    },
    iv: {
      any: {
        ja: '点滴ルートは造影剤を安全に注入するために必要です。痛みや違和感があればすぐ教えてください。',
        en: 'The IV line is needed to inject contrast safely. If you feel pain or discomfort, please tell us.'
      }
    },
    unknown: {
      any: {
        ja: '詳しいことはスタッフが直接確認して対応します。遠慮なく声をかけてください。',
        en: 'A staff member will assist you directly. Please feel free to ask.'
      }
    }
  };

  function pseudoLLM(text){
    const intent = detectIntent(text);
    const phase = getPhase();
    const res =
      (RESPONSES[intent] && (RESPONSES[intent][phase] || RESPONSES[intent].any)) ||
      RESPONSES.unknown.any;
    return res;
  }

  function showLocalAnswer(res){
    const box = document.getElementById('aiAnswer');
    if(!box) return;
    box.innerHTML =
      '<p class="label">AI応答 / AI Response</p>' +
      '<p class="ja">' + escapeHtml(res.ja) + '</p>' +
      '<p class="en">' + escapeHtml(res.en) + '</p>';
    box.classList.remove('hidden');
  }

  function escapeHtml(s){
    return (s ?? '').toString()
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#39;');
  }

  function openPanel(){
    // reset local answer display
    try{ document.getElementById('aiAnswer')?.classList.add('hidden'); }catch(e){}
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
      url = `https://translate.google.com/?sl=ja&tl=en&text=${q}&op=translate`;
    }else if(t === 'deepl'){
      url = `https://www.deepl.com/translator#ja/en/${q}`;
    }else if(t === 'gemini'){
      url = 'https://gemini.google.com/';
    }else if(t === 'chatgpt'){
      // Local (offline) pseudo-LLM response
      const res = pseudoLLM(text);
      showLocalAnswer(res);
      showToast('AI応答を表示しました');
      return;
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