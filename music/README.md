A note about the song that was in this folder
-----------------------------------------------
The MP3 that was here (downloaded from a lyrics/rip site) isn't included in
this cleaned-up version. That file is someone else's copyrighted recording,
and this site is meant to go live on a public Vercel URL — hosting and
serving that file from your own domain is music piracy, not something I can
help package up, even for a personal project like this one.

The good news: you have two clean ways to get music on the page.

Option A — use a track you actually have rights to
---------------------------------------------------
If you own the song (bought it, or it's royalty-free / Creative Commons),
just drop it in here named exactly:

  song.mp3

The <audio> tag in index.html already points at this file — nothing else
to change.

Option B — embed it from Spotify instead (no file needed)
-----------------------------------------------------------
This is the easier legal route: Spotify's own embedded player streams the
track from Spotify, so you're not hosting or distributing the recording
yourself.

1. In the Spotify app, find the song → Share → Copy Embed Code (or "Copy
   Link" and turn it into an embed URL: open.spotify.com/track/TRACK_ID
   becomes open.spotify.com/embed/track/TRACK_ID).
2. In index.html, delete the <audio id="bg-music" ...> line and replace it
   with something like:

   <iframe style="display:none" src="https://open.spotify.com/embed/track/TRACK_ID?autoplay=1"
     allow="autoplay; encrypted-media"></iframe>

3. Note: Spotify's embedded player only plays a full track for Spotify
   Premium listeners who are logged in; free accounts get a 30-second
   preview. If she doesn't have Premium, Option A (a licensed local file)
   is the more reliable choice for uninterrupted music.

Either way, keep the file/track under a few MB or it'll be slow to load
over mobile data.
