const CATEGORIES = ['Одмор', 'Култура', 'Историја', 'Природа', 'Авантура'];
const COLORS = ['#1b6b7b', '#7a3b69', '#a4482f', '#c27a1a', '#3f5e8c', '#2f7a4f', '#6b4e9b', '#8a5a2b'];

let destinations = loadDestinations();

const grid = document.getElementById('cities');
const emptyMsg = document.getElementById('empty');
const countEl = document.getElementById('count');
const filterCategory = document.getElementById('filterCategory');
const filterBudget = document.getElementById('filterBudget');
const budgetValue = document.getElementById('budgetValue');
const calcDest = document.getElementById('calcDest');
const newCategory = document.getElementById('newCategory');

/* ---------- Популирање на select полињата ---------- */
function fillCategories() {
  filterCategory.innerHTML = '<option value="all">Сите категории</option>';
  CATEGORIES.forEach(function (c) {
    filterCategory.add(new Option(c, c));
    newCategory.add(new Option(c, c));
  });
}

function fillCalcSelect(selectedId) {
  calcDest.innerHTML = '';
  destinations.forEach(function (d) {
    calcDest.add(new Option(d.name + ' (' + d.pricePerDay + ' € / ден)', d.id));
  });
  if (selectedId) calcDest.value = selectedId;
}

/* ---------- Прикажување со филтри ---------- */
function render() {
  const cat = filterCategory.value;
  const maxPrice = Number(filterBudget.value);
  budgetValue.textContent = maxPrice;

  const list = destinations.filter(function (d) {
    return (cat === 'all' || d.category === cat) && d.pricePerDay <= maxPrice;
  });

  grid.innerHTML = '';
  list.forEach(function (d) { grid.appendChild(buildCard(d)); });

  emptyMsg.hidden = list.length > 0;
  countEl.textContent = 'Прикажани: ' + list.length + ' од ' + destinations.length;
}

function buildCard(d) {
  const card = document.createElement('article');
  card.className = 'city-card';

  const banner = document.createElement('div');
  banner.className = 'city-banner';
  banner.style.background = d.color;
  banner.textContent = d.name;
  const pics = d.images || [];
  const pic = pics[2] || pics[0];   // третата слика (или првата ако нема)
  if (pic) {
    banner.style.backgroundImage = 'url("' + pic + '")';
    banner.style.backgroundSize = 'cover';
    banner.style.backgroundPosition = 'center';
  }

  const body = document.createElement('div');
  body.className = 'city-body';

  const meta = document.createElement('div');
  meta.className = 'city-meta';
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = d.category;
  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = d.pricePerDay + ' € / ден';
  meta.append(badge, price);

  const country = document.createElement('strong');
  country.textContent = d.country;
  const text = document.createElement('p');
  text.textContent = d.text;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const calcBtn = document.createElement('button');
  calcBtn.type = 'button';
  calcBtn.className = 'btn-more';
  calcBtn.textContent = 'Пресметај';
  calcBtn.addEventListener('click', function () {
    calcDest.value = d.id;
    document.getElementById('calcForm').scrollIntoView({ behavior: 'smooth' });
  });

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'btn-delete';
  delBtn.textContent = 'Избриши';
  delBtn.addEventListener('click', function () { deleteDestination(d.id); });

  actions.append(calcBtn, delBtn);
  body.append(meta, country, text, actions);
  card.append(banner, body);
  return card;
}

/* ---------- Бришење ---------- */
function deleteDestination(id) {
  const d = destinations.find(function (x) { return x.id === id; });
  if (!d || !confirm('Дали сигурно сакаш да ја избришеш дестинацијата „' + d.name + '“?')) return;

  destinations = destinations.filter(function (x) { return x.id !== id; });
  saveDestinations(destinations);
  fillCalcSelect();
  render();
}

/* ---------- Додавање ---------- */
document.getElementById('addForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const msg = document.getElementById('addMsg');
  const name = document.getElementById('newName').value.trim();
  const country = document.getElementById('newCountry').value.trim();
  const price = Number(document.getElementById('newPrice').value);
  const text = document.getElementById('newText').value.trim();

  if (!name || !country) {
    msg.className = 'result err';
    msg.textContent = 'Внеси град и држава.';
    return;
  }
  if (!(price > 0)) {
    msg.className = 'result err';
    msg.textContent = 'Цената на ден мора да биде број поголем од 0.';
    return;
  }

  const dest = {
    id: Date.now(),
    name: name,
    country: country,
    category: newCategory.value,
    pricePerDay: price,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    text: text || 'Нова дестинација во твојата листа.'
  };
  destinations.push(dest);
  saveDestinations(destinations);

  this.reset();
  fillCalcSelect();
  render();
  msg.className = 'result ok';
  msg.textContent = 'Дестинацијата „' + name + '“ е додадена.';
});

/* ---------- Пресметка на трошоци ---------- */
document.getElementById('calcForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const out = document.getElementById('calcResult');
  const d = destinations.find(function (x) { return x.id === Number(calcDest.value); });
  const days = Number(document.getElementById('calcDays').value);
  const people = Number(document.getElementById('calcPeople').value);
  const transport = Number(document.getElementById('calcTransport').value);

  if (!d) {
    out.className = 'result err';
    out.textContent = 'Нема избрана дестинација.';
    return;
  }
  if (!(days >= 1) || !(people >= 1) || transport < 0) {
    out.className = 'result err';
    out.textContent = 'Деновите и патниците мора да бидат најмалку 1, а превозот не смее да биде негативен.';
    return;
  }

  const stay = d.pricePerDay * days * people;
  const travel = transport * people;
  out.className = 'result';
  out.innerHTML =
    'Престој (' + days + ' ден/а × ' + people + ' лица): <b>' + stay + ' €</b><br>' +
    'Превоз: <b>' + travel + ' €</b><br>' +
    '<span class="total">Вкупно: ' + (stay + travel) + ' €</span>';
});

/* ---------- Настани за филтрите ---------- */
filterCategory.addEventListener('change', render);
filterBudget.addEventListener('input', render);

fillCategories();
fillCalcSelect();
render();
