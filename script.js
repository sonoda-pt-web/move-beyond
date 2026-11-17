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
    }, { rootMargin: '0px 0px 8% 0px', threshold: 0 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }
  onScroll();

  /* ---- Demo form ---- */
  const form = document.querySelector('.reserve-form');
  const msg = form.querySelector('.form-msg');

  const done = document.getElementById('form-done');
  const confirmBox = document.getElementById('form-confirm');
  const fields = {
    name: form.querySelector('#f-name'),
    email: form.querySelector('#f-email'),
    date: form.querySelector('#f-date'),
    time: form.querySelector('#f-time'),
    tel: form.querySelector('#f-tel'),
  };

  /* 入力 → 確認 → 完了 の表示切り替え */
  const showStep = (step) => {
    form.hidden = step !== 'input';
    confirmBox.hidden = step !== 'confirm';
    done.hidden = step !== 'done';
  };

  /* ---- Program buttons: preselect the program in the form ---- */
  const programSelect = form.querySelector('select[name="program"]');
  document.querySelectorAll('[data-program]').forEach((btn) => {
    btn.addEventListener('click', () => {
      programSelect.value = btn.dataset.program;
      showStep('input'); /* 確認・完了画面のときは入力画面に戻して、選んだプログラムを見せる */
    });
  });

  /* ご希望日は今日以降のみ */
  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  fields.date.min = today;

  /* 土・日は18:00までのため、夜の時間帯は選べない（祝日は判定しない） */
  const isWeekend = (v) => { const d = new Date(`${v}T00:00:00`).getDay(); return d === 0 || d === 6; };

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
    tel: (v) => {
      const t = v.trim();
      if (!t) return '';
      if (!/^[0-9０-９\-－‐ー()（）+＋\s]+$/.test(t)) return '電話番号は数字とハイフンで入力してください（例：090-1234-5678）。';
      const digits = t.replace(/[^0-9０-９]/g, '').length;
      if (digits < 10 || digits > 11) return '電話番号の桁数を確認してください（ハイフンを除いて10〜11桁）。';
      return '';
    },
    time: (v) => {
      const d = fields.date.value;
      if (v === 'evening' && d && !fields.date.validity.badInput && isWeekend(d)) return '土・日は18:00までのため、夜の時間帯は選べません。午前・午後から選んでください。';
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
    input.addEventListener('change', () => {
      if (key === 'date' || key === 'time') { input.dataset.touched = '1'; check(key); }
      /* 日付を変えたら、時間帯（夜）の可否も見直す */
      if (key === 'date' && fields.time.dataset.touched) check('time');
    });
  });

  /* 確認画面に入力内容を表示（textContent のみ使用） */
  const labelOf = (select) => select.options[select.selectedIndex].text;
  const formatDate = (v) => {
    if (!v) return '指定なし';
    const d = new Date(`${v}T00:00:00`);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${'日月火水木金土'[d.getDay()]}）`;
  };
  const fillConfirm = () => {
    const values = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      tel: fields.tel.value.trim() || '未入力',
      program: labelOf(programSelect),
      date: formatDate(fields.date.value),
      time: labelOf(fields.time),
    };
    confirmBox.querySelectorAll('[data-confirm]').forEach((dd) => { dd.textContent = values[dd.dataset.confirm]; });
  };

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
    /* 確認画面へ */
    msg.textContent = '';
    fillConfirm();
    showStep('confirm');
    confirmBox.focus({ preventScroll: true });
    confirmBox.scrollIntoView({ block: 'start' });
  });

  /* 修正する：入力内容を残したまま入力画面へ */
  confirmBox.querySelector('.form-confirm__back').addEventListener('click', () => {
    showStep('input');
    fields.name.focus({ preventScroll: true });
    fields.name.scrollIntoView({ block: 'center' });
  });

  /* この内容で送信：デモのため、どこにも送信・保存しない */
  confirmBox.querySelector('.form-confirm__send').addEventListener('click', () => {
    form.reset();
    Object.values(fields).forEach((input) => delete input.dataset.touched);
    confirmBox.querySelectorAll('[data-confirm]').forEach((dd) => { dd.textContent = ''; });
    showStep('done');
    done.focus({ preventScroll: true });
    done.scrollIntoView({ block: 'start' });
  });

  done.querySelector('.form-done__back').addEventListener('click', () => {
    showStep('input');
    fields.name.focus({ preventScroll: true });
    fields.name.scrollIntoView({ block: 'center' });
  });
})();
