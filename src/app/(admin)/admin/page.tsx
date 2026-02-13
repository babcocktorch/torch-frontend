"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ADMIN_PAGES } from "@/lib/constants";
import { getAdminArticles, syncArticles } from "@/lib/admin-requests";
import { AdminArticle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  FileText,
  Eye,
  EyeOff,
  Star,
  MessageSquareQuote,
  RefreshCw,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { admin, token } = useAuth();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const stats = {
    total: articles.length,
    public: articles.filter((a) => a.visibility === "public").length,
    private: articles.filter((a) => a.visibility === "private").length,
    editorsPicks: articles.filter((a) => a.isEditorsPick),
    featuredOpinion: articles.find((a) => a.isFeaturedOpinion),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {admin?.name || "Admin"}
          </p>
        </div>
        <Button onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Sync Articles
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Articles
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.total}
            </div>
            <p className="text-xs text-muted-foreground">
              Synced from Sanity CMS
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.public}
            </div>
            <p className="text-xs text-muted-foreground">
              Visible to readers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.private}
            </div>
            <p className="text-xs text-muted-foreground">
              Hidden from readers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Editor&apos;s Picks
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${stats.editorsPicks.length}/3`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? ""
                : stats.editorsPicks.length > 0
                  ? stats.editorsPicks.map((a) => a.title).join(", ")
                  : "None selected"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Opinion
            </CardTitle>
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {isLoading
                ? "..."
                : stats.featuredOpinion?.title || "None selected"}
            </div>
            <p className="text-xs text-muted-foreground">
              Highlighted opinion piece
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for managing your content
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button asChild>
            <Link href={ADMIN_PAGES.articles}>
              <FileText className="h-4 w-4 mr-2" />
              Manage Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
