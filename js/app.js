(() => {
  'use strict';
  const steps = [...document.querySelectorAll('.lesson-step')];
  const links = [...document.querySelectorAll('.step-link')];
  const previous = document.getElementById('previousButton');
  const next = document.getElementById('nextButton');
  const label = document.getElementById('progressLabel');
  const bar = document.getElementById('progressbar');
  const fill = document.getElementById('progressFill');
  const footerStep = document.getElementById('footerStep');
  const completionMessage = document.getElementById('completionMessage');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  const menuToggle = document.getElementById('menuToggle');
  const themeToggle = document.getElementById('themeToggle');
  let current = 0;
  const KEY = 'sict235-codelab01-orientation-v2';
  function readLocal(key) {try {return localStorage.getItem(key);} catch (_) {return null;}}
  function saveLocal(key, value) {try {localStorage.setItem(key, value);} catch (_) { /* local file or privacy mode */ }}
  let completed = new Set();
  try {const stored = JSON.parse(readLocal(KEY) || '[]'); if (Array.isArray(stored)) completed = new Set(stored.filter(x => Number.isInteger(x) && x >= 0 && x < steps.length));} catch (_) {}
  function closeSidebar() {sidebar.classList.remove('open'); scrim.hidden = true; menuToggle.setAttribute('aria-expanded', 'false');}
  function navigate(step) {
    current = Math.max(0, Math.min(steps.length - 1, step));
    steps.forEach((panel, i) => {panel.hidden = i !== current; panel.classList.toggle('is-active', i === current);});
    links.forEach((link, i) => {link.classList.toggle('active', i === current); if(i === current) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');});
    previous.disabled = current === 0;
    next.textContent = current === steps.length - 1 ? (completed.has(current) ? 'Session completed ✓' : 'Finish orientation ✓') : 'Mark complete & continue →';
    footerStep.textContent = `Section ${current+1} of ${steps.length}`;
    completionMessage.hidden = completed.size !== steps.length || current !== steps.length - 1;
    closeSidebar();
    window.scrollTo({top:0, behavior:'instant'});
  }
  function updateProgress() {
    const fraction = Math.round(100 * completed.size / steps.length);
    label.textContent = `${completed.size} of ${steps.length}`;
    bar.setAttribute('aria-valuenow', String(fraction));
    fill.style.width = `${fraction}%`;
    links.forEach((link, i) => link.classList.toggle('completed', completed.has(i)));
    saveLocal(KEY, JSON.stringify([...completed].sort()));
    completionMessage.hidden = completed.size !== steps.length || current !== steps.length - 1;
  }
  links.forEach((link, i) => link.addEventListener('click', () => navigate(i)));
  document.getElementById('meetDashJump')?.addEventListener('click', () => { navigate(2); document.getElementById('dash-profile')?.scrollIntoView({block:'start',behavior:'instant'}); });
  previous.addEventListener('click', () => navigate(current - 1));
  next.addEventListener('click', () => {
    completed.add(current); updateProgress();
    if(current < steps.length - 1) navigate(current + 1); else navigate(current);
  });
  document.getElementById('resetProgress').addEventListener('click', () => {completed.clear(); updateProgress(); navigate(0);});
  menuToggle.addEventListener('click', () => {const open = !sidebar.classList.contains('open'); sidebar.classList.toggle('open', open); scrim.hidden = !open; menuToggle.setAttribute('aria-expanded', String(open));});
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
  scrim.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => {if(e.key === 'Escape') closeSidebar();});
  const savedTheme = readLocal(`${KEY}-theme`);
  if(savedTheme === 'dark') document.body.dataset.theme = 'dark';
  function updateThemeIcon() {const dark = document.body.dataset.theme === 'dark'; document.getElementById('themeIcon').textContent = dark ? '☀' : '☾'; themeToggle.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');}
  themeToggle.addEventListener('click',() => {const dark = document.body.dataset.theme === 'dark'; document.body.dataset.theme = dark ? 'light' : 'dark'; saveLocal(`${KEY}-theme`, document.body.dataset.theme); updateThemeIcon();});
  updateThemeIcon();
  const descriptions = {
    material: ['Whole app', 'The complete interface is built by arranging smaller parts inside a screen.', 'the complete interface'],
    appbar: ['Top bar', 'The bar at the top can show a page title and important actions.', 'the top bar'],
    text: ['Text', 'A text element communicates a message or instruction.', 'the greeting text'],
    button: ['Button', 'A button invites the user to perform an action, such as opening another screen.', 'the action button']
  };
  document.querySelectorAll('.widget-choice').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.widget-choice').forEach(b => {b.classList.remove('selected');b.setAttribute('aria-pressed', 'false');});
    btn.classList.add('selected');btn.setAttribute('aria-pressed','true');
    const chosen = btn.dataset.widget;
    const [title, text, hint] = descriptions[chosen];
    document.getElementById('widgetInfo').innerHTML = `<strong>${title}</strong><p>${text}</p>`;
    document.getElementById('deviceFrame').dataset.selected = chosen;
    document.getElementById('widgetHint').textContent = `Selected: ${hint}`;
  }));
  document.querySelectorAll('.concept-check').forEach(check => {
    const feedback = check.querySelector('.answer-feedback');
    check.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => {
      const correct = button.dataset.correct === 'true';
      check.querySelectorAll('.answer').forEach(b => {b.classList.remove('is-right','is-wrong');b.setAttribute('aria-pressed','false');});
      button.classList.add(correct ? 'is-right' : 'is-wrong');
      button.setAttribute('aria-pressed','true');
      feedback.textContent = correct ? 'Correct — that is the key idea.' : 'Not quite. Think about the relationship described in the lesson and try again.';
      feedback.className = `answer-feedback ${correct ? 'correct' : 'incorrect'}`;
    }));
  });
  document.getElementById('simulateChange').addEventListener('click',() => {
    const node = document.getElementById('colorDemo');
    const alternative = node.classList.toggle('color-alt');
    node.textContent = alternative ? 'Get started' : 'Continue';
  });
  updateProgress();navigate(0);
})();
