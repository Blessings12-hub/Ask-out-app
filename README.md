# Will You Be My Date?

A tiny 5-slide site to ask someone out — her photos in the background, a
couple of playful "what should we do" questions, background music, and a
final Yes/No slide where No runs away every time it's touched.

No build tools, no dependencies. Just HTML, CSS, and JS.

## 1. Add your content

- **Photos** — drop 5 images into `images/` named `photo1.jpg` through
  `photo5.jpg`. See `images/README.md` for details.
- **Music** — drop one song into `music/` named `song.mp3`. See
  `music/README.md` — you'll need to add this yourself since I can't
  include copyrighted music in the files I hand you.
- **The wording** — open `index.html` and edit the headlines, questions,
  and answer options to sound like you. Search for "September 10th, 2026"
  if the date ever needs to change.

## 2. Try it locally

Just open `index.html` in a browser — no server needed. (On a phone, you
can also open it directly from your file manager or from GitHub Pages,
see below.)

## 3. Put it on GitHub

If you're doing this from your phone, the GitHub app or github.com's
in-browser file upload both work fine — you don't need git or a terminal.

**Option A — GitHub mobile app / github.com (no terminal needed):**
1. Create a new repository (e.g. `ask-her-out`).
2. Use "Add file → Upload files" and upload everything in this folder,
   keeping the same folder structure (`images/`, `music/` as subfolders).
3. Commit directly to the `main` branch.

**Option B — git on a computer:**
```bash
cd ask-out-app
git init
git add .
git commit -m "Ask her out"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ask-her-out.git
git push -u origin main
```

## 4. Turn on GitHub Pages so you can send her a link

1. In the repo, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Pick the `main` branch and `/ (root)` folder, then **Save**.
4. After a minute or two, your site will be live at:
   `https://YOUR-USERNAME.github.io/ask-her-out/`

Send her that link.

## File structure

```
ask-out-app/
├── index.html      the 5 slides
├── style.css        colors, type, layout
├── script.js        slide logic, dodging No button, confetti, music
├── images/           her 5 photos go here
└── music/            your song goes here
```
