(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.header');
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  const fab = document.querySelector('.fab');

  /* ---- Mobile menu ---- */
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  };
  menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---- Header border & floating button ---- */
  const reserve = document.getElementById('reserve');
  let reserveVisible = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    fab.classList.toggle('is-visible', y > window.innerHeight * 0.8 && !reserveVisible);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  if ('IntersectionObserver' in window) {
    root.classList.add('js');
    new IntersectionObserver(([entry]) => {
      reserveVisible = entry.isIntersecting;
      onScroll();
    }).observe(reserve);

    /* ---- Scroll reveal ---- */
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }
  onScroll();

  /* ---- Demo form ---- */
  const form = document.querySelector('.reserve-form');
  const msg = form.querySelector('.form-msg');

  /* ---- Program buttons: preselect the program in the form ---- */
  const programSelect = form.querySelector('select[name="program"]');
  document.querySelectorAll('[data-program]').forEach((btn) => {
    btn.addEventListener('click', () => {
      programSelect.value = btn.dataset.program;
    });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      msg.textContent = 'お名前とメールアドレスを正しく入力してください。';
      return;
    }
    msg.textContent = 'デモのため送信は行われません。ご確認ありがとうございました。';
    form.reset();
  });
})();
