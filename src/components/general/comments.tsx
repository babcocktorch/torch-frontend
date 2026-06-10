"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getComments, submitComment, getReplies } from "@/lib/requests";
import { CommentData } from "@/lib/types";
import { MessageSquareReply, ChevronDown, Loader2 } from "lucide-react";

export const Comments = ({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination for top-level comments
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Pagination for replies
  const [repliesState, setRepliesState] = useState<
    Record<string, { page: number; hasMore: boolean; loading: boolean }>
  >({});

  // Top-level comment state
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const data = await getComments(slug, 1, 10);
      setComments(data.comments);
      setTotalComments(data.totalComments);
      setHasMoreComments(data.hasMore);

      // Initialize replies state based on initial load
      const initialRepliesState: Record<
        string,
        { page: number; hasMore: boolean; loading: boolean }
      > = {};
      data.comments.forEach((c) => {
        if (c.replyCount && c.replyCount > (c.replies?.length || 0)) {
          initialRepliesState[c.id] = {
            page: 0,
            hasMore: true,
            loading: false,
          };
        } else {
          initialRepliesState[c.id] = {
            page: 0,
            hasMore: false,
            loading: false,
          };
        }
      });
      setRepliesState(initialRepliesState);
      setIsLoading(false);
    };
    fetchComments();
  }, [slug]);

  const loadMoreComments = async () => {
    if (isLoadingMore || !hasMoreComments) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const data = await getComments(slug, nextPage, 10);

    setComments((prev) => [...prev, ...data.comments]);
    setPage(nextPage);
    setHasMoreComments(data.hasMore);

    // Append to replies state
    const newRepliesState = { ...repliesState };
    data.comments.forEach((c) => {
      if (c.replyCount && c.replyCount > (c.replies?.length || 0)) {
        newRepliesState[c.id] = { page: 0, hasMore: true, loading: false };
      } else {
        newRepliesState[c.id] = { page: 0, hasMore: false, loading: false };
      }
    });
    setRepliesState(newRepliesState);
    setIsLoadingMore(false);
  };

  const loadMoreReplies = async (commentId: string) => {
    const currentState = repliesState[commentId] || {
      page: 0,
      hasMore: true,
      loading: false,
    };
    if (currentState.loading || !currentState.hasMore) return;

    setRepliesState((prev) => ({
      ...prev,
      [commentId]: { ...currentState, loading: true },
    }));

    const nextPage = currentState.page + 1;
    const data = await getReplies(slug, commentId, nextPage, 10);

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            // If loading page 1, overwrite the initial 3 replies. Otherwise, append.
            replies:
              nextPage === 1
                ? data.replies
                : [...(c.replies || []), ...data.replies],
          };
        }
        return c;
      }),
    );

    setRepliesState((prev) => ({
      ...prev,
      [commentId]: { page: nextPage, hasMore: data.hasMore, loading: false },
    }));
  };

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

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);
    setReplyMessage(null);

    const { success, error } = await submitComment(
      slug,
      replyContent,
      parentId,
    );

    if (success) {
      setReplyMessage({
        type: "success",
        text: "Reply submitted! It will appear once approved.",
      });
      setReplyContent("");
      setTimeout(() => {
        setReplyingTo(null);
        setReplyMessage(null);
      }, 3000);
    } else {
      setReplyMessage({
        type: "error",
        text: error || "Failed to submit reply",
      });
    }

    setIsSubmittingReply(false);
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
              className="w-full min-h-32 p-4 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y text-sm"
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
              className="px-6 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div>
          <h4 className="font-semibold mb-6 flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              <span>{totalComments}</span>
            )}
            {totalComments === 1 ? "Comment Thread" : "Comment Threads"}
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
            <div className="space-y-10">
              {comments.map((comment) => (
                <div key={comment.id} className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full shrink-0 flex items-center justify-center text-muted-foreground font-semibold">
                      A
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-sm">Anonymous</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-foreground/90 whitespace-pre-wrap text-sm mb-2">
                        {comment.body}
                      </p>

                      {/* Reply button */}
                      <button
                        onClick={() => {
                          setReplyingTo(
                            replyingTo === comment.id ? null : comment.id,
                          );
                          setReplyMessage(null);
                          setReplyContent("");
                        }}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                      >
                        <MessageSquareReply className="w-3 h-3" />
                        Reply
                      </button>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <form
                          onSubmit={(e) => handleReplySubmit(e, comment.id)}
                          className="mt-4 space-y-3 bg-muted/20 p-4 rounded-md border"
                        >
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full min-h-24 p-3 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y text-sm"
                            required
                          />
                          {replyMessage && (
                            <p
                              className={cn(
                                "text-xs font-medium",
                                replyMessage.type === "success"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400",
                              )}
                            >
                              {replyMessage.text}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={
                                isSubmittingReply || !replyContent.trim()
                              }
                              className="px-4 py-1.5 bg-foreground text-background text-xs font-medium rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmittingReply
                                ? "Submitting..."
                                : "Submit Reply"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setReplyingTo(null)}
                              className="px-4 py-1.5 bg-transparent text-foreground border border-input text-xs font-medium rounded-md hover:bg-accent transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-14 space-y-6 mt-2 relative">
                      {/* Vertical line connecting threads visually */}
                      <div className="absolute left-6.5 -top-7.5 bottom-6 w-px bg-border -z-10" />

                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3 relative">
                          {/* Horizontal connector branch */}
                          <div className="absolute -left-4 top-3.5 w-3 h-px bg-border -z-10" />

                          <div className="w-7 h-7 bg-muted rounded-full shrink-0 flex items-center justify-center text-muted-foreground font-semibold text-[10px]">
                            A
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-medium text-sm">
                                Anonymous
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-foreground/90 whitespace-pre-wrap text-sm">
                              {reply.body}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Load More Replies Button */}
                      {repliesState[comment.id]?.hasMore && (
                        <div className="pt-2">
                          <button
                            onClick={() => loadMoreReplies(comment.id)}
                            disabled={repliesState[comment.id].loading}
                            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            {repliesState[comment.id].loading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                            Load more replies
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Handle edge case where there are replies but none loaded initially (e.g. they were hidden initially?) 
                      (The backend gives us 3 initially, but just in case) */}
                  {(!comment.replies || comment.replies.length === 0) &&
                    repliesState[comment.id]?.hasMore && (
                      <div className="pl-14 mt-2">
                        <button
                          onClick={() => loadMoreReplies(comment.id)}
                          disabled={repliesState[comment.id]?.loading}
                          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          {repliesState[comment.id]?.loading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                          View {comment.replyCount}{" "}
                          {comment.replyCount === 1 ? "reply" : "replies"}
                        </button>
                      </div>
                    )}
                </div>
              ))}

              {/* Load More Main Comments Button */}
              {hasMoreComments && (
                <div className="flex justify-center pt-8 border-t">
                  <button
                    onClick={loadMoreComments}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground font-medium rounded-md hover:bg-muted/80 transition-colors text-sm"
                  >
                    {isLoadingMore && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Load More Comments
                  </button>
                </div>
              )}
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
