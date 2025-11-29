// Playful interactions: mood check, save note, breathing guide, resources modal, theme toggle

const moodRange = document.getElementById('moodRange');
const moodEmoji = document.getElementById('moodEmoji');
const moodMessage = document.getElementById('moodMessage');
const journalInput = document.getElementById('journalInput');
const saveBtn = document.getElementById('saveBtn');
const savedNote = document.getElementById('savedNote');

const startBreath = document.getElementById('startBreath');
const stopBreath = document.getElementById('stopBreath');
const breathCircle = document.getElementById('breathCircle');
const breathHint = document.getElementById('breathHint');

const resourcesBtn = document.getElementById('resourcesBtn');
const resourcesModal = document.getElementById('resourcesModal');
const closeModal = document.getElementById('closeModal');

const toggleTheme = document.getElementById('toggleTheme');

// Mood UI
function updateMoodUI(val){
  const n = Number(val);
  let emoji = '😐';
  let msg = "Thanks for checking in — it's okay to feel whatever you feel.";
  if(n <= 20){ emoji='😞'; msg="That sounds rough. Small steps matter — you don't have to fix everything at once."; }
  else if(n <= 45){ emoji='😕'; msg="Not great — be kind to yourself. A short walk or a breath can help."; }
  else if(n <= 65){ emoji='😌'; msg="A steady moment. Keep doing things that feel gentle."; }
  else if(n <= 85){ emoji='🙂'; msg="Pretty good — maybe share a smile or a note of gratitude."; }
  else { emoji='😄'; msg="Feeling great — celebrate the small wins!"; }

  moodEmoji.textContent = emoji;
  moodMessage.textContent = msg;
}

moodRange.addEventListener('input', (e)=> updateMoodUI(e.target.value));
updateMoodUI(moodRange.value);

// Save short journal note locally
saveBtn.addEventListener('click', ()=>{
  const text = journalInput.value.trim();
  const mood = moodRange.value;
  const entry = { text, mood: Number(mood), time: new Date().toISOString() };
  try{
    const items = JSON.parse(localStorage.getItem('mindgarden-journal') || '[]');
    items.unshift(entry);
    localStorage.setItem('mindgarden-journal', JSON.stringify(items.slice(0,50)));
    savedNote.textContent = 'Saved locally — it stays in your browser.';
    journalInput.value = '';
    setTimeout(()=> savedNote.textContent = '', 3500);
  }catch(err){
    savedNote.textContent = 'Could not save (browser storage blocked).';
  }
});

// Breathing exercise: simple 4-4-4 cycles
let breathInterval = null;
function startBreathing(){
  if(breathInterval) return;
  breathHint.textContent = 'Breathe with the circle: 4 in, 4 hold, 4 out';
  let phase = 0;
  breathCircle.classList.remove('expand','shrink');
  breathCircle.classList.add('expand');
  breathInterval = setInterval(()=>{
    phase = (phase + 1) % 3; // 0 expand,1 hold,2 shrink
    if(phase === 0){ breathCircle.classList.add('expand'); breathCircle.classList.remove('shrink'); breathHint.textContent = 'Breathe in (4)'; }
    else if(phase === 1){ breathCircle.classList.remove('expand','shrink'); breathHint.textContent = 'Hold (4)'; }
    else { breathCircle.classList.add('shrink'); breathCircle.classList.remove('expand'); breathHint.textContent = 'Breathe out (4)'; }
  }, 4000);
}

function stopBreathing(){
  clearInterval(breathInterval); breathInterval = null;
  breathCircle.classList.remove('expand','shrink'); breathHint.textContent = 'Ready?';
}

startBreath.addEventListener('click', startBreathing);
stopBreath.addEventListener('click', stopBreathing);

// Resources modal
function showModal(){
  resourcesModal.setAttribute('aria-hidden','false');
  resourcesModal.style.display = 'flex';
  closeModal.focus();
}
function hideModal(){
  resourcesModal.setAttribute('aria-hidden','true');
  resourcesModal.style.display = 'none';
}

resourcesBtn.addEventListener('click', showModal);
closeModal.addEventListener('click', hideModal);
resourcesModal.addEventListener('click', (e)=>{
  if(e.target === resourcesModal) hideModal();
});

// Theme toggle: toggles dark on <html> and updates button label
function setThemeDark(isDark){
  const html = document.documentElement;
  if(isDark) html.classList.add('dark');
  else html.classList.remove('dark');
  // Update button label for clarity
  toggleTheme.textContent = isDark ? 'Light theme' : 'Dark theme';
}

toggleTheme.addEventListener('click', ()=>{
  const html = document.documentElement;
  const nowDark = !html.classList.contains('dark');
  setThemeDark(nowDark);
});

// Initialize theme button based on document state
(function initThemeButton(){
  const isDark = document.documentElement.classList.contains('dark');
  toggleTheme.textContent = isDark ? 'Light theme' : 'Dark theme';
})();

// Accessibility: keyboard close modal on Escape
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    if(resourcesModal.getAttribute('aria-hidden') === 'false') hideModal();
  }
});

// Load previous mood/note preview
(function loadPreview(){
  try{
    const items = JSON.parse(localStorage.getItem('mindgarden-journal') || '[]');
    if(items && items.length){
      const latest = items[0];
      savedNote.textContent = `Last saved: ${new Date(latest.time).toLocaleString()}`;
    }
  }catch(e){}
})();