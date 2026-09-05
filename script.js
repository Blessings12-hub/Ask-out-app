const app = document.getElementById('app');
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.dot'));

let current = 0;
const answers = {};

function goToSlide(index){
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

// --- Music: Spotify widget starts open, then tucks into a small note icon
// after a few seconds so it doesn't compete with the photos. Tap it anytime
// to bring the player back.
const musicChip = document.getElementById('music-chip');
if (musicChip){
  const collapseTimer = setTimeout(() => musicChip.classList.add('is-collapsed'), 6000);
  musicChip.addEventListener('click', () => {
    if (musicChip.classList.contains('is-collapsed')){
      clearTimeout(collapseTimer);
      musicChip.classList.remove('is-collapsed');
    }
  });
}

// --- Slide 0: start ---
document.getElementById('start-btn').addEventListener('click', () => {
  goToSlide(1);
});

// --- Generic "just continue" buttons (the love-bomb slides) ---
document.querySelectorAll('.btn-continue').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    goToSlide(current + 1);
  });
});

// --- Slide 2: the secret flip card ---
const flipCard = document.getElementById('flip-card');
const flipContinue = document.getElementById('flip-continue');
if (flipCard && flipContinue){
  function revealCard(){
    flipCard.classList.add('flipped');
    flipContinue.disabled = false;
    flipContinue.classList.add('enabled');
  }
  flipCard.addEventListener('click', revealCard);
  flipCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); revealCard(); }
  });
}

// --- Back buttons (slides 1-4) ---
document.querySelectorAll('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => {
    if (current > 0) goToSlide(current - 1);
  });
});

// --- Slides with option questions (real ones + the just-for-fun quiz) ---
const quizReactions = {
  'Effortlessly stunning': "correct. that one wasn't even a trick question.",
  'Dangerously charming': 'also correct. this quiz has no wrong answers, only right ones.',
  'All of the above, obviously': 'the confidence. I respect it.',
  "I refuse to pick just one": 'honestly the most accurate answer available.',
};
const quizReactionEl = document.getElementById('quiz-reaction');

document.querySelectorAll('.options').forEach(group => {
  const question = group.dataset.question;
  const nextBtn = group.parentElement.querySelector('.btn-next');

  group.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      answers[question] = btn.textContent;
      nextBtn.classList.add('enabled');
      nextBtn.disabled = false;

      if (question === 'vibe' && quizReactionEl){
        quizReactionEl.textContent = quizReactions[btn.textContent] || 'noted.';
        quizReactionEl.classList.remove('is-visible');
        void quizReactionEl.offsetWidth;
        quizReactionEl.classList.add('is-visible');
      }
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

const teaserPhrases = [
  'are you sure?',
  'think about it...',
  'wrong button 😏',
  'really though?',
  'one more try',
  "it's not going anywhere",
];
let dodgeCount = 0;
const teaserEl = document.getElementById('teaser-text');

function showTeaser(){
  if (!teaserEl) return;
  teaserEl.textContent = teaserPhrases[dodgeCount % teaserPhrases.length];
  teaserEl.classList.remove('is-visible');
  void teaserEl.offsetWidth; // restart the pop animation even on a repeat phrase
  teaserEl.classList.add('is-visible');
}

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

  dodgeCount++;
  showTeaser();
}

// pointerdown alone covers mouse clicks and touch taps — pairing it with
// touchstart made touch devices fire dodgeNo() twice per tap (a jarring
// double-jump), so touchstart is dropped here.
['mouseenter', 'pointerdown', 'focus'].forEach(evt => {
  noBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    dodgeNo();
  });
});

yesBtn.addEventListener('click', () => {
  showCelebration();
});

function showCelebration(){
  const el = document.getElementById('celebration');
  const summary = document.getElementById('summary');
  const punchline = document.getElementById('punchline');

  const parts = [];
  if (answers.activity) parts.push(answers.activity.toLowerCase());
  if (answers.setting) parts.push(answers.setting.toLowerCase());
  if (answers.time) parts.push(answers.time.toLowerCase());

  summary.textContent = parts.length
    ? `Noted: ${parts.join(', ')}. I'll take it from here.`
    : `I'll take it from here.`;

  launchConfetti();
  el.classList.add('show');

  // let the sincere line land first, then the punchline for comedic timing
  if (punchline){
    setTimeout(() => punchline.classList.add('is-visible'), 1600);
  }
}

// --- Magical touches: ambient twinkle field + a sparkle trail on touch/cursor ---
// Both fully skip their animation loops if the person has reduced-motion set.
(function magic(){
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('sparkle-canvas');
  if (canvas){
    const ctx = canvas.getContext('2d');
    let w, h, dots = [];

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.round((w * h) / 22000);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0015 + 0.0006,
      }));
    }
    resize();
    window.addEventListener('resize', resize);

    function drawStatic(){
      ctx.clearRect(0, 0, w, h);
      dots.forEach(d => {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#F3E3DC';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (prefersReducedMotion){
      drawStatic();
    } else {
      let t = 0;
      function tick(){
        t++;
        ctx.clearRect(0, 0, w, h);
        dots.forEach(d => {
          const twinkle = 0.25 + Math.abs(Math.sin(t * d.speed + d.phase)) * 0.55;
          ctx.globalAlpha = twinkle;
          ctx.fillStyle = '#F3E3DC';
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
        });
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }

  if (prefersReducedMotion) return;

  // sparkle trail on pointer/touch movement, throttled and capped
  let lastSpark = 0;
  function spawnSparkle(x, y){
    const now = performance.now();
    if (now - lastSpark < 60) return;
    lastSpark = now;

    const el = document.createElement('span');
    el.className = 'cursor-sparkle';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }

  window.addEventListener('pointermove', (e) => spawnSparkle(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (t) spawnSparkle(t.clientX, t.clientY);
  }, { passive: true });
})();

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

  // clean up after the animation finishes so the DOM doesn't just grow
  setTimeout(() => { layer.innerHTML = ''; }, 6500);
}
