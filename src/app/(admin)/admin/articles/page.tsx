"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getAdminArticles,
  syncArticles,
  updateArticleVisibility,
  setEditorsPick,
  removeEditorsPick,
  setFeaturedOpinion,
  removeFeaturedOpinion,
} from "@/lib/admin-requests";
import { AdminArticle } from "@/lib/types";
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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  RefreshCw,
  MoreHorizontal,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Search,
  Loader2,
  Filter,
  MessageSquareQuote,
} from "lucide-react";

type FilterType = "all" | "public" | "private" | "posts" | "opinions";

export default function AdminArticlesPage() {
  const { token } = useAuth();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchArticles();
    }
  }, [token]);

  const fetchArticles = async () => {
    if (!token) return;
    setIsLoading(true);
    const result = await getAdminArticles(token);
    if (result.data) {
      setArticles(result.data.articles);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleSync = async () => {
    if (!token) return;
    setIsSyncing(true);
    const result = await syncArticles(token);
    if (result.data) {
      toast.success(
        `Synced successfully! Created: ${result.data.created}, Updated: ${result.data.updated}`
      );
      fetchArticles();
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsSyncing(false);
  };

  const handleToggleVisibility = async (article: AdminArticle) => {
    if (!token) return;
    setActionLoadingId(article.id);
    const newVisibility =
      article.visibility === "public" ? "private" : "public";
    const result = await updateArticleVisibility(
      token,
      article.id,
      newVisibility
    );
    if (result.data) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id
            ? { ...a, visibility: result.data!.article.visibility }
            : a
        )
      );
      toast.success(
        `Article is now ${newVisibility === "public" ? "visible" : "hidden"}`
      );
    } else if (result.error) {
      toast.error(result.error);
    }
    setActionLoadingId(null);
  };

  const handleSetEditorsPick = async (article: AdminArticle) => {
    if (!token) return;
    if (!article.isPost) {
      toast.error("Only posts can be set as Editor's Pick");
      return;
    }
    setActionLoadingId(article.id);
    const result = await setEditorsPick(token, article.id);
    if (result.data) {
      // Refetch to get accurate state (backend may auto-remove oldest pick)
      fetchArticles();
      toast.success("Article set as Editor's Pick");
    } else if (result.error) {
      toast.error(result.error);
    }
    setActionLoadingId(null);
  };

  const handleRemoveEditorsPick = async (article: AdminArticle) => {
    if (!token) return;
    setActionLoadingId(article.id);
    const result = await removeEditorsPick(token, article.id);
    if (result.data) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id ? { ...a, isEditorsPick: false } : a,
        ),
      );
      toast.success("Removed from Editor's Pick");
    } else if (result.error) {
      toast.error(result.error);
    }
    setActionLoadingId(null);
  };

  const handleSetFeaturedOpinion = async (article: AdminArticle) => {
    if (!token) return;
    if (article.isPost) {
      toast.error("Only opinions can be set as Featured Opinion");
      return;
    }
    setActionLoadingId(article.id);
    const result = await setFeaturedOpinion(token, article.id);
    if (result.data) {
      // Backend auto-removes previous featured opinion, refetch for accuracy
      setArticles((prev) =>
        prev.map((a) => ({
          ...a,
          isFeaturedOpinion: a.id === article.id,
        })),
      );
      toast.success("Article set as Featured Opinion");
    } else if (result.error) {
      toast.error(result.error);
    }
    setActionLoadingId(null);
  };

  const handleRemoveFeaturedOpinion = async (article: AdminArticle) => {
    if (!token) return;
    setActionLoadingId(article.id);
    const result = await removeFeaturedOpinion(token, article.id);
    if (result.data) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id ? { ...a, isFeaturedOpinion: false } : a,
        ),
      );
      toast.success("Removed from Featured Opinion");
    } else if (result.error) {
      toast.error(result.error);
    }
    setActionLoadingId(null);
  };

  // Filter and search articles
  const filteredArticles = articles.filter((article) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    let matchesFilter = true;
    switch (filter) {
      case "public":
        matchesFilter = article.visibility === "public";
        break;
      case "private":
        matchesFilter = article.visibility === "private";
        break;
      case "posts":
        matchesFilter = article.isPost;
        break;
      case "opinions":
        matchesFilter = !article.isPost;
        break;
    }

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">
            Manage article visibility, Editor&apos;s Picks, and Featured
            Opinion
          </p>
        </div>
        <Button onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Sync from Sanity
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>
            Search and filter articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("public")}>
                  Public
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("private")}>
                  Private
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("posts")}>
                  Posts only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("opinions")}>
                  Opinions only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {articles.length === 0
                ? "No articles found. Click 'Sync from Sanity' to fetch articles."
                : "No articles match your filters."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Last Synced</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate max-w-[300px]">
                          {article.title}
                        </span>
                        {article.isEditorsPick && (
                          <Badge variant="secondary" className="shrink-0">
                            <Star className="h-3 w-3 mr-1" />
                            Pick
                          </Badge>
                        )}
                        {article.isFeaturedOpinion && (
                          <Badge variant="secondary" className="shrink-0">
                            <MessageSquareQuote className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {article.author}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {article.isPost ? "Post" : "Opinion"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          article.visibility === "public"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {article.visibility === "public" ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Public
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Private
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(article.lastSyncedAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actionLoadingId === article.id}
                          >
                            {actionLoadingId === article.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleVisibility(article)}
                          >
                            {article.visibility === "public" ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Make Private
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Make Public
                              </>
                            )}
                          </DropdownMenuItem>
                          {article.isPost && !article.isEditorsPick && (
                            <DropdownMenuItem
                              onClick={() => handleSetEditorsPick(article)}
                            >
                              <Star className="h-4 w-4 mr-2" />
                              Set as Editor&apos;s Pick
                            </DropdownMenuItem>
                          )}
                          {article.isPost && article.isEditorsPick && (
                            <DropdownMenuItem
                              onClick={() => handleRemoveEditorsPick(article)}
                            >
                              <StarOff className="h-4 w-4 mr-2" />
                              Remove from Editor&apos;s Pick
                            </DropdownMenuItem>
                          )}
                          {!article.isPost && !article.isFeaturedOpinion && (
                            <DropdownMenuItem
                              onClick={() => handleSetFeaturedOpinion(article)}
                            >
                              <MessageSquareQuote className="h-4 w-4 mr-2" />
                              Set as Featured Opinion
                            </DropdownMenuItem>
                          )}
                          {!article.isPost && article.isFeaturedOpinion && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleRemoveFeaturedOpinion(article)
                              }
                            >
                              <MessageSquareQuote className="h-4 w-4 mr-2" />
                              Remove Featured Opinion
                            </DropdownMenuItem>
                          )}
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
          Showing {filteredArticles.length} of {articles.length} articles
        </p>
      )}
    </div>
  );
}
