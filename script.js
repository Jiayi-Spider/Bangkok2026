const fallbackSchedule = `| 天数 | 日期 | 主题 | 时间 | 行程 | 地图搜索词 |
|---|---|---|---|---|---|
| 1 | 10月03日 · 周六 | 抵达曼谷 | 07:30 | 上海浦东 PVG → 曼谷素万那普 BKK 11:05 | Suvarnabhumi Airport |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 12:00 | 携程舒适型接机 | Suvarnabhumi Airport |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 13:30 | 曼谷王权铂尔曼酒店 Pullman 办理入住 | Pullman Bangkok King Power |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 15:30 | 胜利纪念碑 Victory Monument | Victory Monument Bangkok |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 16:30 | 尚泰世界购物中心 CentralWorld | CentralWorld Bangkok |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 18:00 | 河滨夜市 Asiatique 夜景 | Asiatique The Riverfront |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 21:00 | 蓬萨旺天堂水疗美容 Pornsawan Heaven Spa & Beauty 按摩 | Pornsawan Heaven Spa & Beauty Bangkok |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 上午 | 空邦隆艺术家水上市场 Khlong Bang Luang | Khlong Bang Luang Floating Market |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 下午 | 大皇宫 | The Grand Palace Bangkok |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 下午 | 卧佛寺 Wat Pho | Wat Pho Bangkok |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 傍晚 | 郑王庙 Wat Arun | Wat Arun Bangkok |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 19:00 | 朱拉隆功夜市 · 松松海鲜 Som Som Seafood 晚餐 | Som Som Seafood Stadium One Bangkok |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 上午 | 曼谷王权铂尔曼酒店 Pullman 退房 | Pullman Bangkok King Power |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 12:00 | 曼谷拉差阿帕森万丽酒店 Renaissance 入住 | Renaissance Bangkok Ratchaprasong |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 13:00 | Inter Restaurant since 1981 老字号泰餐午餐 | Inter Restaurant Siam Square 9 Bangkok |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 15:00 | 暹罗百丽宫 Siam Paragon | Siam Paragon |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 17:30 | Big C 超市 | Big C Supercenter Ratchadamri |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 18:30 | 四面佛 Erawan Shrine | Erawan Shrine |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 19:00 | 爱侣湾茶室 Erawan Tea Room 晚餐 | Erawan Tea Room Grand Hyatt Erawan Bangkok |
| 4 | 10月06日 · 周二 | 城市体验 | 上午 | 暹罗天地 ICONSIAM | ICONSIAM |
| 4 | 10月06日 · 周二 | 城市体验 | 下午 | 湄南河景体验 | Chao Phraya River Bangkok |
| 4 | 10月06日 · 周二 | 城市体验 | 晚上 | 高级泰餐 | Thai Fine Dining Bangkok |
| 5 | 10月07日 · 周三 | 放松日 | 上午 | VIE 酒店套房体验 | VIE Hotel Bangkok MGallery |
| 5 | 10月07日 · 周三 | 放松日 | 下午 | MBK 购物中心 | MBK Center |
| 5 | 10月07日 · 周三 | 放松日 | 下午 | 暹罗中心 Siam Center | Siam Center |
| 5 | 10月07日 · 周三 | 放松日 | 晚上 | 最后一顿泰餐 | Thai Restaurant Siam Bangkok |
| 6 | 10月08日 · 周四 | 返回上海 | 上午 | 酒店早餐 | VIE Hotel Bangkok MGallery |
| 6 | 10月08日 · 周四 | 返回上海 | 中午 | 前往机场 | Suvarnabhumi Airport |
| 6 | 10月08日 · 周四 | 返回上海 | 起飞 | 曼谷 → 上海 | Suvarnabhumi Airport |`;

const safe = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
})[char]);

function parseSchedule(markdown) {
  const rows = markdown.split(/\r?\n/)
    .filter(line => /^\s*\|/.test(line))
    .map(line => line.trim().slice(1, -1).split('|').map(cell => cell.trim()))
    .filter(cells => /^\d+$/.test(cells[0]) && cells.length >= 6);

  const grouped = new Map();
  rows.forEach(([day, date, title, time, activity, query]) => {
    if (!grouped.has(day)) {
      grouped.set(day, {
        n: String(day).padStart(2, '0'),
        date,
        title,
        items: []
      });
    }
    grouped.get(day).items.push([time, activity, query || activity]);
  });
  return [...grouped.values()];
}

