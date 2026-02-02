"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getAdminSubmissions,
  getAdminSubmission,
  updateSubmissionStatus,
  deleteSubmission,
  getAdminCommunities,
  SubmissionFilters,
} from "@/lib/admin-requests";
import {
  Community,
  CommunitySubmission,
  SubmissionStatus,
  SubmissionType,
} from "@/lib/types";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Check,
  X,
  Trash2,
  Loader2,
  Inbox,
  Eye,
  Filter,
  Calendar,
  Mail,
  User,
} from "lucide-react";

export default function AdminSubmissionsPage() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [filterCommunity, setFilterCommunity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<CommunitySubmission | null>(null);
  const [fullSubmission, setFullSubmission] =
    useState<CommunitySubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCommunities();
      fetchSubmissions();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchSubmissions();
    }
  }, [filterCommunity, filterStatus, filterType, token]);

  const fetchCommunities = async () => {
    if (!token) return;
    const result = await getAdminCommunities(token);
    if (result.data) {
      setCommunities(result.data.communities);
    }
  };

  const fetchSubmissions = async () => {
    if (!token) return;
    setIsLoading(true);

    const filters: SubmissionFilters = {};
    if (filterCommunity !== "all") filters.community_id = filterCommunity;
    if (filterStatus !== "all") filters.status = filterStatus as SubmissionStatus;
    if (filterType !== "all")
      filters.submission_type = filterType as SubmissionType;

    const result = await getAdminSubmissions(token, filters);
    if (result.data) {
      setSubmissions(result.data.submissions);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleViewDetails = async (submission: CommunitySubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
    setIsLoadingDetails(true);

    if (!token) return;
    const result = await getAdminSubmission(token, submission.id);
    if (result.data) {
      setFullSubmission(result.data.submission);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsLoadingDetails(false);
  };

  const handleUpdateStatus = async (
    submission: CommunitySubmission,
    status: "reviewed" | "rejected"
  ) => {
    if (!token) return;
    setIsSubmitting(true);

    const result = await updateSubmissionStatus(token, submission.id, status);
    if (result.data) {
      toast.success(
        status === "reviewed"
          ? "Submission approved!"
          : "Submission rejected"
      );
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submission.id ? { ...s, status: result.data!.submission.status } : s
        )
      );
      setViewDialogOpen(false);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!token || !selectedSubmission) return;
    setIsSubmitting(true);

    const result = await deleteSubmission(token, selectedSubmission.id);
    if (result.data) {
      toast.success("Submission deleted");
      setSubmissions((prev) =>
        prev.filter((s) => s.id !== selectedSubmission.id)
      );
      setDeleteDialogOpen(false);
      setViewDialogOpen(false);
      setSelectedSubmission(null);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const openDeleteDialog = (submission: CommunitySubmission) => {
    setSelectedSubmission(submission);
    setDeleteDialogOpen(true);
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

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pending
          </Badge>
        );
      case "reviewed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Rejected
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: SubmissionType) => {
    switch (type) {
      case "news":
        return <Badge variant="outline">News</Badge>;
      case "event":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            Event
          </Badge>
        );
      case "announcement":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-600">
            Announcement
          </Badge>
        );
    }
  };

  // Parse mediaUrls which might be a JSON string or array
  const parseMediaUrls = (urls: string[] | string): string[] => {
    if (Array.isArray(urls)) return urls;
    if (typeof urls === "string") {
      try {
        return JSON.parse(urls);
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Submissions</h1>
        <p className="text-muted-foreground">
          Review and manage community submissions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <CardDescription>Filter submissions by community, status, or type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Community Filter */}
            <Select value={filterCommunity} onValueChange={setFilterCommunity}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Communities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Communities</SelectItem>
                {communities.map((community) => (
                  <SelectItem key={community.id} value={community.id}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
              No submissions found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Title</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <span className="font-medium truncate max-w-[250px] block">
                        {submission.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {submission.community?.name || "Unknown"}
                    </TableCell>
                    <TableCell>{getTypeBadge(submission.submissionType)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {submission.authorName}
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(submission.createdAt)}
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
                            onClick={() => handleViewDetails(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {submission.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(submission, "reviewed")
                                }
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(submission, "rejected")
                                }
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(submission)}
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
          )}
        </CardContent>
      </Card>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          Showing {submissions.length} submissions
        </p>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Review the submission content before approving or rejecting.
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : fullSubmission ? (
            <div className="space-y-6 py-4">
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeBadge(fullSubmission.submissionType)}
                  {getStatusBadge(fullSubmission.status)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(fullSubmission.createdAt)}
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl font-semibold">{fullSubmission.title}</h3>
                <p className="text-sm text-muted-foreground">
                  From: {fullSubmission.community?.name || "Unknown Community"}
                </p>
              </div>

              {/* Author Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{fullSubmission.authorName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${fullSubmission.authorContact}`}
                    className="text-blue-600 hover:underline"
                  >
                    {fullSubmission.authorContact}
                  </a>
                </div>
                {fullSubmission.eventDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Event: {formatDate(fullSubmission.eventDate)}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <h4 className="font-medium mb-2">Content</h4>
                <div className="bg-muted/30 rounded-lg p-4 whitespace-pre-wrap">
                  {fullSubmission.content}
                </div>
              </div>

              {/* Media URLs */}
              {parseMediaUrls(fullSubmission.mediaUrls).length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Media</h4>
                  <div className="space-y-2">
                    {parseMediaUrls(fullSubmission.mediaUrls).map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline block truncate"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Info */}
              {fullSubmission.reviewedAt && (
                <div className="text-sm text-muted-foreground border-t pt-4">
                  Reviewed on {formatDate(fullSubmission.reviewedAt)}
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {fullSubmission?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus(fullSubmission, "rejected")}
                  disabled={isSubmitting}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(fullSubmission, "reviewed")}
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
              </>
            )}
            {fullSubmission?.status !== "pending" && (
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{selectedSubmission?.title}&quot;.
              This action cannot be undone.
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
