// Заеднички функции за корисници (се користи на login.html и register.html)
// Демо профил што секогаш постои:  demo@patniplanovi.mk  /  demo123
const DEMO_USER = { name: 'Демо корисник', email: 'demo@patniplanovi.mk', password: 'demo123' };

function getRegisteredUsers() {
  try { return JSON.parse(localStorage.getItem('users')) || []; } catch (e) { return []; }
}
function getUsers() {
  return [DEMO_USER].concat(getRegisteredUsers());
}
function findUser(email, password) {
  email = email.trim().toLowerCase();
  return getUsers().find(function (u) {
    return u.email === email && u.password === password;
  });
}
function emailExists(email) {
  email = email.trim().toLowerCase();
  return getUsers().some(function (u) { return u.email === email; });
}
function addUser(name, email, password) {
  const list = getRegisteredUsers();
  list.push({ name: name, email: email.trim().toLowerCase(), password: password });
  try { localStorage.setItem('users', JSON.stringify(list)); } catch (e) { /* игнорирај */ }
}
