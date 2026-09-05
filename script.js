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

// --- Music: Spotify's official iFrame API (not the static ?autoplay=1 URL
// trick, which Spotify's own community forums report as unreliable). This
// creates a real embed controller we can call .play() on directly the
// moment she taps anything — the same "real gesture triggers it" approach
// used everywhere else, just through Spotify's API instead of <audio>.
const musicChip = document.getElementById('music-chip');
let spotifyController = null;

if (musicChip){
  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById('spotify-embed');
    const options = {
      uri: 'spotify:track:43PuMrRfbyyuz4QpZ3oAwN',
      width: '100%',
      height: '80',
      theme: 'dark',
    };
    IFrameAPI.createController(element, options, (EmbedController) => {
      spotifyController = EmbedController;
    });
  };

  const startEvents = ['pointerdown', 'touchstart', 'keydown'];
  function startMusicOnFirstTouch(){
    if (spotifyController) spotifyController.play();
    startEvents.forEach(evt => document.removeEventListener(evt, startMusicOnFirstTouch));
  }
  startEvents.forEach(evt => document.addEventListener(evt, startMusicOnFirstTouch, { once: true, passive: true }));

  // tucks into a small note icon after a few seconds so it doesn't compete
  // with the photos; tap it anytime to bring the player back, or to
  // pause/resume once it's expanded.
  const collapseTimer = setTimeout(() => musicChip.classList.add('is-collapsed'), 6000);
  musicChip.addEventListener('click', () => {
    if (musicChip.classList.contains('is-collapsed')){
      clearTimeout(collapseTimer);
      musicChip.classList.remove('is-collapsed');
      if (spotifyController) spotifyController.play();
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

// --- Flip cards (the secret confession + the guess-the-number tease) ---
document.querySelectorAll('.flip-card').forEach(card => {
  const wrap = card.closest('.content');
  const continueBtn = wrap ? wrap.querySelector('.btn-continue') : null;
  const counterEl = card.querySelector('.counter');

  function reveal(){
    if (card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    if (continueBtn){
      continueBtn.disabled = false;
      continueBtn.classList.add('enabled');
    }
    if (counterEl) animateCounter(counterEl);
  }

  card.addEventListener('click', reveal);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); reveal(); }
  });
});

function animateCounter(el){
  const target = parseInt(el.dataset.target, 10) || 1000;
  const duration = 1400;
  const start = performance.now();

  function step(now){
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out, so it slows into the final number
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

// --- Back buttons (slides 1-4) ---
document.querySelectorAll('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => {
    if (current > 0) goToSlide(current - 1);
  });
});

// --- Slides with option questions (real ones + the just-for-fun ones) ---
const funReactions = {
  vibe: {
    'Effortlessly stunning': "correct. that one wasn't even a trick question.",
    'Dangerously charming': 'also correct. this quiz has no wrong answers, only right ones.',
    'All of the above, obviously': 'the confidence. I respect it.',
    "I refuse to pick just one": 'honestly the most accurate answer available.',
  },
  tease: {
    'Hold hands in public': 'bold. I like it.',
    'Steal fries off my plate': "fair warning: I will notice, and I will not stop you.",
    'Send 3am "you up?" texts': 'already saved your contact for this exact purpose.',
    'All three, no shame': "we're going to get along extremely well.",
  },
};
const reactionElByQuestion = {
  vibe: document.getElementById('quiz-reaction'),
  tease: document.getElementById('tease-reaction'),
};

document.querySelectorAll('.options').forEach(group => {
  const question = group.dataset.question;
  const nextBtn = group.parentElement.querySelector('.btn-next');
  const reactionEl = reactionElByQuestion[question];
  const reactions = funReactions[question];

  group.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      answers[question] = btn.textContent;
      nextBtn.classList.add('enabled');
      nextBtn.disabled = false;

      if (reactions && reactionEl){
        reactionEl.textContent = reactions[btn.textContent] || 'noted.';
        reactionEl.classList.remove('is-visible');
        void reactionEl.offsetWidth;
        reactionEl.classList.add('is-visible');
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
  'nope, try again',
  "you're just tiring yourself out",
  'last chance to say yes',
  "I'll just wait here",
  'okay now you\'re just exercising',
  'be honest, you enjoy this',
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
