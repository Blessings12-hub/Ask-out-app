# A Question For You

A 10-slide site to ask someone out — her photos in the background, a
handful of playful "love bomb" and teasing slides, three "what should we
do" questions, background music, and a final Yes/No slide where No runs
away every time it's touched.

No build tools, no dependencies. Just HTML, CSS, and JS.

## The slides

1. **Intro** — the setup
2. **Fair warning** — a joke disclaimer about what's coming
3. **Secret reveal** — a tap-to-flip card with a confession
4. **Pop quiz** — a silly, all-flattering multiple choice question
5. **Would you rather** — a teasing hypothetical, no wrong answers
6. **Activity** — what she'd actually want to do
7. **Setting** — the vibe she's picking
8. **Time of day** — morning through late night
9. **Guess the number** — a tap-to-flip card with a comedic counting
   animation, one last tease before the ask
10. **The ask** — Yes / No, where No dodges around the screen with
    teasing captions, then confetti + a "she said yes" screen with a
    punchline

There's also an ambient sparkle field and a small cursor/touch sparkle
trail throughout (skipped automatically if the person has reduced-motion
turned on).

## What's in here

```
.
├── index.html      the 10 slides
├── style.css        colors, type, layout, effects
├── script.js        slide logic, dodging No button, confetti, sparkles, music
├── vercel.json       clean URLs + caching for Vercel
├── images/           her 5 photos (photo1.jpg–photo5.jpg)
└── music/            background music setup — see music/README.md
```

Photos are already in `images/`, cleaned up and renamed. Music currently
streams from Spotify via an embedded widget — see `music/README.md` for
how to swap the track, or switch to a local file you own instead.

## Try it locally

Just open `index.html` in a browser — no server needed.

## Deploy on Vercel

**Fastest — Vercel CLI, no GitHub needed:**
```bash
npm i -g vercel
cd this-folder
vercel --prod
```
When it asks about a framework, choose **Other** and leave the build
command blank — this is a static site, nothing to build.

**Or — import from GitHub:**
1. Push this folder to a GitHub repo (see below).
2. Go to vercel.com → **Add New → Project** → import that repo.
3. Framework preset: **Other**. Leave build command / output directory
   blank. Click **Deploy**.
4. You'll get a live `https://your-project.vercel.app` link to send her.

Either way, redeploying after you swap a photo or the Spotify track is
just `vercel --prod` again, or a new push if you're using GitHub.

## Push to GitHub (optional, if you want it there too)

**No terminal needed:** create a new repo on github.com or in the GitHub
app, then use "Add file → Upload files" to upload everything in this
folder, keeping the `images/` and `music/` subfolders intact.

**With git:**
```bash
git init
git add .
git commit -m "Ask her out"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ask-her-out.git
git push -u origin main
```

## Customizing

- **Wording** — open `index.html` and edit the headlines, questions, and
  answer options.
- **The date** — search `index.html` for "September 10th, 2026" if it
  ever needs to change.
- **The punchline** — search `index.html` for `id="punchline"` to edit or
  remove the joke line on the final screen.
- **Colors** — the palette lives at the top of `style.css` as CSS
  variables (`--plum`, `--gold`, etc.).
