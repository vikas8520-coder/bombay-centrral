"use client";

import { useEffect, useRef } from "react";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();

    let rafId: number | null = null;
    let targetTime = 0;

    // Smooth easing loop
    const tick = () => {
      rafId = null;

      if (video.readyState < 1 || !video.duration) return;

      const diff = targetTime - video.currentTime;

      if (Math.abs(diff) < 0.008) {
        video.currentTime = targetTime;
        return;
      }

      // Fast ease — 50% per frame
      video.currentTime += diff * 0.5;

      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
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

    const onLoaded = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(window.scrollY / scrollHeight, 1);
      targetTime = scrollProgress * (video.duration || 0);
      video.currentTime = targetTime;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    video.addEventListener("loadedmetadata", onLoaded);

    return () => {
      window.removeEventListener("scroll", onScroll);
      video.removeEventListener("loadedmetadata", onLoaded);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Video background — scroll-reactive, full quality */}
      <video
        ref={videoRef}
        src="/bg-video.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

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
