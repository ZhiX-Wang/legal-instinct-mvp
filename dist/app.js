const scenes = window.LEGAL_SCENES;
scenes.forEach(scene => Object.assign(scene, window.LEGAL_EXTENSIONS[scene.id]));
const app = document.getElementById('app');
const STORE_KEY = 'legal-instinct-finished-v1';
let completed = loadCompleted();
let state = { page: 'home', scene: null, step: 1, choices: [] };

function loadCompleted() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
}
function saveCompleted(id) {
  if (!completed.includes(id)) completed.push(id);
  try { localStorage.setItem(STORE_KEY, JSON.stringify(completed)); } catch {}
}
function visual(scene, panel, className, label, sheet = 1) {
  const x = panel % 3 * 50, y = Math.floor(panel / 3) * 50;
  const aria = /^(option|row|timeline)-photo$/.test(className) ? 'aria-hidden="true"' : `role="img" aria-label="${esc(label)}"`;
  return `<span class="photo ${className}" ${aria} style="background-image:url('./assets/${esc(scene.id)}-sheet${sheet === 2 ? '-2' : ''}.png');background-position:${x}% ${y}%"></span>`;
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
  return `<footer class="site-footer"><span>Legal Instinct · 法律直觉</span><p>图片为生成的情境示意。情境以中国大陆现行规则为基础；头盔案例适用浙江省。真实处理时请核对事实、所在地规定和收到的正式文书。</p></footer>`;
}
function renderHome() {
  const featured = scenes[0];
  app.innerHTML = `${header()}<main id="main" class="home-page">
    <section class="hero"><div class="hero-copy"><p class="section-id"><span class="live-dot"></span> 第一辑现已开放</p><h1>在现实发生之前，<br><em>练习你的选择。</em></h1><p class="hero-intro">法律问题到来时，你通常没有时间先读完一篇文章。进入一个真实的瞬间，做出选择，看见后果，再回到关键节点重选。</p><div class="hero-actions">${button('开始第一个情境', 'start:restaurant', 'primary')}<span>每个情境约 5 分钟 · 无需登录</span></div><div class="hero-rule"><span>01 做选择</span><span>02 看后果</span><span>03 带走行动方法</span></div></div>
    <div class="hero-scene" role="group" aria-label="推荐情境"><div class="scene-top"><span>情境档案 ${featured.number}</span><span class="pulse-label">现场进行中</span></div><div class="scene-visual">${visual(featured,0,'hero-photo',featured.title+'的现场画面')}<span class="scene-time">21:30</span></div><div class="scene-bottom"><p>餐厅 · 一次冲突</p><h2>${esc(featured.title)}</h2><span>第一反应，会改变之后能看见的证据。</span></div></div></section>
    <section class="catalog" aria-labelledby="catalog-title"><div class="catalog-heading"><div><p class="section-id">情境目录 / 001—005</p><h2 id="catalog-title">从哪一刻开始？</h2></div><p>先从与你最近的处境进入。每一局都能重来，重新试另一条路。</p></div><div class="scene-list">${scenes.map(scene => `<button type="button" class="scene-row" data-action="start:${scene.id}"><span class="row-number">${scene.number}</span>${visual(scene,0,'row-photo',scene.title+'的现场画面')}<span class="row-main"><strong>${esc(scene.title)}</strong><small>${esc(scene.category)} · ${esc(scene.place)}</small></span><span class="row-meta">${completed.includes(scene.id) ? '已体验 · 可重选' : scene.time}</span><span class="row-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></section>
    <section class="how-it-works"><div class="how-quote">“如果当时我换一个选择，<br>结果会怎样？”</div><div class="how-content"><h2>练的是判断，不是背答案。</h2><p>每个情境有四次决定，从现场走到事情真正办完。你会看到每一步改变了什么，以及本局最后的赔偿、罚款或结算结果。金额和处理过程基于写明的虚构事实，供你练习核对证据与程序。</p><div class="how-columns"><div><strong>当下</strong><span>先看安全、时间和信息缺口</span></div><div><strong>事后</strong><span>核对权利、证据和程序</span></div></div></div></section>
  </main>${footer()}`;
}
const stageKeys = ['first', 'second', 'third', 'fourth'];
const chapterNames = ['第一幕 · 现场', '第二幕 · 下一步', '第三幕 · 证据与核对', '第四幕 · 结果前的选择'];
const stageBridges = [null, 'bridge', 'bridge2', 'bridge3'];
const laterPhotoPanels = {
  restaurant: {3:[1,0,3],4:[6,4,6],end:6},
  helmet: {3:[0,2,1],4:[3,4,5],end:6},
  deposit: {3:[2,1,0],4:[3,4,3],end:7},
  resignation: {3:[0,1,2],4:[5,4,5],end:6},
  fakepolice: {3:[2,1,0],4:[3,4,6],end:8}
};
function stagePhoto(scene, step, option, className) {
  const index = scene[stageKeys[step - 1]].options.indexOf(option);
  const panel = step < 3 ? (step === 1 ? 1 : 4) + index : laterPhotoPanels[scene.id][step][index];
  return visual(scene, panel, className, option.text + '的写实画面', step < 3 ? 1 : 2);
}
function progress(scene, step) {
  const n = Math.min(step, 5);
  return `<div class="play-progress"><span>情境 ${scene.number} / ${esc(scene.category)}</span><div class="progress-track" aria-label="进度 ${n} / 5"><i style="width:${n * 20}%"></i></div><span>${n} / 5</span></div>`;
}
function playShell(scene, step, body, side) {
  app.innerHTML = `${header()}<main id="main" class="play-page"><div class="play-top"><button class="text-back" data-action="home">← 返回情境目录</button><span>${esc(scene.time)} · ${esc(scene.place)}</span></div>${progress(scene,step)}<div class="play-grid"><section class="play-main" aria-live="polite">${body}</section><aside class="play-side">${side}</aside></div></main>${footer()}`;
}
function optionList(scene, step) {
  const options = scene[stageKeys[step - 1]].options;
  return `<div class="options">${options.map((o,i) => `<button type="button" class="option" data-action="choose:${o.id}">${stagePhoto(scene,step,o,'option-photo')}<span class="option-key">${i+1}</span><span>${esc(o.text)}</span><span class="option-arrow" aria-hidden="true">↗</span></button>`).join('')}</div><p class="keyboard-hint">点击选项，或按键盘 1、2、3</p>`;
}
function renderDecision() {
  const s = state.scene, step = state.step, stage = s[stageKeys[step - 1]];
  const intro = step === 1
    ? `<div class="intro-grid"><div><div class="chapter"><span class="chapter-line"></span><span>${chapterNames[0]}</span></div><h1>${esc(s.title)}</h1><p class="story">${esc(s.opening)}</p></div>${visual(s,0,'intro-photo',s.title+'的现场画面')}</div>`
    : `<div class="chapter"><span class="chapter-line"></span><span>${chapterNames[step - 1]}</span></div><h1>${step === 4 ? '事情来到最后一步。' : '事情还没有结束。'}</h1><p class="story">${esc(s[stageBridges[step - 1]])}</p>`;
  const body = `${intro}<div class="decision"><p class="decision-label">关键选择 ${String(step).padStart(2,'0')}</p><h2>${esc(stage.prompt)}</h2>${optionList(s,step)}</div>`;
  const previous = state.choices[step - 2];
  const side = step === 1
    ? `<div class="side-block"><span class="side-label">你现在知道的</span><p>${esc(s.place)}<br>${esc(s.temperature)}<br>事情仍在发展</p></div><div class="side-note"><span>练习提示</span><p>先按你真实的第一反应选。后面的发展会逐步补全事实。</p></div>`
    : `<div class="side-block"><span class="side-label">此前发生</span><p>${esc(previous.consequence)}</p></div><button class="side-reset" data-action="rewind">↶ 回到第一个决定</button>`;
  playShell(s,step,body,side);
}
function renderConsequence() {
  const s=state.scene, step=state.step, o=state.choices[step-1];
  const bridge=s[stageBridges[step]];
  const body=`<div class="chapter"><span class="chapter-line"></span><span>第 ${step} 次选择 · 局势变化</span></div><p class="chosen-label">你选择了</p><h1 class="chosen-title">${esc(o.text)}</h1>${stagePhoto(s,step,o,'result-photo')}<div class="consequence-box"><span>随后发生</span><p>${esc(o.consequence)}</p></div><div class="bridge"><span>${step === 1 ? '几分钟后' : step === 2 ? '第二天' : '随后'}</span><p>${esc(bridge)}</p></div>${button('继续到第 '+(step+1)+' 次决定','next','primary')}`;
  const side=`<div class="side-block"><span class="side-label">刚才的选择</span><p>${esc(o.text)}</p></div><div class="side-note"><span>留意变化</span><p>这一局展示的是基于特定事实的故事演化。下一步要处理的事实已经发生。</p></div>`;
  playShell(s,step,body,side);
}
function endingKey(scene, choices) {
  const last=choices[3].id;
  if(scene.id==='restaurant') {
    if(last==='offer') return 'low';
    const firstScore={distance:2,hit:0,film:1}[choices[0].id];
    const secondScore={record:2,leave:1,post:0}[choices[1].id];
    return firstScore+secondScore+choices[2].weight+choices[3].weight>=6?'high':'mid';
  }
  if(scene.id==='deposit') return last==='compromise'?'low':last==='mediation'?'mid':'high';
  if(scene.id==='resignation') return last==='mediate'?'mid':last==='signlater'?'low':'high';
  if(scene.id==='helmet') return last==='review'?'mid':last==='confirm'?'low':'high';
  return last==='secure'?'mid':last==='block'?'low':'high';
}
function renderEnd() {
  const s=state.scene, choices=state.choices, end=s.endings[endingKey(s,choices)];
  const gained=[...new Set(choices.flatMap(o=>o.gained))];
  const missed=[...new Set(choices.flatMap(o=>o.missed))].filter(x=>!gained.includes(x));
  const body=`<div class="chapter"><span class="chapter-line"></span><span>本局结案</span></div><h1>事情最后怎样了？</h1><div class="outcome-card">${visual(s,laterPhotoPanels[s.id].end,'outcome-photo',s.title+'的结果画面',2)}<div><span class="outcome-kicker">本局模拟结果</span><h2>${esc(end.headline)}</h2><p>${esc(end.detail)}</p></div></div><div class="case-facts"><strong>本局事实</strong><p>${esc(s.facts)}</p></div><div class="case-official"><strong>处理结果</strong><p>${esc(s.official)}</p></div><h2 class="route-title">你的四次选择</h2><div class="timeline">${choices.map((o,i)=>`<div>${stagePhoto(s,i+1,o,'timeline-photo')}<span>${String(i+1).padStart(2,'0')}</span><strong>${esc(o.text)}</strong><p>${esc(o.consequence)}</p></div>`).join('')}</div><div class="recap-grid"><div><h2>已经抓住</h2>${gained.length?`<ul>${gained.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>这一局还没有留下足够的证据或程序动作。</p>'}</div><div><h2>下次留意</h2>${missed.length?`<ul>${missed.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>主要行动点都已覆盖。重玩可以观察另一种选择带来的结局。</p>'}</div></div><div class="takeaway"><span>带走一个判断</span><p>${esc(s.takeaway)}</p></div><div class="end-actions">${button('重玩这个情境','rewind','primary')}${button('选择其他情境','home','quiet')}</div>`;
  const side=`<div class="side-block action-list"><span class="side-label">遇到类似情况</span><ol>${s.actions.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><div class="source-list"><span class="side-label">核查依据</span>${sourceLinks(s)}</div><p class="source-date">依据核查：2026 年 10 月</p>`;
  playShell(s,5,body,side);
}
function render() {
  if(state.page==='home') renderHome();
  else if(state.page==='decision') renderDecision();
  else if(state.page==='consequence') renderConsequence();
  else renderEnd();
  document.title=state.scene&&state.page!=='home'?`${state.scene.title}｜Legal Instinct`:'Legal Instinct｜法律直觉';
  window.scrollTo({top:0,behavior:'instant'});
}
function start(id) {
  const scene=scenes.find(x=>x.id===id);
  if(!scene) return;
  state={page:'decision',scene,step:1,choices:[]};
  history.replaceState(null,'',`#${id}`);
  render();
}
function act(action) {
  if(action==='home'){state={page:'home',scene:null,step:1,choices:[]};history.replaceState(null,'',location.pathname+location.search);render();return;}
  if(action.startsWith('start:')){start(action.slice(6));return;}
  if(action==='rewind'&&state.scene){state.step=1;state.choices=[];state.page='decision';render();return;}
  if(action.startsWith('choose:')&&state.page==='decision'){
    const option=state.scene[stageKeys[state.step-1]].options.find(x=>x.id===action.slice(7));
    if(!option) return;
    state.choices[state.step-1]=option;
    if(state.step===4){saveCompleted(state.scene.id);state.page='end';}else state.page='consequence';
    render();return;
  }
  if(action==='next'&&state.page==='consequence'){state.step++;state.page='decision';render();}
}
app.addEventListener('click',e=>{const target=e.target.closest('[data-action]');if(target) act(target.dataset.action);});
document.addEventListener('keydown',e=>{
  if(state.page!=='decision'||!/^[1-3]$/.test(e.key)||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  const option=state.scene[stageKeys[state.step-1]].options[Number(e.key)-1];
  if(option) act(`choose:${option.id}`);
});
const initial=decodeURIComponent(location.hash.slice(1));
if(scenes.some(s=>s.id===initial)) start(initial); else render();
