(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW', e));
    });
  }

  let deferredPrompt = null;
  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function setButtons(show) {
    document.querySelectorAll('.install-btn').forEach(b => b.style.display = show ? 'flex' : 'none');
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    setButtons(true);
  });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; setButtons(false); });

  document.addEventListener('DOMContentLoaded', () => {
    if (!isStandalone()) setButtons(true);
  });

  window.installApp = async function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (outcome === 'accepted') setButtons(false);
    } else if (isIOS) {
      alert('للتثبيت على الآيفون/الآيباد: افتح الصفحة في سفاري، اضغط زر المشاركة (⬆️) ثم اختر "إضافة إلى الشاشة الرئيسية".');
    } else {
      alert('للتثبيت: افتح قائمة المتصفح (⋮) ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".');
    }
  };
})();
