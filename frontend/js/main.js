// Общая инициализация страницы: мобильное меню и scroll-reveal анимации.
(function () {
  // --- Мобильное меню (бургер) ---
  const toggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Закрыть меню навигации' : 'Открыть меню навигации');
    });

    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Scroll-reveal через IntersectionObserver ---
  const revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    // Фолбэк для браузеров без поддержки IntersectionObserver
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
})();
