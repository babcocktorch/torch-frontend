"use client";

import React, { useState } from "react";
import { BiSolidLike, BiSolidDislike, BiLike, BiDislike } from "react-icons/bi";
import { cn } from "@/lib/utils";

interface PostReactionsProps {
  postId?: string;
  className?: string;
}

const PostReactions = ({ postId, className }: PostReactionsProps) => {
  // Mock data for UI - will be replaced with real data later
  const [agreeCount, setAgreeCount] = useState(405);
  const [disagreeCount, setDisagreeCount] = useState(145);
  const [userReaction, setUserReaction] = useState<"agree" | "disagree" | null>(
    null
  );

  const totalReactions = agreeCount + disagreeCount;
  const agreePercentage =
    totalReactions > 0 ? (agreeCount / totalReactions) * 100 : 0;
  const disagreePercentage =
    totalReactions > 0 ? (disagreeCount / totalReactions) * 100 : 0;

  const handleReaction = (reaction: "agree" | "disagree") => {
    // This will be replaced with actual API calls later
    if (userReaction === reaction) {
      // Remove reaction
      setUserReaction(null);
      if (reaction === "agree") {
        setAgreeCount((prev) => prev - 1);
      } else {
        setDisagreeCount((prev) => prev - 1);
      }
    } else if (userReaction) {
      // Change reaction
      if (reaction === "agree") {
        setAgreeCount((prev) => prev + 1);
        setDisagreeCount((prev) => prev - 1);
      } else {
        setDisagreeCount((prev) => prev + 1);
        setAgreeCount((prev) => prev - 1);
      }
      setUserReaction(reaction);
    } else {
      // Add new reaction
      setUserReaction(reaction);
      if (reaction === "agree") {
        setAgreeCount((prev) => prev + 1);
      } else {
        setDisagreeCount((prev) => prev + 1);
      }
    }
  };

  return (
    <section className={cn("my-12 py-8 border-y", className)}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold tracking-tight mb-2">
            What do you think?
          </h3>
          <p className="text-sm text-muted-foreground">
            Share your reaction to this opinion
          </p>
        </div>

        {/* Reaction Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleReaction("agree")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-md transition-all flex-1 justify-center font-medium text-sm border",
              userReaction === "agree"
                ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                : "bg-secondary hover:bg-muted text-foreground border-border"
            )}
          >
            {userReaction === "agree" ? (
              <BiSolidLike className="text-lg" />
            ) : (
              <BiLike className="text-lg" />
            )}
            <span>Agree</span>
          </button>

          <button
            onClick={() => handleReaction("disagree")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-md transition-all flex-1 justify-center font-medium text-sm border",
              userReaction === "disagree"
                ? "bg-rose-100 dark:bg-rose-950 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                : "bg-secondary hover:bg-muted text-foreground border-border"
            )}
          >
            {userReaction === "disagree" ? (
              <BiSolidDislike className="text-lg" />
            ) : (
              <BiDislike className="text-lg" />
            )}
            <span>Disagree</span>
          </button>
        </div>

        {/* Visual Stats Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span>{totalReactions.toLocaleString()} reactions</span>
          </div>

          {/* Main Visual Bar */}
          <div className="relative h-12 bg-muted rounded-md overflow-hidden flex border">
            {/* Agree Section */}
            <div
              className="relative bg-emerald-200 dark:bg-emerald-900/50 transition-all duration-500 ease-out flex items-center justify-start px-4"
              style={{ width: `${agreePercentage}%` }}
            >
              {agreePercentage > 15 && (
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                  <BiSolidLike className="text-base" />
                  <span className="text-sm">{agreePercentage.toFixed(0)}%</span>
                </div>
              )}
            </div>

            {/* Disagree Section */}
            <div
              className="relative bg-rose-200 dark:bg-rose-900/50 transition-all duration-500 ease-out flex items-center justify-end px-4"
              style={{ width: `${disagreePercentage}%` }}
            >
              {disagreePercentage > 15 && (
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-medium">
                  <span className="text-sm">
                    {disagreePercentage.toFixed(0)}%
                  </span>
                  <BiSolidDislike className="text-base" />
                </div>
              )}
            </div>

            {/* Center Divider */}
            {agreePercentage > 5 && disagreePercentage > 5 && (
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2" />
            )}
          </div>

          {/* Detailed Count */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BiSolidLike className="text-base text-emerald-600 dark:text-emerald-400" />
              {agreeCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              {disagreeCount.toLocaleString()}
              <BiSolidDislike className="text-base text-rose-600 dark:text-rose-400" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostReactions;
