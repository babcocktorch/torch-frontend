"use client";

import { cn } from "@/lib/utils";
import { IMAGES } from "@/lib/constants";
import { IoArrowForward } from "react-icons/io5";
import IdeaSubmission from "./idea-submission";

interface ContributorCTAProps {
  variant?: "default" | "compact";
  className?: string;
}

const ContributorCTA = ({
  variant = "default",
  className,
}: ContributorCTAProps) => {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "w-full bg-gradient-to-r from-foreground to-foreground/80 text-background rounded-2xl p-6",
          className
        )}
      >
        <h3 className="font-miller text-xl lg:text-2xl font-semibold italic mb-2">
          Got a story to tell?
        </h3>
        <p className="text-background/80 text-sm mb-4">
          The Torch is built for student contributors.
        </p>
        <IdeaSubmission
          trigger={
            <button className="inline-flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-full font-medium hover:bg-gold/90 transition-colors text-sm">
              Share Your Story
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden text-background rounded-2xl",
        className
      )}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${IMAGES.contributor_cta.src})`,
          backgroundPosition: 'right -150px center'
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      {/* Content */}
      <div className="relative z-10 p-8 lg:p-10">
        <h2 className="font-miller text-3xl lg:text-4xl xl:text-5xl font-semibold mb-3">
          Your Voice,
          <br />
          Your Platform.
        </h2>
        <p className="text-background/80 text-base lg:text-lg mb-6 max-w-md">
          Pitch a story idea, submit an opinion piece, or report on campus News.
          The Torch is built for student contributors.
        </p>
        <IdeaSubmission
          trigger={
            <button className="inline-flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-full font-medium hover:bg-gold/90 transition-colors group">
              Contribute Now
              <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
            </button>
          }
        />
      </div>
    </div>
  );
};

export default ContributorCTA;
