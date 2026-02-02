"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getAdminCommunities,
  createCommunity,
  updateCommunity,
  deleteCommunity,
} from "@/lib/admin-requests";
import { Community, CreateCommunityRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
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
import { toast } from "sonner";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Users,
  Search,
} from "lucide-react";

export default function AdminCommunitiesPage() {
  const { token } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateCommunityRequest>({
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    contactEmail: "",
  });

  useEffect(() => {
    if (token) {
      fetchCommunities();
    }
  }, [token]);

  const fetchCommunities = async () => {
    if (!token) return;
    setIsLoading(true);
    const result = await getAdminCommunities(token);
    if (result.data) {
      setCommunities(result.data.communities);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!token || !formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);
    const result = await createCommunity(token, {
      name: formData.name.trim(),
      slug: formData.slug?.trim() || undefined,
      description: formData.description?.trim() || undefined,
      logoUrl: formData.logoUrl?.trim() || undefined,
      contactEmail: formData.contactEmail?.trim() || undefined,
    });

    if (result.data) {
      toast.success("Community created successfully");
      setCommunities((prev) => [...prev, result.data!.community]);
      setCreateDialogOpen(false);
      resetForm();
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleEdit = async () => {
    if (!token || !selectedCommunity || !formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);
    const result = await updateCommunity(token, selectedCommunity.id, {
      name: formData.name.trim(),
      slug: formData.slug?.trim() || undefined,
      description: formData.description?.trim() || null,
      logoUrl: formData.logoUrl?.trim() || null,
      contactEmail: formData.contactEmail?.trim() || null,
    });

    if (result.data) {
      toast.success("Community updated successfully");
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === selectedCommunity.id ? result.data!.community : c
        )
      );
      setEditDialogOpen(false);
      resetForm();
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!token || !selectedCommunity) return;

    setIsSubmitting(true);
    const result = await deleteCommunity(token, selectedCommunity.id);

    if (result.data) {
      toast.success(
        `Community deleted. ${result.data.deletedSubmissions} submissions removed.`
      );
      setCommunities((prev) =>
        prev.filter((c) => c.id !== selectedCommunity.id)
      );
      setDeleteDialogOpen(false);
      setSelectedCommunity(null);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  const openEditDialog = (community: Community) => {
    setSelectedCommunity(community);
    setFormData({
      name: community.name,
      slug: community.slug,
      description: community.description || "",
      logoUrl: community.logoUrl || "",
      contactEmail: community.contactEmail || "",
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (community: Community) => {
    setSelectedCommunity(community);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      logoUrl: "",
      contactEmail: "",
    });
    setSelectedCommunity(null);
  };

  // Filter communities by search
  const filteredCommunities = communities.filter(
    (community) =>
      searchQuery === "" ||
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground">
            Manage campus organizations and groups
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Community
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Community</DialogTitle>
              <DialogDescription>
                Add a new campus organization or group.
              </DialogDescription>
            </DialogHeader>
            <CommunityForm formData={formData} setFormData={setFormData} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search</CardTitle>
          <CardDescription>Find communities by name or slug</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Communities Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {communities.length === 0
                ? "No communities yet. Create your first one!"
                : "No communities match your search."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommunities.map((community) => (
                  <TableRow key={community.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {community.logoUrl ? (
                          <img
                            src={community.logoUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium">{community.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {community.slug}
                    </TableCell>
                    <TableCell>{community._count?.submissions || 0}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(community.createdAt)}
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
                            onClick={() => openEditDialog(community)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(community)}
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
          Showing {filteredCommunities.length} of {communities.length}{" "}
          communities
        </p>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Community</DialogTitle>
            <DialogDescription>
              Update community information.
            </DialogDescription>
          </DialogHeader>
          <CommunityForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Community?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{selectedCommunity?.name}&quot;
              and all its submissions. This action cannot be undone.
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

// Reusable form component
function CommunityForm({
  formData,
  setFormData,
}: {
  formData: CreateCommunityRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateCommunityRequest>>;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Robotics Club"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (optional)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g., robotics-club (auto-generated if empty)"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of the community..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL (optional)</Label>
        <Input
          id="logoUrl"
          value={formData.logoUrl}
          onChange={(e) =>
            setFormData({ ...formData, logoUrl: e.target.value })
          }
          placeholder="https://example.com/logo.png"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email (optional)</Label>
        <Input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={(e) =>
            setFormData({ ...formData, contactEmail: e.target.value })
          }
          placeholder="contact@example.com"
        />
      </div>
    </div>
  );
}
