const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const pass = document.getElementById('password');
const emailErr = document.getElementById('emailErr');
const passErr = document.getElementById('passErr');
const msg = document.getElementById('msg');

document.getElementById('toggle').addEventListener('click', function () {
  const show = pass.type === 'password';
  pass.type = show ? 'text' : 'password';
  this.textContent = show ? 'Скриј' : 'Прикажи';
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  emailErr.textContent = '';
  passErr.textContent = '';
  msg.textContent = '';
  msg.className = 'msg';
  let valid = true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    emailErr.textContent = 'Внеси валидна е-пошта.';
    valid = false;
  }
  if (pass.value.length < 6) {
    passErr.textContent = 'Лозинката мора да има најмалку 6 знаци.';
    valid = false;
  }
  if (!valid) return;

  // Проверка дали постои таков корисник
  const user = findUser(email.value, pass.value);
  if (!user) {
    msg.className = 'msg err';
    msg.textContent = 'Погрешна е-пошта или лозинка. Ако немаш профил, регистрирај се.';
    return;   // не продолжува кон index.html
  }

  // „Запомни ме" = останува и по затворање на прелистувачот
  const store = document.getElementById('remember').checked ? localStorage : sessionStorage;
  try {
    store.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
  } catch (err) { /* игнорирај */ }

  msg.className = 'msg ok';
  msg.textContent = 'Добредојде, ' + user.name + '! Пренасочување…';
  setTimeout(function () { window.location.href = 'index.html'; }, 700);
});
