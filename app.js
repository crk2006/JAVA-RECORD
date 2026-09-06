let selectedWeek = 1;
let loadTimer;
const $ = (selector) => document.querySelector(selector);
const weekList = $('#weekList');
function renderWeeks(filter = '') {
  const query = filter.trim().toLowerCase();
  const visibleWeeks = weeks.filter((week) => !query || `${week.title} ${week.subtitle} ${week.keywords}`.toLowerCase().includes(query));
  weekList.innerHTML = visibleWeeks.length ? visibleWeeks.map((week) => `<button class="week-button ${week.id === selectedWeek ? 'active' : ''}" data-week="${week.id}"><span class="week-number">0${week.id}</span><span><strong>Week ${week.id}</strong><small>${week.title}</small></span><span class="arrow">→</span></button>`).join('') : '<p class="empty-search">No matching records</p>';
  weekList.querySelectorAll('[data-week]').forEach((button) => button.addEventListener('click', () => selectWeek(Number(button.dataset.week))));
}
function selectWeek(id) {
  selectedWeek = id;
  const week = weeks.find((item) => item.id === id);
  $('#recordTitle').textContent = week.title; $('#recordSubtitle').textContent = week.subtitle;
  $('#recordBadge').innerHTML = `Week ${id} <span>●</span>`; $('#pageIndicator').textContent = `0${id} / ${String(weeks.length).padStart(2, '0')}`;
  $('#previousWeek').disabled = id === 1; $('#nextWeek').disabled = id === weeks.length; $('#downloadDocument').href = week.document; $('#loadingOpenDocument').href = week.document;
  $('#viewerLoading').hidden = false; $('#missingDocument').hidden = true; $('#documentFrame').hidden = false; $('#documentFrame').data = week.document;
  renderWeeks($('#searchInput').value);
  setTimeout(() => { $('#viewerLoading').hidden = true; }, 1200);
  clearTimeout(loadTimer);
  loadTimer = setTimeout(showMissingDocument, 10000);
}
function toast(message) { const element = $('#toast'); element.textContent = message; element.classList.add('show'); setTimeout(() => element.classList.remove('show'), 2400); }
$('#searchInput').addEventListener('input', (event) => renderWeeks(event.target.value));
$('#previousWeek').addEventListener('click', () => selectWeek(selectedWeek - 1)); $('#nextWeek').addEventListener('click', () => selectWeek(selectedWeek + 1));
$('#openDocument').addEventListener('click', () => window.open(weeks.find((week) => week.id === selectedWeek).document, '_blank'));
$('#fullscreenDocument').addEventListener('click', () => { const viewer = $('#viewerWrap'); if (document.fullscreenElement) document.exitFullscreen(); else viewer.requestFullscreen?.(); });
$('#themeToggle').addEventListener('click', () => { document.body.classList.toggle('dark-mode'); localStorage.setItem('jlr-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light'); });
if (localStorage.getItem('jlr-theme') === 'dark') document.body.classList.add('dark-mode');
function toggleMenu(open) { $('#sidebar').classList.toggle('open', open); $('#scrim').classList.toggle('visible', open); }
$('#openMenu').addEventListener('click', () => toggleMenu(true)); $('#closeMenu').addEventListener('click', () => toggleMenu(false)); $('#scrim').addEventListener('click', () => toggleMenu(false));
document.querySelectorAll('.bottom-nav button').forEach((button) => button.addEventListener('click', () => toast(`${button.textContent.trim()} view selected`)));
$('#documentFrame').addEventListener('load', () => { clearTimeout(loadTimer); $('#viewerLoading').hidden = true; });
$('#documentFrame').addEventListener('error', () => showMissingDocument());
function showMissingDocument() { $('#viewerLoading').hidden = true; $('#documentFrame').hidden = true; $('#missingDocument').hidden = false; $('#missingTitle').textContent = `Week ${selectedWeek} document is currently unavailable.`; }
$('#retryDocument').addEventListener('click', () => { $('#missingDocument').hidden = true; $('#documentFrame').hidden = false; selectWeek(selectedWeek); });
renderWeeks();