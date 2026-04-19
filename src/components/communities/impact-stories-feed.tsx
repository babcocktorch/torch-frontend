import { ImpactStoryType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { georgia } from "@/lib/fonts";
import { BookOpen } from "lucide-react";
import ImpactStoryCard from "./impact-story-card";

const ImpactStoriesFeed = ({ stories }: { stories: ImpactStoryType[] }) => {
  if (stories.length === 0) {
    return (
      <div className="text-center py-16 px-6 max-w-7xl mx-auto">
        <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h2
          className={cn(
            georgia.className,
            "text-xl sm:text-2xl font-semibold mb-3",
          )}
        >
          Impact Stories
        </h2>
        <p className="text-muted-foreground text-lg">
          No impact stories published yet.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Community stories will appear here once approved and published.
        </p>
      </div>
    );
  }

  // Separate featured and regular stories
  const featuredStory = stories.find((s) => s.featured);
  const regularStories = stories.filter((s) => s._id !== featuredStory?._id);

  return (
    <div className="px-6 max-w-7xl mx-auto py-8">
      <h2
        className={cn(
          georgia.className,
          "text-2xl sm:text-3xl font-semibold mb-8",
        )}
      >
        Impact Stories
      </h2>

      {/* Featured story — full width hero card */}
      {featuredStory && (
        <div className="mb-8">
          <ImpactStoryCard story={featuredStory} />
        </div>
      )}

      {/* Regular stories grid */}
      {regularStories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularStories.map((story) => (
            <ImpactStoryCard key={story._id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImpactStoriesFeed;
