const form = document.getElementById('registerForm');
const msg = document.getElementById('rMsg');

function err(id, text) { document.getElementById(id).textContent = text; }

form.addEventListener('submit', function (e) {
  e.preventDefault();
  ['rNameErr', 'rEmailErr', 'rPassErr', 'rPass2Err'].forEach(function (id) { err(id, ''); });
  msg.textContent = '';
  msg.className = 'msg';

  const name = document.getElementById('rName').value.trim();
  const email = document.getElementById('rEmail').value.trim();
  const pass = document.getElementById('rPass').value;
  const pass2 = document.getElementById('rPass2').value;
  let ok = true;

  if (name.length < 2) { err('rNameErr', 'Внеси го твоето име.'); ok = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err('rEmailErr', 'Внеси валидна е-пошта.'); ok = false; }
  else if (emailExists(email)) { err('rEmailErr', 'Веќе постои профил со оваа е-пошта.'); ok = false; }
  if (pass.length < 6) { err('rPassErr', 'Лозинката мора да има најмалку 6 знаци.'); ok = false; }
  if (pass2 !== pass) { err('rPass2Err', 'Лозинките не се совпаѓаат.'); ok = false; }
  if (!ok) return;

  addUser(name, email, pass);
  msg.className = 'msg ok';
  msg.textContent = 'Профилот е креиран! Пренасочување кон најава…';
  setTimeout(function () { window.location.href = 'login.html'; }, 1000);
});
