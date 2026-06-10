"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getAdminComments,
  updateCommentStatus,
  deleteComment,
} from "@/lib/admin-requests";
import { CommentData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Check,
  X,
  Trash2,
  Loader2,
  Inbox,
  Eye,
  MessageSquare,
  Filter,
  MessageSquareReply,
} from "lucide-react";

export default function AdminCommentsPage() {
  const { token } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [status, setStatus] = useState("pending");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentData | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchComments();
    }
  }, [token, page, status]);

  const fetchComments = async () => {
    if (!token) return;
    setIsLoading(true);

    const result = await getAdminComments(token, page, limit, status);
    if (result.data) {
      setComments(result.data.comments);
      setTotal(result.data.total);
      setTotalPages(result.data.totalPages);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleUpdateStatus = async (
    comment: CommentData,
    isApproved: boolean,
  ) => {
    if (!token) return;
    setIsSubmitting(true);

    const result = await updateCommentStatus(token, comment.id, isApproved);
    if (result.data) {
      toast.success(isApproved ? "Comment approved!" : "Comment disapproved.");
      setComments((prev) =>
        prev.map((c) => (c.id === comment.id ? { ...c, isApproved } : c)),
      );
      setViewDialogOpen(false);
      // Optional: re-fetch to update the pending list immediately
      if (status === "pending") {
        fetchComments();
      }
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!token || !selectedComment) return;
    setIsSubmitting(true);

    const result = await deleteComment(token, selectedComment.id);
    if (result.data) {
      toast.success("Comment deleted");
      setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
      setDeleteDialogOpen(false);
      setViewDialogOpen(false);
      setSelectedComment(null);
      setTotal((t) => t - 1);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const openDeleteDialog = (comment: CommentData) => {
    setSelectedComment(comment);
    setDeleteDialogOpen(true);
  };

  const openViewDialog = (comment: CommentData) => {
    setSelectedComment(comment);
    setViewDialogOpen(true);
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          Comments
        </h1>
        <p className="text-muted-foreground">
          Review and moderate comments on opinions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={status}
              onValueChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Comments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Comments Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
              No comments found.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Comment</TableHead>
                    <TableHead>Article</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12.5"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {comment.parentId && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium bg-muted/50 w-fit px-1.5 py-0.5 rounded">
                              <MessageSquareReply className="w-3 h-3" />
                              Reply
                            </span>
                          )}
                          <span className="font-medium truncate max-w-100 block text-sm">
                            {comment.body}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-50">
                        {comment.article?.title || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {comment.isApproved ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          >
                            Approved
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          >
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(comment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openViewDialog(comment)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {!comment.isApproved ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(comment, true)
                                }
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(comment, false)
                                }
                              >
                                <X className="h-4 w-4 mr-2" />
                                Disapprove
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(comment)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, total)} of {total} comments
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comment Details</DialogTitle>
            <DialogDescription>
              Review this comment on &quot;{selectedComment?.article?.title}
              &quot;
            </DialogDescription>
          </DialogHeader>

          {selectedComment && (
            <div className="space-y-4 py-4">
              {selectedComment.parentId && selectedComment.parent && (
                <div className="bg-muted/50 rounded-lg p-3 text-sm border-l-2 border-primary/50 text-muted-foreground">
                  <span className="font-semibold mb-1 flex items-center gap-1">
                    <MessageSquareReply className="w-3 h-3" /> Replying to:
                  </span>
                  {selectedComment.parent.body}
                </div>
              )}

              <div className="bg-muted/30 rounded-lg p-4 whitespace-pre-wrap text-foreground border">
                {selectedComment.body}
              </div>
              <div className="text-sm text-muted-foreground">
                Submitted on {formatDate(selectedComment.createdAt)}
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {!selectedComment?.isApproved ? (
              <Button
                onClick={() =>
                  selectedComment && handleUpdateStatus(selectedComment, true)
                }
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() =>
                  selectedComment && handleUpdateStatus(selectedComment, false)
                }
                disabled={isSubmitting}
                className="text-yellow-600 hover:text-yellow-700"
              >
                <X className="h-4 w-4 mr-2" />
                Disapprove
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() =>
                selectedComment && openDeleteDialog(selectedComment)
              }
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this comment. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
