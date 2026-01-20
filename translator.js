
const fab=document.getElementById("fab");
const panel=document.getElementById("panel");
const overlay=document.getElementById("overlay");

fab.onclick=()=>{ panel.classList.remove("hidden"); overlay.classList.remove("hidden"); };
overlay.onclick=()=>{ panel.classList.add("hidden"); overlay.classList.add("hidden"); };

document.querySelectorAll("#panel .btns button").forEach(btn=>{
  btn.onclick=()=>{
    const text=document.getElementById("jp").value.trim();
    if(!text) return;
    const type=btn.dataset.t;
    if(type==="google"){
      window.open("https://translate.google.com/?sl=ja&tl=en&text="+encodeURIComponent(text),"_blank");
    }
    if(type==="deepl"){
      window.open("https://www.deepl.com/translator#ja/en/"+encodeURIComponent(text),"_blank");
    }
    if(type==="gemini"){
      navigator.clipboard.writeText(text);
      window.open("https://gemini.google.com/","_blank");
    }
  };
});

document.getElementById('copyInputBtn')?.addEventListener('click',()=>{
  const t=document.getElementById('jpText').value;
  if(!t) return;
  navigator.clipboard.writeText(t);
  const toast=document.getElementById('toast');
  toast.textContent='コピーしました';
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),1200);
});

// ---- Persist input text across navigation ----
(function(){
  const KEY = 'translator_input_jp';
  const ta = document.getElementById('jpText');
  if(!ta) return;

  // restore
  const saved = localStorage.getItem(KEY);
  if(saved) ta.value = saved;

  // save on input
  ta.addEventListener('input', ()=>{
    localStorage.setItem(KEY, ta.value);
  });
})();
