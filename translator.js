let currentLang = "en";

const LANGS = {
  en: {
    titleSub: "English Audio Guide",
    sections: [
      { jp:"患者入室", sub:"Patient Entry", url:"/patient-entry/" },
      { jp:"心電図・血圧測定・息止め練習・ポジショニング", sub:"ECG, BP & Positioning", url:"/ECG-BP-Positioning/" },
      { jp:"ABL前検査の場合", sub:"Pre-ABL Examination", url:"/ABL/" },
      { jp:"ニトロペン（舌下投与）", sub:"Nitropen Sublingual", url:"/nitropen-sublingual/" },
      { jp:"造影剤の説明", sub:"Contrast Dye", url:"/explanation-of-contrast-dye-/" },
      { jp:"点滴ルート確保", sub:"IV Access", url:"/IV-access/" },
      { jp:"コアベータ投与", sub:"Corebeta Injection", url:"/corebeta-injection/" },
      { jp:"テスト注入", sub:"Test Injection", url:"/test-injection-guide/" },
      { jp:"撮影本番", sub:"Main Scan", url:"/actual-injection/" },
      { jp:"検査終了後", sub:"After the Exam", url:"/after-the-exam/" }
    ]
  },
  zh: {
    titleSub: "中文语音指南",
    sections: [
      { jp:"患者入室", sub:"患者进入", url:"/zh/patient-entry/" },
      { jp:"心電図・血圧測定・息止め練習・ポジショニング", sub:"心电图、血压测量与体位调整", url:"/zh/ECG-BP-Positioning/" },
      { jp:"ABL前検査の場合", sub:"ABL检查前", url:"/zh/ABL/" },
      { jp:"ニトロペン（舌下投与）", sub:"硝酸甘油（舌下给药）", url:"/zh/nitropen-sublingual/" },
      { jp:"造影剤の説明", sub:"造影剂说明", url:"/zh/explanation-of-contrast-dye-/" },
      { jp:"コアベータ投与", sub:"β受体阻滞剂给药", url:"/zh/corebeta-injection/" },
      { jp:"テスト注入", sub:"测试注射", url:"/zh/test-injection-guide/" },
      { jp:"撮影本番", sub:"正式扫描", url:"/zh/actual-injection/" },
      { jp:"検査終了後", sub:"检查结束后", url:"/zh/after-the-exam/" }
    ]
  }
};

function render(){
  const data = LANGS[currentLang];
  document.querySelector(".sub-title").textContent = data.titleSub;

  document.querySelectorAll(".card").forEach((card,i)=>{
    const sec = data.sections[i];
    if(!sec){
      card.style.display="none";
      return;
    }
    card.style.display="";
    card.href = sec.url;
    card.querySelector(".jp").textContent = sec.jp;
    card.querySelector(".en").textContent = sec.sub;
  });

  document.querySelector(".lang-btn").textContent =
    currentLang==="en" ? "中文" : "English";
}

function toggleLang(){
  currentLang = currentLang==="en" ? "zh" : "en";
  render();
}

render();
