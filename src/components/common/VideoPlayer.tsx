import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

function fmt(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export interface VideoPlayerProps {
  src: string;
  /** Optional alternate encoding (e.g. MP4) for browsers without VP9/WebM. */
  srcFallback?: string | undefined;
  poster?: string | undefined;
  title?: string | undefined;
  credit?: string | undefined;
  className?: string | undefined;
  autoPlay?: boolean | undefined;
}

/** Real <video> playback with custom, keyboard-friendly controls. */
export function VideoPlayer({
  src,
  srcFallback,
  poster,
  title,
  credit,
  className,
  autoPlay = false,
}: VideoPlayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setTime(0);
  }, [src]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => setFailed(true));
    else v.pause();
  };

  return (
    <div
      ref={wrapRef}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-black",
        className,
      )}
    >
      <video
        ref={videoRef}
        key={src}
        poster={poster}
        playsInline
        preload="metadata"
        autoPlay={autoPlay}
        className="aspect-video w-full bg-black object-cover"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onError={() => setFailed(true)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      >
        <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
        {srcFallback ? (
          <source
            src={srcFallback}
            type={srcFallback.endsWith(".webm") ? "video/webm" : "video/mp4"}
          />
        ) : null}
      </video>

      {failed && (
        <div className="absolute inset-0 grid place-items-center bg-black/80 p-6 text-center text-sm text-white/80">
          This preview could not load right now. Check your connection and try again.
        </div>
      )}

      {!playing && !failed && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Play preview"
          className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/70 via-black/10 to-black/20"
        >
          <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-elevated transition-transform group-hover:scale-105">
            <Play className="ml-0.5 size-7 fill-current" />
          </span>
        </button>
      )}

      {waiting && playing && (
        <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/60 px-2 py-1 text-[11px] text-white">
          Buffering…
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/85 to-transparent p-3">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          aria-label="Seek video"
          onChange={(e) => {
            const v = videoRef.current;
            if (v) v.currentTime = Number(e.target.value);
            setTime(Number(e.target.value));
          }}
          className="h-1.5 w-full cursor-pointer accent-primary"
        />
        <div className="flex items-center gap-2 text-white">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="rounded-md p-1 hover:bg-white/15"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            type="button"
            aria-label="Restart"
            onClick={() => {
              const v = videoRef.current;
              if (v) {
                v.currentTime = 0;
                void v.play();
              }
            }}
            className="rounded-md p-1 hover:bg-white/15"
          >
            <RotateCcw className="size-4" />
          </button>
          <span className="text-[11px] tabular-nums text-white/80">
            {fmt(time)} / {fmt(duration)}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.muted = !v.muted;
                setMuted(v.muted);
              }}
              className="rounded-md p-1 hover:bg-white/15"
            >
              {muted || volume === 0 ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              aria-label="Volume"
              onChange={(e) => {
                const next = Number(e.target.value);
                const v = videoRef.current;
                setVolume(next);
                setMuted(next === 0);
                if (v) {
                  v.volume = next;
                  v.muted = next === 0;
                }
              }}
              className="hidden w-20 cursor-pointer accent-primary sm:block"
            />
            <button
              type="button"
              aria-label="Fullscreen"
              onClick={() => {
                const el = wrapRef.current;
                if (!el) return;
                if (document.fullscreenElement) void document.exitFullscreen();
                else void el.requestFullscreen?.();
              }}
              className="rounded-md p-1 hover:bg-white/15"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
        </div>
        {(title || credit) && (
          <p className="truncate text-[11px] text-white/60">
            {title}
            {title && credit ? " · " : ""}
            {credit}
          </p>
        )}
      </div>
    </div>
  );
}

/** Modal wrapper used by course cards and detail pages. */
export function DemoVideoDialog({
  open,
  onClose,
  src,
  srcFallback,
  poster,
  title,
  credit,
  subtitle,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  srcFallback?: string | undefined;
  poster?: string | undefined;
  title: string;
  credit?: string | undefined;
  subtitle?: string | undefined;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 grid place-items-center bg-background/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} demo lecture`}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
                  Free demo lecture
                </p>
                <h2 className="font-display text-lg font-semibold">{title}</h2>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close demo"
                className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <VideoPlayer
              src={src}
              {...(srcFallback ? { srcFallback } : {})}
              poster={poster}
              credit={credit}
              autoPlay
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
