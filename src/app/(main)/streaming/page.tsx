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

        {/* Player Wrapper */}
        <div className="w-full flex flex-col gap-6 lg:h-[600px]">
          {/* Main Player Area */}
          <div className="w-full h-full bg-zinc-950 dark:bg-black border border-border/50 rounded-xl overflow-hidden relative flex flex-col items-center justify-center aspect-video lg:aspect-auto">
            {/* The YouTube iframe embeds the live stream directly. 
                Replace YOUR_CHANNEL_ID_HERE with the actual YouTube Channel ID (starts with UC).
                When you go live, YouTube automatically plays the stream here.
                When offline, it shows the channel's offline state. */}
            <iframe
              src="https://www.youtube.com/embed/live_stream?channel=UCSXyYANx3E25o2rT0iVRJmg&autoplay=1&mute=1"
              className="absolute inset-0 w-full h-full z-20"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>

            {/* Fallback/Background (Visible before iframe loads or if it fails) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="w-[150%] h-[150%] rounded-full bg-gold/5 dark:bg-gold/5 animate-pulse blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 text-center select-none p-4 opacity-50">
              <div className="text-gold/20 dark:text-gold/20 text-7xl md:text-9xl font-miller leading-none drop-shadow-2xl">
                T
              </div>
              <h2 className="text-lg md:text-2xl font-miller text-white/90 font-medium">
                Loading Broadcast...
              </h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StreamingPage;
