const destinations = loadDestinations();

/* ---------- Чување на like/dislike и коментари ---------- */
let store = {};
try { store = JSON.parse(localStorage.getItem('gallery')) || {}; } catch (e) { store = {}; }

function saveStore() {
  try { localStorage.setItem('gallery', JSON.stringify(store)); } catch (e) { /* игнорирај */ }
}
function entry(id) {
  if (!store[id]) store[id] = { likes: 0, dislikes: 0, vote: null, comments: [] };
  return store[id];
}

/* ---------- Слики ----------
   За вистински слики, на дестинацијата додај поле images, на пример:
   images: ['images/ohrid1.jpg', 'images/ohrid2.jpg', 'images/ohrid3.jpg']
   Ако нема такво поле, се прикажуваат обоени места за слики. */
function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function placeholder(d, i, n) {
  const dirs = [[0, 0, 1, 1], [1, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]][i % 4];
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>" +
    "<defs><linearGradient id='g' x1='" + dirs[0] + "' y1='" + dirs[1] + "' x2='" + dirs[2] + "' y2='" + dirs[3] + "'>" +
    "<stop offset='0' stop-color='" + d.color + "'/><stop offset='1' stop-color='#17252a'/></linearGradient></defs>" +
    "<rect width='800' height='500' fill='url(#g)'/>" +
    "<text x='400' y='250' text-anchor='middle' font-family='Georgia,serif' font-size='64' fill='#fff'>" + escapeXml(d.name) + "</text>" +
    "<text x='400' y='310' text-anchor='middle' font-family='Arial,sans-serif' font-size='28' fill='#fff' opacity='.8'>Слика " + (i + 1) + " од " + n + "</text>" +
    "</svg>";
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function imagesFor(d) {
  if (d.images && d.images.length) return d.images;
  return [0, 1, 2, 3].map(function (i) { return placeholder(d, i, 4); });
}

/* ---------- Картички со градови ---------- */
const grid = document.getElementById('cities');

function renderGrid() {
  grid.innerHTML = '';
  destinations.forEach(function (d) {
    const e = entry(d.id);

    const card = document.createElement('article');
    card.className = 'city-card';

    const banner = document.createElement('div');
    banner.className = 'city-banner';
    banner.style.background = d.color;
    banner.textContent = d.name;
        // слика на картичката: втората од низата (ако има само една, таа)
    const pics = d.images || [];
    const pic = pics[1] || pics[0];
    if (pic) {
      banner.style.backgroundImage = 'url("' + pic + '")';
      banner.style.backgroundSize = 'cover';
      banner.style.backgroundPosition = 'center';
    }

    const body = document.createElement('div');
    body.className = 'city-body';

    const country = document.createElement('strong');
    country.textContent = d.country;

    const stats = document.createElement('div');
    stats.className = 'card-stats';
    stats.textContent = 'Like: ' + e.likes + '  ·  Dislike: ' + e.dislikes + '  ·  Коментари: ' + e.comments.length;

    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'btn-more';
    open.textContent = 'Отвори галерија';
    open.addEventListener('click', function () { openViewer(d); });

    body.append(country, stats, open);
    card.append(banner, body);
    grid.appendChild(card);
  });
}

/* ---------- Прозорец со галерија ---------- */
const viewer = document.getElementById('viewer');
const vImage = document.getElementById('vImage');
const vThumbs = document.getElementById('vThumbs');
let current = null;
let currentImages = [];
let index = 0;

function openViewer(d) {
  current = d;
  currentImages = imagesFor(d);
  index = 0;
  document.getElementById('vTitle').textContent = d.name + ', ' + d.country;

  vThumbs.innerHTML = '';
  currentImages.forEach(function (src, i) {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Слика ' + (i + 1));
    const t = document.createElement('img');
    t.src = src;
    t.alt = '';
    b.appendChild(t);
    b.addEventListener('click', function () { showImage(i); });
    vThumbs.appendChild(b);
  });

  showImage(0);
  updateVotes();
  renderComments();
  document.getElementById('cMsg').textContent = '';
  viewer.showModal();
}

function showImage(i) {
  const n = currentImages.length;
  index = (i + n) % n;
  vImage.src = currentImages[index];
  vImage.alt = current.name + ' – слика ' + (index + 1) + ' од ' + n;
  Array.prototype.forEach.call(vThumbs.children, function (b, k) {
    b.classList.toggle('on', k === index);
  });
}

document.getElementById('vPrev').addEventListener('click', function () { showImage(index - 1); });
document.getElementById('vNext').addEventListener('click', function () { showImage(index + 1); });
document.getElementById('vClose').addEventListener('click', function () { viewer.close(); });
viewer.addEventListener('close', renderGrid);
viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
viewer.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') showImage(index - 1);
  if (e.key === 'ArrowRight') showImage(index + 1);
});

/* ---------- Like / Dislike ---------- */
const btnLike = document.getElementById('btnLike');
const btnDislike = document.getElementById('btnDislike');
btnDislike.classList.add('dis');

function updateVotes() {
  const e = entry(current.id);
  document.getElementById('likeCount').textContent = e.likes;
  document.getElementById('dislikeCount').textContent = e.dislikes;
  btnLike.classList.toggle('on', e.vote === 'likes');
  btnDislike.classList.toggle('on', e.vote === 'dislikes');
}

function vote(key) {
  const e = entry(current.id);
  if (e.vote === key) {            // втор клик го симнува гласот
    e[key]--;
    e.vote = null;
  } else {
    if (e.vote) e[e.vote]--;       // промена на гласот
    e[key]++;
    e.vote = key;
  }
  saveStore();
  updateVotes();
}
btnLike.addEventListener('click', function () { vote('likes'); });
btnDislike.addEventListener('click', function () { vote('dislikes'); });

/* ---------- Коментари ---------- */
function renderComments() {
  const e = entry(current.id);
  const list = document.getElementById('comments');
  document.getElementById('commentCount').textContent = e.comments.length;
  list.innerHTML = '';

  if (e.comments.length === 0) {
    const li = document.createElement('li');
    li.className = 'no-comments';
    li.textContent = 'Сè уште нема коментари. Биди прв!';
    list.appendChild(li);
    return;
  }

  // од најнов кон најстар
  for (let i = e.comments.length - 1; i >= 0; i--) {
    const c = e.comments[i];
    const li = document.createElement('li');

    const who = document.createElement('span');
    who.className = 'who';
    who.textContent = c.name;

    const when = document.createElement('span');
    when.className = 'when';
    when.textContent = new Date(c.date).toLocaleDateString('mk-MK');

    const p = document.createElement('p');
    p.textContent = c.text;

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'c-del';
    del.textContent = 'Избриши';
    del.addEventListener('click', function () {
      if (!confirm('Дали сакаш да го избришеш коментарот?')) return;
      e.comments.splice(i, 1);
      saveStore();
      renderComments();
    });

    li.append(who, when, p, del);
    list.appendChild(li);
  }
}

document.getElementById('commentForm').addEventListener('submit', function (ev) {
  ev.preventDefault();
  const msg = document.getElementById('cMsg');
  const name = document.getElementById('cName').value.trim() || 'Гостин';
  const text = document.getElementById('cText').value.trim();

  if (text.length < 2) {
    msg.className = 'result err';
    msg.textContent = 'Напиши коментар од најмалку 2 знаци.';
    return;
  }
  entry(current.id).comments.push({ name: name, text: text, date: new Date().toISOString() });
  saveStore();
  document.getElementById('cText').value = '';
  msg.className = 'result ok';
  msg.textContent = 'Коментарот е објавен.';
  renderComments();
});

renderGrid();