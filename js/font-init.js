// Runs in <head> before the page is drawn, so a saved text size is applied without a visible jump.
// Keep these sizes in sync with the data-px values written by scripts/build.mjs.
(function () {
  var sizes = { normal: 20, large: 23, xlarge: 27 }, saved = null;
  try { saved = localStorage.getItem('diabetes-font-v3'); } catch (e) {}
  if (!sizes[saved]) saved = 'normal';
  document.documentElement.style.setProperty('--reading-size', sizes[saved] + 'px');
  document.documentElement.setAttribute('data-font-size', saved);
})();
