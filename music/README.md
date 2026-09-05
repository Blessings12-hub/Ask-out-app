A note about the song that was in this folder
-----------------------------------------------
The MP3 that was here (downloaded from a lyrics/rip site) isn't included in
this cleaned-up version. That file is someone else's copyrighted recording,
and this site is meant to go live on a public Vercel URL — hosting and
serving that file from your own domain is music piracy, not something I can
help package up, even for a personal project like this one. The rip is
still sitting in this folder from an earlier version of the project; it's
just not referenced by the site anymore.

Current setup: Spotify embed (already working)
------------------------------------------------
index.html now has a small "now playing" chip in the bottom-right corner
that streams the track straight from Spotify — you're not hosting or
distributing the recording, Spotify is. It's set to autoplay, and tucks
itself into a small note icon after a few seconds so it doesn't sit on top
of the photos; tapping it brings the full player back.

A previous version of this embed was broken: it used the regular
open.spotify.com/track/... share link (which Spotify blocks from being
framed at all) and was hidden with display:none. It's now using the actual
embed URL (open.spotify.com/embed/track/...) and is visible, which is what
makes Spotify's autoplay and controls work.

Two things worth knowing:
- Free Spotify accounts only get a 30-second preview through the embed;
  full-length playback needs her to be logged into Premium in that browser.
- To swap the song, find the new track in Spotify → Share → Copy Song Link,
  grab the ID after /track/, and swap it into the iframe's src in
  index.html (`open.spotify.com/embed/track/THAT_ID`).

Option A — use a local file you actually have rights to
---------------------------------------------------------
If you'd rather not depend on Spotify at all, you can still use a file you
own (bought it, or it's royalty-free / Creative Commons):

1. Drop it in this folder named exactly `song.mp3`.
2. In index.html, replace the `<div class="music-chip">...</div>` block
   with: `<audio id="bg-music" src="music/song.mp3" loop preload="auto" muted playsinline></audio>`
3. In script.js, swap the "Music: Spotify widget" block for the local-file
   autoplay version (starts muted on load, unmutes on her first tap) — ask
   me to do this swap if you go this route and I'll wire it back up.

Keep whichever file/track under a few MB or it'll be slow to load over
mobile data.
