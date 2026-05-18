// ─── i18n ────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mn_lang';
const SUPPORTED = ['pt', 'en'];

function detectLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const browser = (navigator.language || 'en').toLowerCase();
  return browser.startsWith('pt') ? 'pt' : 'en';
}

async function loadLocale(lang) {
  const res = await fetch(`locales/${lang}.json`);
  return res.json();
}

function t(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

// Replaces [data-i18n="key"] textContent and [data-i18n-html="key"] innerHTML
function applyTranslations(locale) {
  document.documentElement.lang = locale.lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t(locale, el.dataset.i18n);
    if (val !== undefined) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const val = t(locale, el.dataset.i18nHtml);
    if (val !== undefined) el.innerHTML = val;
  });

  // Array lists rendered into <ul data-i18n-list="key"> as <li> elements
  document.querySelectorAll('[data-i18n-list]').forEach(el => {
    const val = t(locale, el.dataset.i18nList);
    if (Array.isArray(val)) {
      el.innerHTML = val.map(item => `<li>${item}</li>`).join('');
    }
  });

  // Feature cards — rendered into [data-i18n-features]
  const featuresContainer = document.querySelector('[data-i18n-features]');
  if (featuresContainer && Array.isArray(locale.features?.items)) {
    featuresContainer.innerHTML = locale.features.items.map(item => `
      <div class="bg-white border border-slate-200 rounded-2xl p-6">
        <div class="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-slate-800">
          <i data-lucide="${item.icon}" class="w-5 h-5"></i>
        </div>
        <h3 class="font-semibold text-slate-900 mb-1">${item.title}</h3>
        <p class="text-slate-500 text-sm leading-relaxed">${item.desc}</p>
      </div>
    `).join('');
  }

  // FAQ items — rendered into [data-i18n-faq]
  const faqContainer = document.querySelector('[data-i18n-faq]');
  if (faqContainer && Array.isArray(locale.faq?.items)) {
    faqContainer.innerHTML = locale.faq.items.map(item => `
      <details class="group bg-white border border-slate-200 rounded-2xl px-5">
        <summary class="flex justify-between items-center py-5 cursor-pointer font-semibold text-slate-900 list-none">
          ${item.q}
          <span class="ml-4 shrink-0 text-slate-400 text-xl font-light transition-transform group-open:rotate-45">+</span>
        </summary>
        <p class="pb-5 text-slate-500 text-sm leading-relaxed">${item.a}</p>
      </details>
    `).join('');
  }

  // Privacy sections — rendered into [data-i18n-privacy-sections]
  const privacyContainer = document.querySelector('[data-i18n-privacy-sections]');
  if (privacyContainer && Array.isArray(locale.privacy?.sections)) {
    privacyContainer.innerHTML = locale.privacy.sections.map(s => `
      <h2 class="text-xl font-semibold text-slate-900 mt-10 mb-3">${s.h}</h2>
      <div class="text-slate-600 leading-relaxed space-y-2 prose-li">${s.body}</div>
    `).join('');
  }

  // Hero meta badges
  const metaContainer = document.querySelector('[data-i18n-meta]');
  if (metaContainer && Array.isArray(locale.hero?.meta)) {
    metaContainer.innerHTML = locale.hero.meta.map(item => `
      <span class="before:content-['✓_'] before:font-bold before:text-slate-900">${item}</span>
    `).join('');
  }

  // Showcase 2 list
  const s2list = document.querySelector('[data-i18n-showcase2-list]');
  if (s2list && Array.isArray(locale.showcase2?.items)) {
    s2list.innerHTML = locale.showcase2.items.map(item => `<li>${item}</li>`).join('');
  }
}

// ─── Lang switcher ────────────────────────────────────────────────────────────

async function switchLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  const locale = await loadLocale(lang);
  applyTranslations(locale);

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    const active = btn.dataset.langBtn === lang;
    btn.classList.toggle('bg-slate-900', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('text-slate-500', !active);
  });

  lucide.createIcons();
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  const lang = detectLang();
  await switchLang(lang);

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => switchLang(btn.dataset.langBtn));
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close menu on nav link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
});
