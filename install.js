let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.style.display = 'inline-flex';
});

document.addEventListener('click', e => {
  if (e.target.id === 'installBtn' && deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt = null;
  }
});
