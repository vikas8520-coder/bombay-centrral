"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number | null = null;
    let targetTime = 0;

    const activate = () => {
      if (ready) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(window.scrollY / scrollHeight, 1);
      targetTime = scrollProgress * (video.duration || 0);
      video.currentTime = targetTime;
      // Force the video element to display its current frame
      video.style.opacity = "1";
      setReady(true);
    };

    // Wait for video to be fully bufferable
    const onCanPlayThrough = () => {
      // Small delay to let decoder warm up
      setTimeout(activate, 200);
    };

    // Fallback: if canplaythrough doesn't fire in 3s, activate anyway
    const fallback = setTimeout(() => {
      activate();
    }, 3000);

    // Also activate on loadeddata as a faster fallback
    const onLoadedData = () => {
      if (video.readyState >= 1) {
        clearTimeout(fallback);
        setTimeout(activate, 300);
      }
    };

    // Smooth scroll-driven seeking
    const tick = () => {
      rafId = null;

      if (video.readyState < 1 || !video.duration) return;

      const diff = targetTime - video.currentTime;

      if (Math.abs(diff) < 0.008) {
        video.currentTime = targetTime;
        return;
      }

      video.currentTime += diff * 0.5;
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!ready) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollProgress = Math.min(scrollTop / scrollHeight, 1);

      if (video.duration) {
        targetTime = scrollProgress * video.duration;
      }

      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    video.load();
    video.addEventListener("canplaythrough", onCanPlayThrough);
    video.addEventListener("loadeddata", onLoadedData);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(fallback);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
      video.removeEventListener("loadeddata", onLoadedData);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ready]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Video background — full quality, scroll-reactive */}
      <video
        ref={videoRef}
        src="/bg-video.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Loading state — dark while video preloads */}
      {!ready && (
        <div className="absolute inset-0 bg-[#0a0908]" />
      )}

      {/* Subtle vignette for content readability — bottom only */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "30vh",
          background: "linear-gradient(to top, rgba(10,9,8,0.4) 0%, transparent 100%)",
        }}
      />

      {/* Grok logo mask — bottom-right corner */}
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: "180px",
          height: "60px",
          background: "radial-gradient(ellipse at center, #0a0908 30%, rgba(10,9,8,0.7) 60%, transparent 100%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}
