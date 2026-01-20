
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


(function(){
  const KEY='translator_jp_text';
  const ta=document.getElementById('jpText');
  const btn=document.getElementById('copyInputBtn');

  if(ta){
    const saved=localStorage.getItem(KEY);
    if(saved) ta.value=saved;
    ta.addEventListener('input',()=>localStorage.setItem(KEY,ta.value));
  }

  if(btn && ta){
    btn.addEventListener('click',()=>{
      if(!ta.value) return;
      navigator.clipboard.writeText(ta.value);
      btn.textContent='✓ コピーしました';
      setTimeout(()=>btn.textContent='📋 入力文をコピー',1200);
    });
  }
})();
