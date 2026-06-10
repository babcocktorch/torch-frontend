"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getComments, submitComment } from "@/lib/requests";
import { CommentData } from "@/lib/types";

export const Comments = ({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const data = await getComments(slug);
      setComments(data);
      setIsLoading(false);
    };
    fetchComments();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    const { success, error } = await submitComment(slug, newComment);

    if (success) {
      setSubmitMessage({
        type: "success",
        text: "Comment submitted successfully! It will appear once approved.",
      });
      setNewComment("");
    } else {
      setSubmitMessage({
        type: "error",
        text: error || "Failed to submit comment",
      });
    }

    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className={cn("my-12", className)}>
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold tracking-tight mb-8">Comments</h3>

        {/* Comment Form */}
        <div className="mb-12 bg-muted/30 p-6 rounded-lg border">
          <h4 className="font-semibold mb-4">Leave a comment</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Share your thoughts on this opinion. Comments are anonymous but must
            be approved by our team before they appear.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full min-h-30 p-4 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              required
            />
            {submitMessage && (
              <p
                className={cn(
                  "text-sm font-medium",
                  submitMessage.type === "success"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400",
                )}
              >
                {submitMessage.text}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-2.5 bg-foreground text-background font-medium rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div>
          <h4 className="font-semibold mb-6 flex items-center gap-2">
            <span>{comments.length}</span>{" "}
            {comments.length === 1 ? "Comment" : "Comments"}
          </h4>

          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full shrink-0 flex items-center justify-center text-muted-foreground font-semibold">
                    A
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium">Anonymous</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-foreground/90 whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8 border border-dashed rounded-lg">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
