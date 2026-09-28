const fallbackSchedule = `| 天数 | 日期 | 主题 | 时间 | 行程 | 地图搜索词 |
|---|---|---|---|---|---|
| 1 | 10月03日 · 周六 | 抵达曼谷 | 07:30 | PVG → BKK 11:05 | Suvarnabhumi Airport |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 12:00 | 携程舒适型接机 | Suvarnabhumi Airport |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 13:30 | Pullman 办理入住 | Pullman Bangkok King Power |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 15:30 | King Power Rangnam | King Power Rangnam |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 17:00 | Victory Monument | Victory Monument Bangkok |
| 1 | 10月03日 · 周六 | 抵达曼谷 | 19:00 | Asiatique 夜景 | Asiatique The Riverfront |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 上午 | Khlong Bang Luang 水上市场 | Khlong Bang Luang Floating Market |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 下午 | 大皇宫 | The Grand Palace Bangkok |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 下午 | 卧佛寺 Wat Pho | Wat Pho Bangkok |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 傍晚 | 郑王庙 Wat Arun | Wat Arun Bangkok |
| 2 | 10月04日 · 周日 | 曼谷文化日 | 晚上 | 朱拉隆功夜市 | Chulalongkorn University Night Market |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 上午 | Pullman 退房 | Pullman Bangkok King Power |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 中午 | Renaissance 入住 | Renaissance Bangkok Ratchaprasong |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 下午 | CentralWorld | CentralWorld Bangkok |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 下午 | Siam Paragon | Siam Paragon |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 傍晚 | Big C | Big C Supercenter Ratchadamri |
| 3 | 10月05日 · 周一 | 换酒店与购物 | 晚上 | 四面佛 Erawan Shrine | Erawan Shrine |
| 4 | 10月06日 · 周二 | 城市体验 | 上午 | ICONSIAM | ICONSIAM |
| 4 | 10月06日 · 周二 | 城市体验 | 下午 | 湄南河景体验 | Chao Phraya River Bangkok |
| 4 | 10月06日 · 周二 | 城市体验 | 晚上 | 高级泰餐 | Thai Fine Dining Bangkok |
| 5 | 10月07日 · 周三 | 放松日 | 上午 | VIE Hotel Suite 体验 | VIE Hotel Bangkok MGallery |
| 5 | 10月07日 · 周三 | 放松日 | 下午 | MBK | MBK Center |
| 5 | 10月07日 · 周三 | 放松日 | 下午 | Siam Center | Siam Center |
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
const nearbyFoodLink = query => `https://maps.apple.com/?q=${encodeURIComponent(`Restaurants near ${query}`)}`;

function renderSchedule(days) {
  const daysEl = document.querySelector('#days');
  daysEl.innerHTML = days.map((day, index) => `
    <article class="day" data-day="${index}">
      <div class="day-head">
        <span class="day-num">${safe(day.n)}</span>
        <span class="day-date">${safe(day.date)}</span>
      </div>
      <h3>${safe(day.title)}</h3>
      <ul class="timeline">
        ${day.items.map(item => `
          <li>
            <time>${safe(item[0])}</time>
            <span>${safe(item[1])}</span>
            <span class="place-links">
              <a class="apple-map" href="${appleMapLink(item[2])}" target="_blank" rel="noopener" aria-label="在 Apple Maps 查看 ${safe(item[1])}">Apple</a>
              <a href="${googleMapLink(item[2])}" target="_blank" rel="noopener" aria-label="在 Google Maps 查看 ${safe(item[1])}">Google</a>
              <a href="${grabLink(item[2])}" target="_blank" rel="noopener" aria-label="使用 Grab 前往 ${safe(item[1])}">Grab</a>
              <a class="food-nearby" href="${nearbyFoodLink(item[2])}" target="_blank" rel="noopener" aria-label="查看 ${safe(item[1])} 附近美食">附近美食</a>
            </span>
          </li>`).join('')}
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
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
}
