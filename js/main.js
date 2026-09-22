/* МеталлПро — скрипты: меню, галерея (lightbox + фильтр), валидация формы */
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initGallery();
  initForm();
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

function initMenu() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); burger.classList.remove('open');
  }));
}

function initGallery() {
  const items = [...document.querySelectorAll('.gallery__item')];
  if (!items.length) return;

  // Фильтр по категориям
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(it => it.classList.toggle('hide', cat !== 'all' && it.dataset.cat !== cat));
    });
  });

  const box = document.getElementById('lightbox');
  const img = box.querySelector('img');
  const cap = box.querySelector('.lightbox__caption');
  let index = 0;

  const visible = () => items.filter(i => !i.classList.contains('hide'));
  const show = (i) => {
    const list = visible();
    index = (i + list.length) % list.length;
    const el = list[index];
    img.src = el.dataset.full;
    img.alt = el.querySelector('img').alt;
    cap.textContent = el.dataset.title;
  };
  const open = (el) => { box.classList.add('open'); show(visible().indexOf(el)); document.body.style.overflow = 'hidden'; };
  const close = () => { box.classList.remove('open'); document.body.style.overflow = ''; };

  items.forEach(it => it.addEventListener('click', () => open(it)));
  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__prev').addEventListener('click', e => { e.stopPropagation(); show(index - 1); });
  box.querySelector('.lightbox__next').addEventListener('click', e => { e.stopPropagation(); show(index + 1); });
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const rules = {
    name: v => /^[A-Za-zА-Яа-яЁё\s\-]{2,40}$/.test(v.trim()) ? '' : 'Введите имя (2–40 букв)',
    phone: v => /^\+375\s?\(?(25|29|33|44)\)?\s?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(v.trim())
      ? '' : 'Формат: +375 (29) 123-45-67',
    email: v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Некорректный e-mail',
    service: v => v ? '' : 'Выберите услугу',
    message: v => v.trim().length >= 10 ? '' : 'Опишите задачу (минимум 10 символов)',
    agree: (v, el) => el.checked ? '' : 'Необходимо согласие на обработку данных'
  };

  const check = (el) => {
    const rule = rules[el.name];
    if (!rule) return true;
    const msg = rule(el.value, el);
    const err = el.closest('.form__group').querySelector('.form__error');
    err.textContent = msg;
    el.classList.toggle('invalid', !!msg);
    el.classList.toggle('valid', !msg && el.value.trim() !== '');
    return !msg;
  };

  const fields = [...form.querySelectorAll('input, select, textarea')];
  fields.forEach(el => {
    el.addEventListener('blur', () => check(el));
    el.addEventListener('input', () => { if (el.classList.contains('invalid')) check(el); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = fields.map(check).every(Boolean);
    const success = document.getElementById('form-success');
    if (!ok) { form.querySelector('.invalid').focus(); success.classList.remove('show'); return; }

    success.classList.add('show');
    form.reset();
    fields.forEach(el => el.classList.remove('valid', 'invalid'));
  });
}
