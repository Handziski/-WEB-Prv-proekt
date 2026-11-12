const form = document.getElementById('surveyForm');
const thanks = document.getElementById('thanks');
const comment = document.getElementById('sComment');
const ease = document.getElementById('sEase');

/* ---------- Мали помошни функции ---------- */
function setError(id, message, fieldId) {
  document.getElementById(id).textContent = message;
  if (fieldId) document.getElementById(fieldId).classList.toggle('has-error', !!message);
}
function checkedValue(name) {
  const el = document.querySelector('input[name="' + name + '"]:checked');
  return el ? el.value : '';
}
function checkedValues(name) {
  return Array.prototype.map.call(
    document.querySelectorAll('input[name="' + name + '"]:checked'),
    function (el) { return el.value; }
  );
}

/* ---------- Живи бројачи ---------- */
ease.addEventListener('input', function () {
  document.getElementById('sEaseOut').textContent = ease.value;
});
comment.addEventListener('input', function () {
  document.getElementById('sCount').textContent = comment.value.length;
});

/* ---------- Валидација ---------- */
function validate() {
  let ok = true;
  const name = document.getElementById('sName').value.trim();
  const age = Number(document.getElementById('sAge').value);
  const email = document.getElementById('sEmail').value.trim();

  setError('sNameErr', '', 'sName');
  setError('sAgeErr', '', 'sAge');
  setError('sEmailErr', '', 'sEmail');
  setError('sSourceErr', '', 'sSource');
  setError('sPagesErr', '');
  setError('sDesignErr', '');
  setError('sRecommendErr', '');

  if (name.length < 2) { setError('sNameErr', 'Внеси го твоето име (најмалку 2 букви).', 'sName'); ok = false; }
  if (!(age >= 10 && age <= 99)) { setError('sAgeErr', 'Внеси возраст од 10 до 99.', 'sAge'); ok = false; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('sEmailErr', 'Внеси валидна е-пошта или остави го полето празно.', 'sEmail'); ok = false;
  }
  if (!document.getElementById('sSource').value) { setError('sSourceErr', 'Избери една опција.', 'sSource'); ok = false; }
  if (checkedValues('pages').length === 0) { setError('sPagesErr', 'Избери најмалку една страница.'); ok = false; }
  if (!checkedValue('design')) { setError('sDesignErr', 'Дај оцена од 1 до 5.'); ok = false; }
  if (!checkedValue('recommend')) { setError('sRecommendErr', 'Избери одговор.'); ok = false; }
  return ok;
}

/* ---------- Чување и статистика ---------- */
function loadAnswers() {
  try { return JSON.parse(localStorage.getItem('survey')) || []; } catch (e) { return []; }
}
function saveAnswers(list) {
  try { localStorage.setItem('survey', JSON.stringify(list)); } catch (e) { /* игнорирај */ }
}

function statsText(list) {
  const n = list.length;
  const avg = list.reduce(function (s, a) { return s + Number(a.design); }, 0) / n;
  const avgEase = list.reduce(function (s, a) { return s + Number(a.ease); }, 0) / n;
  const yes = list.filter(function (a) { return a.recommend === 'Да'; }).length;
  return 'Вкупно одговори: ' + n +
    '\nПросечна оцена за изгледот: ' + avg.toFixed(1) + ' / 5' +
    '\nПросечна леснотија на користење: ' + avgEase.toFixed(1) + ' / 10' +
    '\nБи го препорачале сајтот: ' + Math.round(yes / n * 100) + '%';
}

/* ---------- Испраќање ---------- */
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validate()) {
    const first = form.querySelector('.has-error') || document.querySelector('.error:not(:empty)');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const answer = {
    name: document.getElementById('sName').value.trim(),
    age: document.getElementById('sAge').value,
    email: document.getElementById('sEmail').value.trim(),
    source: document.getElementById('sSource').value,
    pages: checkedValues('pages'),
    design: checkedValue('design'),
    ease: ease.value,
    recommend: checkedValue('recommend'),
    comment: comment.value.trim(),
    date: new Date().toISOString()
  };

  const all = loadAnswers();
  all.push(answer);
  saveAnswers(all);
  showThanks(answer, all);
});

function showThanks(a, all) {
  document.getElementById('tName').textContent = a.name;

  const rows = [
    ['Возраст', a.age],
    ['Како дозна за сајтот', a.source],
    ['Посетени страници', a.pages.join(', ')],
    ['Оцена за изгледот', a.design + ' / 5'],
    ['Леснотија на користење', a.ease + ' / 10'],
    ['Би препорачал', a.recommend],
    ['Коментар', a.comment || '—']
  ];
  const dl = document.getElementById('tSummary');
  dl.innerHTML = '';
  rows.forEach(function (r) {
    const dt = document.createElement('dt');
    dt.textContent = r[0];
    const dd = document.createElement('dd');
    dd.textContent = r[1];
    dl.append(dt, dd);
  });

  const stats = document.getElementById('tStats');
  stats.innerHTML = '';
  statsText(all).split('\n').forEach(function (line, i) {
    if (i > 0) stats.appendChild(document.createElement('br'));
    stats.appendChild(document.createTextNode(line));
  });

  form.hidden = true;
  thanks.hidden = false;
  window.scrollTo(0, 0);
}

document.getElementById('again').addEventListener('click', function () {
  form.reset();
  document.getElementById('sEaseOut').textContent = ease.value;
  document.getElementById('sCount').textContent = '0';
  thanks.hidden = true;
  form.hidden = false;
  window.scrollTo(0, 0);
});
