const scenes = window.LEGAL_SCENES;
const app = document.getElementById('app');
const STORE_KEY = 'legal-instinct-finished-v1';
let completed = loadCompleted();
let state = { page: 'home', scene: null, first: null, second: null };

function loadCompleted() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
}
function saveCompleted(id) {
  if (!completed.includes(id)) completed.push(id);
  try { localStorage.setItem(STORE_KEY, JSON.stringify(completed)); } catch {}
}
function esc(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function button(label, action, variant = '') {
  return `<button class="button ${variant}" type="button" data-action="${action}">${label}</button>`;
}
function sourceLinks(scene) {
  return scene.sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}<span aria-hidden="true">↗</span></a>`).join('');
}
function header() {
  return `<a class="skip-link" href="#main">跳到主要内容</a>
  <header class="site-header"><button class="brand" data-action="home" aria-label="返回 Legal Instinct 首页"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>Legal Instinct<small>法律直觉</small></span></button>
  <div class="header-right"><span class="header-edition">你一生可能遇到的 100 个法律瞬间</span><span class="header-line"></span><span class="header-status">MVP · 5 个可玩情境</span></div></header>`;
}
function footer() {
  return `<footer class="site-footer"><span>Legal Instinct · 法律直觉</span><p>情境以中国大陆现行规则为基础；头盔案例适用浙江省。真实处理时请核对事实、所在地规定和收到的正式文书。</p></footer>`;
}
function renderHome() {
  const featured = scenes[0];
  app.innerHTML = `${header()}<main id="main" class="home-page">
    <section class="hero"><div class="hero-copy"><p class="section-id"><span class="live-dot"></span> 第一辑现已开放</p><h1>在现实发生之前，<br><em>练习你的选择。</em></h1><p class="hero-intro">法律问题到来时，你通常没有时间先读完一篇文章。进入一个真实的瞬间，做出选择，看见后果，再回到关键节点重选。</p><div class="hero-actions">${button('开始第一个情境', 'start:restaurant', 'primary')}<span>每个情境约 3 分钟 · 无需登录</span></div><div class="hero-rule"><span>01 做选择</span><span>02 看后果</span><span>03 带走行动方法</span></div></div>
    <div class="hero-scene" role="group" aria-label="推荐情境"><div class="scene-top"><span>情境档案 ${featured.number}</span><span class="pulse-label">现场进行中</span></div><div class="scene-visual"><div class="scene-ring ring-one"></div><div class="scene-ring ring-two"></div><div class="scene-tick tick-one"></div><div class="scene-tick tick-two"></div><span>21:30</span></div><div class="scene-bottom"><p>餐厅 · 一次冲突</p><h2>${esc(featured.title)}</h2><span>第一反应，会改变之后能看见的证据。</span></div></div></section>
    <section class="catalog" aria-labelledby="catalog-title"><div class="catalog-heading"><div><p class="section-id">情境目录 / 001—005</p><h2 id="catalog-title">从哪一刻开始？</h2></div><p>先从与你最近的处境进入。每一局都能重来，重新试另一条路。</p></div><div class="scene-list">${scenes.map(scene => `<button type="button" class="scene-row" data-action="start:${scene.id}"><span class="row-number">${scene.number}</span><span class="row-main"><strong>${esc(scene.title)}</strong><small>${esc(scene.category)} · ${esc(scene.place)}</small></span><span class="row-meta">${completed.includes(scene.id) ? '已体验 · 可重选' : scene.time}</span><span class="row-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></section>
    <section class="how-it-works"><div class="how-quote">“如果当时我换一个选择，<br>结果会怎样？”</div><div class="how-content"><h2>练的是判断，不是背答案。</h2><p>每个情境有两次决定。系统会展示你选择后可能出现的局势，并指出该保留的证据、可行使的权利，以及下一步可以做的事。情节结果是教学演示，具体案件仍取决于实际事实。</p><div class="how-columns"><div><strong>当下</strong><span>先看安全、时间和信息缺口</span></div><div><strong>事后</strong><span>核对权利、证据和程序</span></div></div></div></section>
  </main>${footer()}`;
}
function progress(scene, step) {
  return `<div class="play-progress"><span>情境 ${scene.number} / ${esc(scene.category)}</span><div class="progress-track" aria-label="进度 ${step} / 3"><i style="width:${step * 33.34}%"></i></div><span>${step} / 3</span></div>`;
}
function playShell(scene, step, body, side) {
  app.innerHTML = `${header()}<main id="main" class="play-page"><div class="play-top"><button class="text-back" data-action="home">← 返回情境目录</button><span>${esc(scene.time)} · ${esc(scene.place)}</span></div>${progress(scene,step)}<div class="play-grid"><section class="play-main" aria-live="polite">${body}</section><aside class="play-side">${side}</aside></div></main>${footer()}`;
}
function optionList(options, stage) {
  return `<div class="options">${options.map((o,i) => `<button type="button" class="option" data-action="choose${stage}:${o.id}"><span class="option-key">${i+1}</span><span>${esc(o.text)}</span><span class="option-arrow" aria-hidden="true">↗</span></button>`).join('')}</div><p class="keyboard-hint">点击选项，或按键盘 1、2、3</p>`;
}
function renderFirst() {
  const s = state.scene;
  const body = `<div class="chapter"><span class="chapter-line"></span><span>第一幕 · 现场</span></div><h1>${esc(s.title)}</h1><p class="story">${esc(s.opening)}</p><div class="decision"><p class="decision-label">关键选择 01</p><h2>${esc(s.first.prompt)}</h2>${optionList(s.first.options,1)}</div>`;
  const side = `<div class="side-block"><span class="side-label">你现在知道的</span><p>${esc(s.place)}<br>${esc(s.temperature)}<br>事情仍在发展</p></div><div class="side-note"><span>练习提示</span><p>先按你真实的第一反应选。下一幕会展示这个选择带来的局势。</p></div>`;
  playShell(s,1,body,side);
}
function renderConsequence() {
  const s = state.scene, o = state.first;
  const body = `<div class="chapter"><span class="chapter-line"></span><span>后果 · 局势变化</span></div><p class="chosen-label">你选择了</p><h1 class="chosen-title">${esc(o.text)}</h1><div class="consequence-box"><span>随后发生</span><p>${esc(o.consequence)}</p></div><div class="bridge"><span>几分钟后</span><p>${esc(s.bridge)}</p></div>${button('继续到下一个决定','next','primary')}`;
  const side = `<div class="side-block"><span class="side-label">刚才的选择</span><p>${esc(o.text)}</p></div><div class="side-note"><span>留意变化</span><p>后果展示的是一种可能的演化，不是对真实案件责任的判定。</p></div>`;
  playShell(s,2,body,side);
}
function renderSecond() {
  const s = state.scene;
  const body = `<div class="chapter"><span class="chapter-line"></span><span>第二幕 · 下一步</span></div><h1>事情还没有结束。</h1><p class="story">${esc(s.bridge)}</p><div class="decision"><p class="decision-label">关键选择 02</p><h2>${esc(s.second.prompt)}</h2>${optionList(s.second.options,2)}</div>`;
  const side = `<div class="side-block"><span class="side-label">此前发生</span><p>${esc(state.first.consequence)}</p></div><button class="side-reset" data-action="rewind">↶ 回到第一个决定</button>`;
  playShell(s,2,body,side);
}
function renderEnd() {
  const s = state.scene, a = state.first, b = state.second;
  const gained = [...new Set([...a.gained,...b.gained])];
  const missed = [...new Set([...a.missed,...b.missed])].filter(x => !gained.includes(x));
  const body = `<div class="chapter"><span class="chapter-line"></span><span>本局复盘</span></div><h1>你走过的这条路</h1><div class="timeline"><div><span>01</span><strong>${esc(a.text)}</strong><p>${esc(a.consequence)}</p></div><div><span>02</span><strong>${esc(b.text)}</strong><p>${esc(b.consequence)}</p></div></div><div class="recap-grid"><div><h2>已经抓住</h2>${gained.length ? `<ul>${gained.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : '<p>这一局还没有留下足够的安全、证据或程序动作。</p>'}</div><div><h2>下一次补上</h2>${missed.length ? `<ul>${missed.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : '<p>你已经覆盖这段情境中的主要行动点。试着换一条路，看看局势如何改变。</p>'}</div></div><div class="takeaway"><span>带走一个判断</span><p>${esc(s.takeaway)}</p></div><div class="end-actions">${button('回到第一个决定','rewind','primary')}${button('选择其他情境','home','quiet')}</div>`;
  const side = `<div class="side-block action-list"><span class="side-label">遇到类似情况</span><ol>${s.actions.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><div class="source-list"><span class="side-label">核查依据</span>${sourceLinks(s)}</div><p class="source-date">依据核查：2026 年 10 月</p>`;
  playShell(s,3,body,side);
}
function render() {
  if (state.page === 'home') renderHome();
  else if (state.page === 'first') renderFirst();
  else if (state.page === 'consequence') renderConsequence();
  else if (state.page === 'second') renderSecond();
  else renderEnd();
  document.title = state.scene && state.page !== 'home' ? `${state.scene.title}｜Legal Instinct` : 'Legal Instinct｜法律直觉';
  window.scrollTo({top:0,behavior:'instant'});
}
function start(id) {
  const scene = scenes.find(x => x.id === id);
  if (!scene) return;
  state = { page:'first', scene, first:null, second:null };
  history.replaceState(null,'',`#${id}`);
  render();
}
function act(action) {
  if (action === 'home') { state = {page:'home',scene:null,first:null,second:null}; history.replaceState(null,'',location.pathname+location.search); render(); return; }
  if (action.startsWith('start:')) { start(action.slice(6)); return; }
  if (action.startsWith('choose1:') && state.page === 'first') { state.first = state.scene.first.options.find(x=>x.id===action.slice(8)); state.page='consequence'; render(); return; }
  if (action === 'next' && state.page === 'consequence') { state.page='second'; render(); return; }
  if (action.startsWith('choose2:') && state.page === 'second') { state.second = state.scene.second.options.find(x=>x.id===action.slice(8)); saveCompleted(state.scene.id); state.page='end'; render(); return; }
  if (action === 'rewind' && state.scene) { state.first=null; state.second=null; state.page='first'; render(); }
}
app.addEventListener('click', e => { const target=e.target.closest('[data-action]'); if (target) act(target.dataset.action); });
document.addEventListener('keydown', e => {
  if (!['first','second'].includes(state.page) || !/^[1-3]$/.test(e.key) || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  const options = state.page === 'first' ? state.scene.first.options : state.scene.second.options;
  const option = options[Number(e.key)-1];
  if (option) act(`choose${state.page==='first'?1:2}:${option.id}`);
});
const initial = decodeURIComponent(location.hash.slice(1));
if (scenes.some(s=>s.id===initial)) start(initial); else render();