const appleMapLink = query => `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
const googleMapLink = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const grabLink = query => `https://grab.onelink.me/2695613898?af_dp=grab%3A%2F%2Fopen%3FscreenType%3DBOOKING%26dropOffLocationName%3D${encodeURIComponent(query)}`;
const nearbyFoodLink = query => `https://maps.apple.com/?q=${encodeURIComponent(query)}`;

function routePlaces(items) {
  return items.map(item => item[2]).filter((place, index, places) =>
    place && (index === 0 || place !== places[index - 1])
  );
}

function googleRouteEmbed(items) {
  const places = routePlaces(items);
  if (places.length <= 1) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(places[0] || 'Bangkok')}&z=13&output=embed`;
  }
  const destinationChain = places.slice(1).map(encodeURIComponent).join('+to:');
  return `https://maps.google.com/maps?saddr=${encodeURIComponent(places[0])}&daddr=${destinationChain}&output=embed`;
}

function googleFullRoute(items) {
  const places = routePlaces(items);
  if (places.length <= 1) return googleMapLink(places[0] || 'Bangkok');
  const params = new URLSearchParams({
    api: '1',
    origin: places[0],
    destination: places[places.length - 1],
    travelmode: 'driving'
  });
  if (places.length > 2) params.set('waypoints', places.slice(1, -1).join('|'));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

const foodRecommendations = [
  { matches: ['Victory Monument'], name: 'Baan Kuay Tiew Ruathong', query: 'Baan Kuay Tiew Ruathong Bangkok', dishes: '船面 · 深色浓汤 · 猪肉/牛肉丸', price: '฿100–250/人' },
  { matches: ['Pullman 办理入住'], name: 'Somtum On Sunday', query: 'Somtum On Sunday Bangkok', dishes: '青木瓜沙拉 · 猪颈肉 · Larb', price: '฿200–400/人' },
  { matches: ['大皇宫', '卧佛寺 Wat Pho'], name: 'Manee Thai Food', query: 'Manee Thai Food Tha Tien Bangkok', dishes: 'Tom Kha Gai · Pad Thai · 打抛', price: '฿150–300/人' },
  { matches: ['郑王庙 Wat Arun'], name: 'Pad Thai Kratong Thong by ama', query: 'Pad Thai Kratong Thong by ama Bangkok', dishes: '酥脆金杯 Pad Thai', price: '฿150–300/人' },
  {
    matches: ['松松海鲜 Som Som Seafood', '朱拉隆功夜市'],
    name: '松松海鲜 Som Som Seafood',
    query: 'Som Som Seafood Stadium One Bangkok',
    dishes: '咖喱炒蟹肉 · 炭烤大头虾 · 粉丝焗河虾 · 冬阴功',
    price: '约฿500–700/人',
    alternative: { name: 'Rongros', query: 'Rongros Bangkok', note: '河景泰餐 · 建议预约' }
  },
  { matches: ['Inter Restaurant since 1981'], name: 'Inter Restaurant since 1981', query: 'Inter Restaurant Siam Square 9 Bangkok', dishes: '冬阴功 · 炸鸡翅 · 泰式炒河粉 · 咖喱', price: '约฿200–400/人' },
  { matches: ['爱侣湾茶室 Erawan Tea Room'], name: '爱侣湾茶室 Erawan Tea Room', query: 'Erawan Tea Room Grand Hyatt Erawan Bangkok', dishes: '泰式咖喱 · 蟹肉米线 · 泰式街头小食', price: '价格以当日菜单为准 · 建议预约' },
  { matches: ['高级泰餐'], name: 'Sra Bua by Num Weerawat', query: 'Sra Bua by Num Weerawat Bangkok', dishes: '现代泰餐 · Tom Yum', price: '฿2,000+/人' },
  { matches: ['VIE Hotel Suite 体验', 'MBK', 'Siam Center', '最后一顿泰餐'], name: 'Porwa Northern Thai Cuisine', query: 'Porwa Northern Thai Cuisine Bangkok', dishes: 'Khao Soi · Sai Ua · Nam Prik Noom', price: '฿200–400/人' }
];

function getFoodRecommendation(activity, placeQuery) {
  return foodRecommendations.find(option =>
    option.matches.some(term => activity.includes(term))
  ) || { name: '搜索附近特色美食', query: `Restaurants near ${placeQuery}`, dishes: '', price: '' };
}

function renderSchedule(days) {
  const daysEl = document.querySelector('#days');
  daysEl.innerHTML = days.map((day, index) => `
    <article class="day" data-day="${index}">
      <div class="day-head">
        <span class="day-num">${safe(day.n)}</span>
        <span class="day-date">${safe(day.date)}</span>
      </div>
      <h3>${safe(day.title)}</h3>
      <div class="day-map">
        <iframe
          src="${googleRouteEmbed(day.items)}"
          title="第${safe(day.n)}天 Google Maps 路线缩略图"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        <div class="day-map-bar">
          <span>${routePlaces(day.items).length} 个路线节点</span>
          <a href="${googleFullRoute(day.items)}" target="_blank" rel="noopener">Google Maps 完整路线 ↗</a>
        </div>
      </div>
      <ul class="timeline">
        ${day.items.map(item => {
          const food = getFoodRecommendation(item[1], item[2]);
          return `
          <li>
            <time>${safe(item[0])}</time>
            <span>${safe(item[1])}</span>
            <span class="place-links">
              <a class="apple-map" href="${appleMapLink(item[2])}" target="_blank" rel="noopener" aria-label="在 Apple Maps 查看 ${safe(item[1])}">Apple</a>
              <a href="${googleMapLink(item[2])}" target="_blank" rel="noopener" aria-label="在 Google Maps 查看 ${safe(item[1])}">Google</a>
              <a href="${grabLink(item[2])}" target="_blank" rel="noopener" aria-label="使用 Grab 前往 ${safe(item[1])}">Grab</a>
              <a class="food-nearby" href="${nearbyFoodLink(food.query)}" target="_blank" rel="noopener" aria-label="查看 ${safe(food.name)}">附近美食</a>
            </span>
            ${food.dishes ? `
              <small class="food-pick">
                <b>首选 · ${safe(food.name)}</b>
                <span>必点：${safe(food.dishes)} · ${safe(food.price)}</span>
                ${food.alternative ? `<a class="food-alt" href="${nearbyFoodLink(food.alternative.query)}" target="_blank" rel="noopener">备选 · ${safe(food.alternative.name)} ↗</a><span>${safe(food.alternative.note)}</span>` : ''}
              </small>` : ''}
          </li>`}).join('')}
      </ul>
      <label class="complete">
        <input type="checkbox" data-check="${index}">
        <span>完成今日行程</span>
      </label>
    </article>`).join('');

  const checks = [...document.querySelectorAll('[data-check]')];
  const update = () => {
    let done = 0;
    checks.forEach((check, index) => {
      const isDone = localStorage.getItem(`bkk-day-${index}`) === '1';
      check.checked = isDone;
      check.closest('.day').classList.toggle('done', isDone);
      if (isDone) done += 1;
    });
    document.querySelector('#progressText').textContent = `${done} / ${days.length}`;
    document.querySelector('#progressBar').style.width = `${days.length ? done / days.length * 100 : 0}%`;
  };

  checks.forEach((check, index) => check.addEventListener('change', () => {
    localStorage.setItem(`bkk-day-${index}`, check.checked ? '1' : '0');
    update();
  }));
  update();
}

async function loadSchedule() {
  let markdown = fallbackSchedule;
  if (location.protocol.startsWith('http')) {
    try {
      const response = await fetch('./schedule.md', { cache: 'no-cache' });
      if (!response.ok) throw new Error('schedule.md unavailable');
      markdown = await response.text();
    } catch (error) {
      console.warn('使用内置行程数据。', error);
    }
  }
  const days = parseSchedule(markdown);
  renderSchedule(days.length ? days : parseSchedule(fallbackSchedule));
}

loadSchedule();

const splash = document.querySelector('.trip-splash');
if (splash) {
  const randomValue = globalThis.crypto?.getRandomValues
    ? crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296
    : Math.random();
  splash.classList.toggle('variant-two', randomValue < 0.5);
  splash.classList.add('is-ready');
  splash.addEventListener('animationend', event => {
    if (event.animationName === 'trip-splash-exit') splash.remove();
  });
}

const links = [...document.querySelectorAll('.topbar nav a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href')));
sections.forEach(section => new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${entry.target.id}`
      ));
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' }).observe(section));

document.querySelector('#shareBtn').addEventListener('click', async () => {
  const data = { title: '2026 Bangkok Trip Planner', text: '我的曼谷六天五晚旅行计划' };
  if (navigator.share) {
    try { await navigator.share(data); } catch (error) {}
  } else {
    location.hash = 'schedule';
  }
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  if (['127.0.0.1', 'localhost'].includes(location.hostname)) {
    navigator.serviceWorker.getRegistrations().then(registrations =>
      registrations.forEach(registration => registration.unregister())
    );
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' });
    });
  }
}
