import { BASE_URL, IMAGES } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Streaming | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Watch live streams, broadcasts, and special events from The Babcock Torch.",
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    title: "Streaming | The Babcock Torch",
    description:
      "Watch live streams, broadcasts, and special events from The Babcock Torch.",
    type: "website",
  },
};

const StreamingPage = () => {
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

        {/* Player and Chat Wrapper */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:h-[600px]">
          {/* Main Player Area (16:9 ratio) */}
          <div className="w-full lg:w-[70%] bg-zinc-950 dark:bg-black border border-border/50 rounded-xl overflow-hidden relative flex flex-col items-center justify-center aspect-video lg:aspect-auto">
            {/* Animated background pulse */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[150%] h-[150%] rounded-full bg-gold/5 dark:bg-gold/5 animate-pulse blur-3xl opacity-50" />
            </div>

            {/* Offline Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 text-center select-none p-4">
              {/* Torch brand mark */}
              <div className="text-gold/20 dark:text-gold/20 text-7xl md:text-9xl font-miller leading-none drop-shadow-2xl">
                T
              </div>

              {/* Live indicator block */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    Currently Offline
                  </span>
                </div>
                <h2 className="text-lg md:text-2xl font-miller text-white/90 font-medium">
                  Nothing special is streaming right now.
                </h2>
              </div>
            </div>

            {/* Player UI frame (bottom controls placeholder) */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/80 to-transparent flex items-end px-4 pb-4">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-4 text-white/50">
                  <div className="w-4 h-4 bg-white/20 rounded-sm" />
                  <div className="h-1 w-32 bg-white/20 rounded-full" />
                  <span className="text-[10px] font-mono">00:00 / 00:00</span>
                </div>
                <div className="flex items-center gap-3 text-white/50">
                  <div className="w-4 h-4 bg-white/20 rounded-sm" />
                  <div className="w-4 h-4 bg-white/20 rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Chat Placeholder */}
          <div className="w-full lg:w-[30%] flex flex-col bg-muted/40 border border-border/50 rounded-xl overflow-hidden h-[400px] lg:h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/50 bg-background/50 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Live Chat</h3>
              <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                Disabled
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-3 opacity-60">
              <svg
                className="w-10 h-10 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium">
                  Chat is currently disabled
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Check back when the broadcast is live.
                </p>
              </div>
            </div>

            {/* Input Placeholder */}
            <div className="p-3 border-t border-border/50 bg-background/50">
              <div className="w-full bg-muted border border-border/50 rounded-full px-4 py-2 text-xs text-muted-foreground/50 select-none cursor-not-allowed">
                Type a message...
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StreamingPage;
