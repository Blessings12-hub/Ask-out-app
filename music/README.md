A note about the song that was in this folder
-----------------------------------------------
The MP3 that was here (downloaded from a lyrics/rip site) isn't wired up
in this version, and renaming it to `Song.mp3` doesn't change that — I
checked, and it's byte-for-byte the same file as before. It's still
someone else's copyrighted commercial recording, and this site is meant
to go live on a public Vercel URL, so hosting/serving it from your own
domain would still be music piracy regardless of the filename. It's just
sitting in this folder unused; the site doesn't reference it.

Current setup: Spotify embed via the official iFrame API
------------------------------------------------------------
index.html has a small "now playing" chip in the bottom-right corner that
streams the track straight from Spotify — you're not hosting or
distributing the recording, Spotify is.

Two versions of this have existed:
1. A hidden iframe pointing at the regular `open.spotify.com/track/...`
   share link — Spotify blocks that URL from being framed at all, so
   nothing loaded.
2. A visible iframe using the correct embed URL with a `?autoplay=1`
   parameter — this loaded correctly, but Spotify's own community forums
   report that parameter as unreliable for actually starting playback.

This version uses Spotify's official iFrame API
(open.spotify.com/embed/iframe-api/v1), which creates a real controller
object in script.js that gets `.play()` called on it directly the instant
she taps anything on the page — the same "wait for a real gesture, then
play directly" approach used everywhere else on this site, just through
Spotify's API instead of a plain `<audio>` tag. This is the mechanism
Spotify documents for reliable programmatic playback.

Two things worth knowing:
- Free Spotify accounts only get a 30-second preview through the embed;
  full-length playback needs her to be logged into Premium in that browser.
- To swap the song, find the new track in Spotify → Share → Copy Song Link,
  grab the ID after `/track/`, and swap it into the `uri` value in
  script.js (`spotify:track:THAT_ID`).

Option A — use a local file you actually have rights to
---------------------------------------------------------
If you'd rather not depend on Spotify at all, you can still use a file you
genuinely own (bought it, or it's royalty-free / Creative Commons) —
something you purchased or downloaded from a licensed source, not a rip
of a commercial track under a different filename:

1. Drop it in this folder named exactly `song.mp3`.
2. In index.html, replace the Spotify `<script>` + `<div class="music-chip">`
   block with: `<audio id="bg-music" src="music/song.mp3" loop preload="auto" muted playsinline></audio>`
3. In script.js, swap the "Music: Spotify's official iFrame API" block for
   a local-file autoplay version (starts muted on load, unmutes on her
   first tap) — ask me to do this swap if you go this route and I'll wire
   it back up.

Keep whichever file/track under a few MB or it'll be slow to load over
mobile data.
