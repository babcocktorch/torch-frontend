"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IMAGES } from "@/lib/constants";
import { app_theme } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { IoReloadOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";

// YouTube channel ID for The Babcock Torch
const CHANNEL_ID = "UCSXyYANx3E25o2rT0iVRJmg";
const COOLDOWN_SECONDS = 10;

// YouTube Player State constants (from the IFrame API)
const YT_PLAYER_STATE_PLAYING = 1;

type BroadcastStatus = "loading" | "live" | "offline";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

const StreamingPage = () => {
  const theme = useAtomValue(app_theme);
  const [status, setStatus] = useState<BroadcastStatus>("loading");
  const [cooldown, setCooldown] = useState(0);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logo =
    theme === "dark" ? IMAGES.logos.logo_white : IMAGES.logos.logo_gold;

  // Load the YouTube IFrame API script
  const loadYTAPI = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      // If the script is already in the DOM but not loaded yet, wait for it
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      );
      if (existingScript) {
        window.onYouTubeIframeAPIReady = () => resolve();
        return;
      }

      window.onYouTubeIframeAPIReady = () => resolve();
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    });
  }, []);

  // Create a YouTube player and detect live/offline
  const checkBroadcast = useCallback(async () => {
    setStatus("loading");

    // Destroy existing player if any
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        // Ignore destroy errors
      }
      playerRef.current = null;
    }

    // Ensure the player container div exists
    if (containerRef.current) {
      // Clear and recreate the player target div
      containerRef.current.innerHTML = "";
      const playerDiv = document.createElement("div");
      playerDiv.id = "yt-live-player";
      containerRef.current.appendChild(playerDiv);
    }

    await loadYTAPI();

    // Create a new player. If a live stream exists, it will start playing.
    // If not, onError fires.
    playerRef.current = new window.YT.Player("yt-live-player", {
      height: "100%",
      width: "100%",
      playerVars: {
        autoplay: 1,
        mute: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          // Load the live stream for this channel
          event.target.loadVideoByUrl({
            mediaContentUrl: `https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}`,
            suggestedQuality: "default",
          });
        },
        onStateChange: (event: any) => {
          if (event.data === YT_PLAYER_STATE_PLAYING) {
            setStatus("live");
          }
        },
        onError: () => {
          setStatus("offline");
        },
      },
    });

    // Fallback: if neither onError nor PLAYING fires within 8 seconds, assume offline
    setTimeout(() => {
      setStatus((current) => (current === "loading" ? "offline" : current));
    }, 8000);
  }, [loadYTAPI]);

  // Initial check on mount
  useEffect(() => {
    checkBroadcast();

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore
        }
      }
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  // Handle "Check Again" with cooldown
  const handleCheckAgain = () => {
    if (cooldown > 0) return;

    setCooldown(COOLDOWN_SECONDS);
    cooldownTimerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    checkBroadcast();
  };

  return (
    <main className="w-full flex justify-center py-6 md:py-12 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        {/* Title Area */}
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-miller font-semibold mb-2">
            Torch Live Broadcast
          </h1>
          <p className="text-muted-foreground">
            Watch live streams and special events right here.
          </p>
        </div>

        {/* Player / Status Area */}
        <div className="w-full flex flex-col gap-6 lg:h-[600px]">
          <div className="w-full h-full bg-zinc-950 dark:bg-black border border-border/50 rounded-xl overflow-hidden relative flex flex-col items-center justify-center aspect-video lg:aspect-auto">
            {/* YouTube Player Container — always in the DOM, visibility toggled */}
            <div
              ref={containerRef}
              className={cn(
                "absolute inset-0 w-full h-full z-20 transition-opacity duration-500",
                status === "live"
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none",
              )}
            />

            {/* LIVE badge */}
            {status === "live" && (
              <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-sm animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full" />
                Live
              </div>
            )}

            {/* Loading State */}
            {status === "loading" && (
              <div className="relative z-10 flex flex-col items-center gap-6 text-center select-none p-4">
                {/* Pulse glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[150%] h-[150%] rounded-full bg-gold/5 animate-pulse blur-3xl opacity-50" />
                </div>

                <div className="text-gold/30 text-7xl md:text-9xl font-miller leading-none drop-shadow-2xl animate-pulse">
                  T
                </div>
                <h2 className="text-lg md:text-2xl font-miller text-white/80 font-medium">
                  Checking broadcast...
                </h2>
              </div>
            )}

            {/* Offline State */}
            {status === "offline" && (
              <div className="relative z-10 flex flex-col items-center gap-8 text-center select-none p-6 md:p-12">
                {/* Background glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[150%] h-[150%] rounded-full bg-gold/5 blur-3xl opacity-40" />
                </div>

                {/* Logo */}
                <Image
                  src={logo.src}
                  alt="The Babcock Torch"
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 opacity-40"
                />

                {/* Heading */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl md:text-4xl font-miller text-white font-semibold">
                    No Live Broadcast
                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-12 bg-white/20" />
                    <p className="text-xs text-white/40 font-miller uppercase tracking-widest">
                      Currently Offline
                    </p>
                    <div className="h-px w-12 bg-white/20" />
                  </div>
                </div>

                {/* Message */}
                <p className="text-white/60 text-sm md:text-base max-w-md leading-relaxed">
                  There&apos;s nothing streaming right now. Check back soon or
                  tap the button below to see if we&apos;ve gone live.
                </p>

                {/* Check Again Button */}
                <button
                  onClick={handleCheckAgain}
                  disabled={cooldown > 0}
                  className={cn(
                    "group flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-medium transition-all",
                    cooldown > 0
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-gold text-white hover:bg-gold/90 hover:gap-3",
                  )}
                >
                  <IoReloadOutline className="transition-transform" />
                  {cooldown > 0 ? `Check again in ${cooldown}s` : "Check Again"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default StreamingPage;
