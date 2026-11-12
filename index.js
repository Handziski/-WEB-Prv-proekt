const destinations = loadDestinations();
const container = document.getElementById('cities');

function renderCities(list) {
  container.innerHTML = '';
  list.forEach(function (d) {
    const tile = document.createElement('a');
    tile.className = 'tile';
    tile.href = 'gallery.html';

    // фотографија од images (прва од низата), а ако ја нема – боја на градот
    const fallback = 'linear-gradient(135deg, ' + d.color + ', #0f1f2e)';
    if (d.images && d.images.length) {
      tile.style.backgroundImage = 'url("' + d.images[0] + '"), ' + fallback;
    } else {
      tile.style.backgroundImage = fallback;
    }

    const text = document.createElement('div');
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = d.name;
    const sub = document.createElement('span');
    sub.className = 'sub';
    sub.textContent = d.country + ' · од ' + d.pricePerDay + ' € / ден';
    text.append(name, sub);

    const go = document.createElement('span');
    go.className = 'go';
    go.setAttribute('aria-hidden', 'true');
    go.textContent = '→';

    tile.append(text, go);
    container.appendChild(tile);
  });
}

renderCities(destinations);
