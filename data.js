// Заеднички податоци за дестинациите (се користи на почетната и на страницата Дестинации)
const defaultDestinations = [
  { id: 1, name: 'Охрид',     country: 'Македонија', category: 'Одмор',    pricePerDay: 45,  color: '#1b6b7b',
    text: 'Езеро, стара чаршија и црквата Свети Јован Канео.', 
    images:['images/ohrid1.jpg','images/ohrid2.jpg','images/ohrid3.jpg','images/ohrid4.jpg'] },
  { id: 2, name: 'Париз', country: 'Франција', category: 'Култура', pricePerDay: 150, color: '#7a3b69',
    text: 'Ајфелова кула, Лувр и кафулиња покрај Сена.',
    images: ['images/pariz1.jpg', 'images/pariz2.jpg', 'images/pariz3.jpg', 'images/pariz4.jpg'] },
  { id: 3, name: 'Рим',       country: 'Италија',    category: 'Историја', pricePerDay: 110, color: '#a4482f',
    text: 'Колосеум, Ватикан и фонтаната Треви на пешачка оддалеченост.',
  images:['images/rim (1).jpg','images/rim (2).jpg','images/rim (3).jpg','images/rim (4).jpg'] },
  { id: 4, name: 'Барселона', country: 'Шпанија',    category: 'Одмор',    pricePerDay: 120, color: '#c27a1a',
    text: 'Архитектура на Гауди, плажи и тапас барови.',
  images:['images/barcelona (1).jpg','images/barcelona (2).jpg','images/barcelona (3).jpg','images/barcelona (4).jpg'] },
  { id: 5, name: 'Прага',     country: 'Чешка',      category: 'Култура',  pricePerDay: 80,  color: '#3f5e8c',
    text: 'Карлов мост, Старски плоштад и прашки замок.',
    images:['images/praga (1).jpg','images/praga (2).jpg','images/praga (3).jpg','images/praga (4).jpg'] },
  { id: 6, name: 'Истанбул',  country: 'Турција',    category: 'Историја', pricePerDay: 70,  color: '#2f7a4f',
    text: 'Света Софија, Големата чаршија и крстарење по Босфорот.',
    images:['images/instab (1).jpg','images/instab (3).jpg','images/instab (2).jpg','images/instab (4).jpg'] }
  
];

function loadDestinations() {
  try {
    const saved = localStorage.getItem('destinations');
    if (saved) {
      const list = JSON.parse(saved);
      // сликите секогаш се земаат од data.js
      list.forEach(function (d) {
        const def = defaultDestinations.find(function (x) { return x.id === d.id; });
        if (def && def.images) d.images = def.images;
      });
      return list;
    }
  } catch (e) { /* ако нема localStorage, користиме почетна листа */ }
  return defaultDestinations.slice();
}

function saveDestinations(list) {
  try {
    localStorage.setItem('destinations', JSON.stringify(list));
  } catch (e) { /* игнорирај */ }
}
