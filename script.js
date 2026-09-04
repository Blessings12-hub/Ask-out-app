const app = document.getElementById('app');
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
const music = document.getElementById('bg-music');

let current = 0;
const answers = {};

function goToSlide(index){
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

// --- Slide 0: start ---
document.getElementById('start-btn').addEventListener('click', () => {
  music.volume = 0.55;
  music.play().catch(() => { /* browser blocked autoplay, that's fine */ });
  goToSlide(1);
});

// --- Slides 1-3: option questions ---
document.querySelectorAll('.options').forEach(group => {
  const question = group.dataset.question;
  const nextBtn = group.parentElement.querySelector('.btn-next');

  group.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      answers[question] = btn.textContent;
      nextBtn.classList.add('enabled');
    });
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(current + 1);
  });
});

// --- Slide 4: the ask ---
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const askButtons = document.getElementById('ask-buttons');

function dodgeNo(){
  const containerRect = askButtons.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  if (!noBtn.classList.contains('dodging')){
    noBtn.classList.add('dodging');
  }

  const maxX = containerRect.width - btnRect.width;
  const maxY = containerRect.height - btnRect.height;

  const newX = Math.max(0, Math.random() * maxX);
  const newY = (Math.random() - 0.5) * 40; // slight vertical wobble, clamped below

  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${Math.max(0, Math.min(maxY, maxY / 2 + newY))}px`;
}

['mouseenter', 'touchstart', 'pointerdown', 'focus'].forEach(evt => {
  noBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    dodgeNo();
  });
});

yesBtn.addEventListener('click', () => {
  music.volume = 0.55;
  showCelebration();
});

function showCelebration(){
  const el = document.getElementById('celebration');
  const summary = document.getElementById('summary');

  const parts = [];
  if (answers.activity) parts.push(answers.activity.toLowerCase());
  if (answers.setting) parts.push(answers.setting.toLowerCase());
  if (answers.time) parts.push(answers.time.toLowerCase());

  summary.textContent = parts.length
    ? `Noted: ${parts.join(', ')}. I'll take it from here.`
    : `I'll take it from here.`;

  launchConfetti();
  el.classList.add('show');
}

function launchConfetti(){
  const layer = document.getElementById('confetti-layer');
  const colors = ['#D4A24C', '#F3E3DC', '#C97B84', '#8A2846'];

  for (let i = 0; i < 60; i++){
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
    piece.style.animationDelay = `${Math.random() * 1.2}s`;
    layer.appendChild(piece);
  }
}
