"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { submitCommunityContent } from "@/lib/requests";
import { Community, SubmissionType } from "@/lib/types";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

type SubmissionFormProps = {
  community: Community;
  trigger: React.ReactNode;
};

const SubmissionForm = ({ community, trigger }: SubmissionFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    authorName: "",
    authorContact: "",
    submissionType: "news" as SubmissionType,
    title: "",
    content: "",
    eventDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await submitCommunityContent({
      communityId: community.id,
      authorName: formData.authorName,
      authorContact: formData.authorContact,
      submissionType: formData.submissionType,
      title: formData.title,
      content: formData.content,
      eventDate: formData.eventDate || undefined,
    });

    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    if (data) {
      toast.success("Submission received! It will be reviewed by our team.");
      setOpen(false);
      setFormData({
        authorName: "",
        authorContact: "",
        submissionType: "news",
        title: "",
        content: "",
        eventDate: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit to {community.name}</DialogTitle>
          <DialogDescription>
            Share news, events, or announcements from your community. All
            submissions are reviewed before publishing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Author Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorName">Your Name *</Label>
              <Input
                id="authorName"
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorContact">Your Email *</Label>
              <Input
                id="authorContact"
                type="email"
                value={formData.authorContact}
                onChange={(e) =>
                  setFormData({ ...formData, authorContact: e.target.value })
                }
                placeholder="jane@babcock.edu.ng"
                required
              />
            </div>
          </div>

          {/* Submission Type */}
          <div className="space-y-2">
            <Label htmlFor="submissionType">Type *</Label>
            <select
              id="submissionType"
              value={formData.submissionType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  submissionType: e.target.value as SubmissionType,
                })
              }
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              required
            >
              <option value="news">News</option>
              <option value="event">Event</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          {/* Event Date (conditional) */}
          {formData.submissionType === "event" && (
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date *</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                required={formData.submissionType === "event"}
              />
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Robotics Club Wins National Competition"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Write your news, event details, or announcement here..."
              rows={6}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit for Review
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree that your content may be edited for clarity
            and style.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionForm;
