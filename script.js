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
  const done = document.getElementById('form-done');
  const fields = {
    name: form.querySelector('#f-name'),
    email: form.querySelector('#f-email'),
    date: form.querySelector('#f-date'),
  };

  /* ご希望日は今日以降のみ */
  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  fields.date.min = today;

  const rules = {
    name: (v) => (v.trim() ? '' : 'お名前を入力してください。'),
    email: (v) => {
      if (!v.trim()) return 'メールアドレスを入力してください。';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'メールアドレスの形式が正しくありません（例：taro@example.com）。';
      return '';
    },
    date: (v) => {
      if (fields.date.validity.badInput) return '日付を正しく入力してください。';
      if (!v) return '';
      if (v < today) return '本日以降の日付を選んでください。';
      if (new Date(`${v}T00:00:00`).getDay() === 3) return '水曜日は定休日です。別の日を選んでください。';
      return '';
    },
  };

  const check = (key) => {
    const input = fields[key];
    const error = rules[key](input.value);
    document.getElementById(`${input.id}-error`).textContent = error;
    if (error) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    return !error;
  };

  /* 一度入力した項目は、離れたとき・修正中にチェック */
  Object.keys(fields).forEach((key) => {
    const input = fields[key];
    input.addEventListener('blur', () => { if (input.value || input.dataset.touched) { input.dataset.touched = '1'; check(key); } });
    input.addEventListener('input', () => { if (input.dataset.touched) check(key); });
    input.addEventListener('change', () => { if (key === 'date') { input.dataset.touched = '1'; check(key); } });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = Object.keys(fields).filter((key) => {
      fields[key].dataset.touched = '1';
      return !check(key);
    });
    if (invalid.length) {
      msg.textContent = `入力内容を確認してください（${invalid.length}件）。`;
      fields[invalid[0]].focus({ preventScroll: true });
      fields[invalid[0]].scrollIntoView({ block: 'center' });
      return;
    }
    /* デモ：どこにも送信しない */
    msg.textContent = '';
    form.reset();
    Object.values(fields).forEach((input) => delete input.dataset.touched);
    form.hidden = true;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ block: 'start' });
  });

  done.querySelector('.form-done__back').addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    fields.name.focus({ preventScroll: true });
    fields.name.scrollIntoView({ block: 'center' });
  });
})();
