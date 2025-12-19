// js/nav-init.js
// Initialize navbar language selector and other nav behaviors
(function(){
  function initLangSelect(){
    const sel = document.getElementById('lang-select');
    if (!sel) return;
    const cur = localStorage.getItem('lang') || 'th';
    sel.value = cur;
    sel.addEventListener('change', (e)=>{
      localStorage.setItem('lang', e.target.value);
      // reload to let pages re-render based on new language
      location.reload();
    });
  }

  function initAuthDisplay(){
    // Ensure auth.js's onAuthStateChanged has chance to find elements
    // If auth.js already attached handlers, this is harmless.
    const userDisplay = document.getElementById('userDisplay');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    // No-op; auth.js manages these. This file just ensures they exist when scripts run.
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ initLangSelect(); initAuthDisplay();});
  } else {
    initLangSelect(); initAuthDisplay();
  }
})();
