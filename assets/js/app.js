/**
 * Natural Skin Care SA - Vanilla JavaScript Application
 * Pure HTML/CSS/JS 
 */

// ============================================================================
// i18n - Translation Management
// ============================================================================

const i18n = (() => {
  const STORAGE_KEY = 'site-language';
  const FALLBACK_LANGUAGE = 'en';
  const SUPPORTED_LANGUAGES = ['en', 'es'];

  let currentLanguage = getInitialLanguage();
  let translations = {};
  let listeners = [];

  function getInitialLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }

    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith('es')) {
      return 'es';
    }

    return FALLBACK_LANGUAGE;
  }

  function loadTranslations() {
    if (window.SITE_TRANSLATIONS) {
      translations = window.SITE_TRANSLATIONS;
      updatePageLanguage(currentLanguage);
      return;
    }

    console.error('Translations not loaded. Ensure assets/locales/translations.js is included before assets/js/app.js.');
  }

  function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];

    for (const k of keys) {
      value = value?.[k];
    }

    return value ?? key;
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang) || !translations[lang]) return;
    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    updatePageLanguage(lang);
    notifyListeners(lang);
  }

  function getLanguage() {
    return currentLanguage;
  }

  function updatePageLanguage() {
    document.documentElement.lang = currentLanguage;
    updatePageTranslations();
  }

  function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const translation = getTranslation(key);

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', getTranslation(el.dataset.i18nAria));
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      el.alt = getTranslation(el.dataset.i18nAlt);
    });
  }

  function subscribe(callback) {
    listeners.push(callback);
  }

  function notifyListeners(lang) {
    listeners.forEach((callback) => callback(lang));
  }

  return {
    init: loadTranslations,
    t: getTranslation,
    setLanguage,
    getLanguage,
    subscribe
  };
})();

// ============================================================================
// Menu Management
// ============================================================================

