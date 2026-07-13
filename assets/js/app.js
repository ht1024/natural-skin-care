/**
 * Natural Skin Care SA - Vanilla JavaScript Application
 * Pure HTML/CSS/JS - No Node.js or React
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
  function init() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const servicesBtn = document.querySelector('.services-trigger');
    const servicesMenu = document.getElementById('services-menu');
    const headerRef = document.querySelector('.site-header');

    if (!mainMenu || !servicesBtn || !servicesMenu || !headerRef) return;

    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const isOpen = mainMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        if (!isOpen) {
          servicesMenu.classList.remove('open');
          servicesBtn.setAttribute('aria-expanded', false);
        }
      });
    }

    servicesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = servicesMenu.classList.toggle('open');
      servicesBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('mousedown', (event) => {
      if (!headerRef.contains(event.target)) {
        mainMenu.classList.remove('open');
        servicesMenu.classList.remove('open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', false);
        servicesBtn.setAttribute('aria-expanded', false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        mainMenu.classList.remove('open');
        servicesMenu.classList.remove('open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', false);
        servicesBtn.setAttribute('aria-expanded', false);
      }
    });

    document.querySelectorAll('.nav-link, .service-link').forEach((link) => {
      link.addEventListener('click', () => {
        mainMenu.classList.remove('open');
        servicesMenu.classList.remove('open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', false);
        servicesBtn.setAttribute('aria-expanded', false);
      });
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
