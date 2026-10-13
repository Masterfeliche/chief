import { useEffect, useRef, useState } from "react";

/* Floating player — the one React island on the site.
   With `src` it plays a preview MP3; without, the button opens Spotify. */

type Props = { title: string; artist: string; art: string; spotify: string; src?: string; label?: string };

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Player({ title, artist, art, spotify, src, label = "Spotify" }: Props) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    if (!src) return;
    const a = new Audio(src);
    a.preload = "none";
    audio.current = a;
    const onTime = () => { setT(a.currentTime); setDur(a.duration || 0); };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", () => setPlaying(true));
    a.addEventListener("pause", () => setPlaying(false));
    a.addEventListener("ended", () => setPlaying(false));
    return () => { a.pause(); a.removeEventListener("timeupdate", onTime); };
  }, [src]);

  const toggle = () => {
    if (!audio.current) { window.open(spotify, "_blank", "noopener"); return; }
    audio.current.paused ? audio.current.play() : audio.current.pause();
  };

  return (
    <div className="player" id="player" aria-label="Now playing">
      <div className="player__art"><img src={art} width={48} height={48} alt="" loading="lazy" /></div>
      <div className="player__mid">
        <span className="player__t">{title} <span>— {artist}</span></span>
        <div className="player__bar">
          <span className="mono">{fmt(t)}</span>
          <div className="player__prog"><i style={{ width: dur ? `${(t / dur) * 100}%` : 0 }} /></div>
          <span className="mono">{dur ? fmt(dur) : label}</span>
        </div>
      </div>
      <button className="btn btn--acc player__btn" type="button" onClick={toggle} aria-label={src ? (playing ? "Pause" : "Play") : "Listen on Spotify"}>
        {playing ? (
          <svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true"><path d="M2.5 1.5h2.5v9h-2.5zM7 1.5h2.5v9h-2.5z" fill="currentColor" /></svg>
        ) : (
          <svg viewBox="0 0 12 12" width="14" height="14" aria-hidden="true"><path d="M2 1.5v9l8-4.5z" fill="currentColor" /></svg>
        )}
      </button>
      <a className="player__link" href={spotify} target="_blank" rel="noopener">Open in Spotify ↗</a>
    </div>
  );
}
