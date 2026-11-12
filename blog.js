const listSection = document.getElementById('list');
const articleSection = document.getElementById('article');
const articlesBox = document.getElementById('articles');
const tabsBox = document.getElementById('tabs');
let activeTag = 'Сите';

/* ---------- Список на статии ---------- */
function renderTabs() {
  const tags = ['Сите'];
  articles.forEach(function (a) { if (tags.indexOf(a.tag) === -1) tags.push(a.tag); });

  tabsBox.innerHTML = '';
  tags.forEach(function (t) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = t === 'Сите' ? 'Сите' : (t === 'Водич' ? 'Водичи по градови' : t);
    b.classList.toggle('on', t === activeTag);
    b.addEventListener('click', function () { activeTag = t; renderTabs(); renderList(); });
    tabsBox.appendChild(b);
  });
}

function renderList() {
  articlesBox.innerHTML = '';
  articles
    .filter(function (a) { return activeTag === 'Сите' || a.tag === activeTag; })
    .forEach(function (a) {
      const card = document.createElement('article');
      card.className = 'city-card';
      

      const banner = document.createElement('div');
      banner.className = 'city-banner';
      banner.style.background = a.color;
      banner.textContent = a.city || a.tag;
      if (a.image) {
      banner.style.backgroundImage = 'url("' + a.image + '")';
      banner.style.backgroundSize = 'cover';
      banner.style.backgroundPosition = 'center';
      }

      const body = document.createElement('div');
      body.className = 'city-body';

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.style.alignSelf = 'flex-start';
      badge.textContent = a.tag;

      const title = document.createElement('strong');
      title.textContent = a.title;

      const p = document.createElement('p');
      p.className = 'summary';
      p.textContent = a.summary;

      const link = document.createElement('a');
      link.href = '#' + a.id;
      link.className = 'btn-more';
      link.textContent = 'Прочитај';

      body.append(badge, title, p, link);
      card.append(banner, body);
      articlesBox.appendChild(card);
    });
}

/* ---------- Една статија ---------- */
function showArticle(a) {
  document.getElementById('aTag').textContent = a.tag;
  document.getElementById('aTitle').textContent = a.title;
  document.getElementById('aIntro').textContent = a.intro;
  document.title = a.title + ' – Патни планови';

  const ol = document.getElementById('aItems');
  ol.innerHTML = '';
  (a.items || []).forEach(function (it) {
    const li = document.createElement('li');
    const s = document.createElement('strong');
    s.textContent = it[0];
    const t = document.createElement('span');
    t.textContent = it[1];
    li.append(s, t);
    ol.appendChild(li);
  });

  const text = document.getElementById('aText');
  text.innerHTML = '';
  (a.paragraphs || []).forEach(function (para) {
    const p = document.createElement('p');
    p.textContent = para;
    text.appendChild(p);
  });

  const links = document.getElementById('aLinks');
  links.innerHTML = '';
  if (a.city) {
    const g = document.createElement('a');
    g.href = 'gallery.html';
    g.textContent = 'Погледни слики од ' + a.city;
    links.appendChild(g);
  }
  const d = document.createElement('a');
  d.href = 'destinations.html';
  d.textContent = 'Пресметај трошоци';
  links.appendChild(d);

  listSection.hidden = true;
  articleSection.hidden = false;
  window.scrollTo(0, 0);
}

/* ---------- Рутирање преку # во адресата ---------- */
function route() {
  const id = location.hash.slice(1);
  const a = articles.find(function (x) { return x.id === id; });
  if (a) {
    showArticle(a);
  } else {
    articleSection.hidden = true;
    listSection.hidden = false;
    document.title = 'Патни планови – Блог';
  }
}

window.addEventListener('hashchange', route);
renderTabs();
renderList();
route();
