(function(){
  var head = document.head;

  function addLink(rel, href, type){
    var l = document.createElement('link');
    l.rel = rel; l.href = href;
    if(type) l.type = type;
    head.appendChild(l);
  }
  function addMeta(name, content){
    var m = document.createElement('meta');
    m.name = name; m.content = content;
    head.appendChild(m);
  }

  addLink('manifest', 'manifest.json');
  addLink('icon', 'favicon-64.png', 'image/png');
  addLink('apple-touch-icon', 'apple-touch-icon.png');
  addMeta('theme-color', '#0b1330');
  addMeta('apple-mobile-web-app-capable', 'yes');
  addMeta('mobile-web-app-capable', 'yes');
  addMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  addMeta('apple-mobile-web-app-title', 'مدرسة داوود');

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('sw.js').catch(function(){});
    });
  }

  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
  });
  window.addEventListener('appinstalled', function(){
    deferredPrompt = null;
  });

  window.triggerInstall = function(){
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function(){ deferredPrompt = null; });
    } else {
      alert('لتثبيت التطبيق:\n📱 آيفون: اضغط زر المشاركة ↑ ثم "إضافة إلى الشاشة الرئيسية"\n💻 كمبيوتر: اضغط أيقونة التثبيت ⊕ في شريط عنوان المتصفح');
    }
  };

  function addInstallButton(){
    var nav = document.getElementById('bottomIconNav');
    if(!nav || document.getElementById('installNavBtn')) return;
    var btn = document.createElement('button');
    btn.className = 'bnav-btn';
    btn.id = 'installNavBtn';
    btn.innerHTML = '<span class="bnav-ic">📲</span><span>تثبيت</span>';
    btn.addEventListener('click', window.triggerInstall);
    var searchBtn = nav.querySelector('button[onclick="openGlobalSearchModal()"]');
    if (searchBtn) nav.insertBefore(btn, searchBtn);
    else nav.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addInstallButton);
  } else {
    addInstallButton();
  }
  document.addEventListener('DOMContentLoaded', function(){
    var s = document.getElementById('stat-programs');
    var box = s && s.closest('.grid');
    if (box) box.style.display = 'none';
  });
})();
