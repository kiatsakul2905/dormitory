// js/theme.js
// Lightweight theme/animation initializer
(function(){
  function applyTheme(){
    try{
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      document.documentElement.classList.add('theme-stagger');
      // small delay to allow CSS to apply
      window.requestAnimationFrame(()=>{
        setTimeout(()=> document.body.classList.add('theme-loaded'), 80);
      });
    }catch(e){console.warn('theme init failed', e)}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyTheme);
  else applyTheme();
})();
