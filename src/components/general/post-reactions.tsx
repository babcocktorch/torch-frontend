"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BiSolidLike, BiSolidDislike, BiLike, BiDislike } from "react-icons/bi";
import { cn } from "@/lib/utils";
import {
  getArticleReactions,
  submitReaction,
  removeReaction,
} from "@/lib/requests";
import { ReactionType } from "@/lib/types";

interface PostReactionsProps {
  slug: string;
  className?: string;
}

const PostReactions = ({ slug, className }: PostReactionsProps) => {
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reactions on mount
  useEffect(() => {
    const fetchReactions = async () => {
      const data = await getArticleReactions(slug);
      setUpvoteCount(data.reactions.upvote);
      setDownvoteCount(data.reactions.downvote);
      setUserReaction(data.userReaction);
      setIsLoading(false);
    };
    fetchReactions();
  }, [slug]);

  const totalReactions = upvoteCount + downvoteCount;
  const agreePercentage =
    totalReactions > 0 ? (upvoteCount / totalReactions) * 100 : 50;
  const disagreePercentage =
    totalReactions > 0 ? (downvoteCount / totalReactions) * 100 : 50;

  const handleReaction = useCallback(
    async (reaction: ReactionType) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        if (userReaction === reaction) {
          // Toggle off — remove reaction
          const data = await removeReaction(slug);
          if (data) {
            setUpvoteCount(data.reactions.upvote);
            setDownvoteCount(data.reactions.downvote);
            setUserReaction(data.userReaction);
          }
        } else {
          // Add or change reaction
          const data = await submitReaction(slug, reaction);
          if (data) {
            setUpvoteCount(data.reactions.upvote);
            setDownvoteCount(data.reactions.downvote);
            setUserReaction(data.userReaction);
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [slug, userReaction, isSubmitting],
  );

  if (isLoading) {
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
          <div className="flex gap-3 mb-6">
            <div className="flex-1 h-10 bg-muted rounded-md animate-pulse" />
            <div className="flex-1 h-10 bg-muted rounded-md animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

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
            onClick={() => handleReaction("upvote")}
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-md transition-all flex-1 justify-center font-medium text-sm border",
              userReaction === "upvote"
                ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                : "bg-secondary hover:bg-muted text-foreground border-border",
              isSubmitting && "opacity-50 cursor-not-allowed",
            )}
          >
            {userReaction === "upvote" ? (
              <BiSolidLike className="text-lg" />
            ) : (
              <BiLike className="text-lg" />
            )}
            <span>Agree</span>
          </button>

          <button
            onClick={() => handleReaction("downvote")}
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-md transition-all flex-1 justify-center font-medium text-sm border",
              userReaction === "downvote"
                ? "bg-rose-100 dark:bg-rose-950 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                : "bg-secondary hover:bg-muted text-foreground border-border",
              isSubmitting && "opacity-50 cursor-not-allowed",
            )}
          >
            {userReaction === "downvote" ? (
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
              {upvoteCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              {downvoteCount.toLocaleString()}
              <BiSolidDislike className="text-base text-rose-600 dark:text-rose-400" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostReactions;