const menuManager = (() => {
  const MOBILE_BREAKPOINT = 880;

  function isMobileMenu() {
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
  }

  function init() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const servicesBtn = document.querySelector('.services-trigger');
    const servicesMenu = document.getElementById('services-menu');
    const headerRef = document.querySelector('.site-header');
    const backdrop = document.querySelector('.menu-backdrop');

    if (!mainMenu || !servicesBtn || !servicesMenu || !headerRef) return;

    function closeAllMenus() {
      // #region agent log
      fetch('http://127.0.0.1:7705/ingest/d1ef3008-f7d5-496c-9353-db2d92813804',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd3b08'},body:JSON.stringify({sessionId:'cd3b08',location:'app.js:closeAllMenus',message:'closeAllMenus called',data:{stack:new Error().stack?.split('\n').slice(1,4)},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      mainMenu.classList.remove('open');
      servicesMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      backdrop?.classList.remove('open');
      backdrop?.setAttribute('aria-hidden', 'true');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      servicesBtn.setAttribute('aria-expanded', 'false');
    }

    function openMainMenu() {
      mainMenu.classList.add('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
      if (isMobileMenu()) {
        document.body.classList.add('menu-open');
        backdrop?.classList.add('open');
        backdrop?.setAttribute('aria-hidden', 'false');
        // #region agent log
        requestAnimationFrame(() => {
          const panelRect = mainMenu.getBoundingClientRect();
          const cx = panelRect.left + panelRect.width / 2;
          const cy = panelRect.top + Math.min(80, panelRect.height / 2);
          const topEl = document.elementFromPoint(cx, cy);
          const panelStyle = getComputedStyle(mainMenu);
          const backdropStyle = backdrop ? getComputedStyle(backdrop) : null;
          const navStyle = getComputedStyle(document.querySelector('.mega-nav'));
          fetch('http://127.0.0.1:7705/ingest/d1ef3008-f7d5-496c-9353-db2d92813804',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd3b08'},body:JSON.stringify({sessionId:'cd3b08',runId:'post-fix',location:'app.js:openMainMenu',message:'menu opened stacking probe',data:{panelPointerEvents:panelStyle.pointerEvents,panelZIndex:panelStyle.zIndex,backdropZIndex:backdropStyle?.zIndex,backdropPointerEvents:backdropStyle?.pointerEvents,navZIndex:navStyle.zIndex,elementAtMenuCenter:topEl?{tag:topEl.tagName,className:topEl.className,id:topEl.id}:null,panelRect:{top:panelRect.top,height:panelRect.height}},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
          document.querySelectorAll('.nav-link,.services-trigger').forEach((el,i)=>{const s=getComputedStyle(el);fetch('http://127.0.0.1:7705/ingest/d1ef3008-f7d5-496c-9353-db2d92813804',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd3b08'},body:JSON.stringify({sessionId:'cd3b08',runId:'post-fix',location:'app.js:openMainMenu',message:'nav item alignment',data:{index:i,className:el.className,justifyContent:s.justifyContent,width:s.width},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});});
        });
        // #endregion
      }
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const willOpen = !mainMenu.classList.contains('open');
        if (willOpen) {
          openMainMenu();
        } else {
          closeAllMenus();
        }
      });
    }

    servicesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = servicesMenu.classList.toggle('open');
      servicesBtn.setAttribute('aria-expanded', String(isOpen));

      if (isMobileMenu() && isOpen && !mainMenu.classList.contains('open')) {
        openMainMenu();
      }

      // #region agent log
      if (isMobileMenu() && isOpen) {
        requestAnimationFrame(() => {
          const inner = servicesMenu.querySelector('.services-mega-menu__inner');
          const innerStyle = inner ? getComputedStyle(inner) : null;
          fetch('http://127.0.0.1:7705/ingest/d1ef3008-f7d5-496c-9353-db2d92813804',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd3b08'},body:JSON.stringify({sessionId:'cd3b08',runId:'post-fix-v2',location:'app.js:servicesOpen',message:'services submenu layout',data:{gridTemplateColumns:innerStyle?.gridTemplateColumns,overflowX:innerStyle?.overflowX,menuOverflowX:getComputedStyle(servicesMenu).overflowX},timestamp:Date.now(),hypothesisId:'F'})}).catch(()=>{});
        });
      }
      // #endregion
    });

    backdrop?.addEventListener('click', (e) => {
      // #region agent log
      fetch('http://127.0.0.1:7705/ingest/d1ef3008-f7d5-496c-9353-db2d92813804',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd3b08'},body:JSON.stringify({sessionId:'cd3b08',location:'app.js:backdropClick',message:'backdrop received click',data:{targetClass:e.target.className},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      closeAllMenus();
    });

    document.addEventListener('mousedown', (event) => {
      if (!headerRef.contains(event.target)) {
        // #region agent log
        fetch('http://127.0.0.1:7705/ingest/d1ef3008-f7d5-496c-9353-db2d92813804',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd3b08'},body:JSON.stringify({sessionId:'cd3b08',location:'app.js:outsideMousedown',message:'outside click closing menu',data:{targetTag:event.target.tagName,targetClass:event.target.className},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        closeAllMenus();
      }
    });

    mainMenu.addEventListener('click', (e) => {
      // #region agent log
      fetch('http://127.0.0.1:7705/ingest/d1ef3008-f7d5-496c-9353-db2d92813804',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cd3b08'},body:JSON.stringify({sessionId:'cd3b08',location:'app.js:menuPanelClick',message:'menu panel click reached',data:{targetTag:e.target.tagName,targetClass:e.target.className},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAllMenus();
      }
    });

    document.querySelectorAll('.nav-link, .service').forEach((link) => {
      link.addEventListener('click', closeAllMenus);
    });

    window.addEventListener('resize', () => {
      if (!isMobileMenu()) {
        document.body.classList.remove('menu-open');
        backdrop?.classList.remove('open');
        backdrop?.setAttribute('aria-hidden', 'true');
      }
    });
  }

  return { init };
})();

// ============================================================================
// Language Switcher
// ============================================================================

const languageSwitcher = (() => {
  function init() {
    const buttons = document.querySelectorAll('.language-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        i18n.setLanguage(lang);
      });
    });

    const currentLang = i18n.getLanguage();
    buttons.forEach((btn) => btn.classList.remove('active'));
    document.querySelector(`[data-lang="${currentLang}"]`)?.classList.add('active');
  }

  return { init };
})();

// ============================================================================
// Hero Section - Rotating Words
// ============================================================================

const heroRotation = (() => {
  const ROTATION_INTERVAL = 2200;

  let rotatingWords = [];
  let currentWordIndex = 0;
  let rotationTimer = null;

  function updateWords() {
    rotatingWords = [
      i18n.t('hero.word1'),
      i18n.t('hero.word2'),
      i18n.t('hero.word3')
    ];
    currentWordIndex = 0;
    updateWord();
  }

  function updateWord() {
    const heroWord = document.querySelector('.hero-word');
    if (heroWord && rotatingWords.length > 0) {
      heroWord.textContent = rotatingWords[currentWordIndex];
      heroWord.setAttribute('data-current-word', currentWordIndex);
    }
  }

  function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % rotatingWords.length;
    updateWord();
  }

  function startRotation() {
    if (rotationTimer) clearInterval(rotationTimer);
    rotationTimer = setInterval(nextWord, ROTATION_INTERVAL);
  }

  function stopRotation() {
    if (rotationTimer) clearInterval(rotationTimer);
  }

  function init() {
    updateWords();
    startRotation();

    i18n.subscribe(() => {
      stopRotation();
      updateWords();
      startRotation();
    });
  }

  return { init, startRotation, stopRotation };
})();

// ============================================================================
// Page Title Management
// ============================================================================

const pageTitle = (() => {
  function updateTitle() {
    document.title = i18n.t('meta.title');

    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', i18n.t('meta.description'));
    }
  }

  function init() {
    updateTitle();
    i18n.subscribe(updateTitle);
  }

  return { init };
})();

// ============================================================================
// Initialization
// ============================================================================

function initApp() {
  i18n.init();
  pageTitle.init();
  menuManager.init();
  languageSwitcher.init();
  heroRotation.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
