"use client";

import { cn } from "@/lib/utils";
import { IoArrowForward } from "react-icons/io5";
import IdeaSubmission from "@/components/general/idea-submission";

interface OpinionsCTAProps {
  className?: string;
}

const OpinionsCTA = ({ className }: OpinionsCTAProps) => {
  return (
    <div
      className={cn(
        "w-full bg-linear-to-r from-gold/10 via-gold/5 to-transparent border border-gold/20 rounded-2xl p-6 lg:p-8",
        className
      )}
    >
      <h3 className="font-miller text-xl lg:text-2xl font-semibold mb-2">
        Got an opinion?
      </h3>
      <p className="text-muted-foreground text-sm lg:text-base mb-4 max-w-lg">
        Your voice matters. Share your thoughts on campus life, academics,
        culture, or anything that affects the Babcock community.
      </p>
      <IdeaSubmission
        trigger={
          <button className="inline-flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-full font-medium hover:bg-gold/90 transition-colors group text-sm">
            Submit Your Opinion
            <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
          </button>
        }
      />
    </div>
  );
};

export default OpinionsCTA;
