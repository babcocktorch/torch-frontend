import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitIdea } from "@/lib/requests";

interface IdeaSubmissionProps {
  trigger?: React.ReactNode;
}

const SUBMISSION_TYPES = [
  "News Tip",
  "Opinion / Column Pitch",
  "Story Idea / Feature Pitch",
  "Event Announcement",
  "Community / Club Submission",
  "Creative Work",
  "Correction",
  "Other",
] as const;

type SubmissionType = (typeof SUBMISSION_TYPES)[number];

const PLACEHOLDERS: Record<SubmissionType, string> = {
  "News Tip": "What happened? Who's involved? When and where?",
  "Opinion / Column Pitch":
    "What's your argument? Why does it matter to Babcock?",
  "Story Idea / Feature Pitch":
    "Who or what should we look into? Why is this interesting?",
  "Event Announcement": "What's the event? When and where is it happening?",
  "Community / Club Submission":
    "What would you like us to cover about your organization?",
  "Creative Work": "Describe your piece. Is it poetry, prose, or visual art?",
  Correction: "What did we get wrong? Please include a link to the article.",
  Other: "Tell us everything we need to know.",
};

const IdeaSubmission = ({ trigger }: IdeaSubmissionProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [submissionType, setSubmissionType] = useState<SubmissionType | "">("");
  const [details, setDetails] = useState({
    name: "",
    contact: "",
    summary: "",
    details: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must not exceed 5MB.");
        setFile(null);
        e.target.value = "";
        return;
      }
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error(
          "Invalid file type. Only images and documents are allowed.",
        );
        setFile(null);
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!submissionType) {
      toast.error("Please select a submission type.");
      return;
    }

    if (!details.summary.trim() || !details.details.trim()) {
      toast.error("Please provide a summary and details.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("submissionType", submissionType);
    formData.append("name", details.name);
    formData.append("contact", details.contact);
    formData.append("summary", details.summary);
    formData.append("details", details.details);
    if (file) {
      formData.append("attachment", file);
    }

    const { error } = await submitIdea(formData);

    setLoading(false);

    if (error) {
      toast.error("Failed to submit. Please try again.");
      return;
    }

    toast.success("Submitted successfully.");

    setSubmissionType("");
    setDetails({
      name: "",
      contact: "",
      summary: "",
      details: "",
    });
    setFile(null);

    if (fileInputRef.current) fileInputRef.current.value = "";

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="rounded-full text-xs lg:text-sm">
            Talk to the Torch
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Have something to share?</DialogTitle>
          <DialogDescription>
            Submit a tip, pitch, or correction to the Torch.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="submissionType">What is this?</Label>
            <Select
              value={submissionType}
              onValueChange={(val) => setSubmissionType(val as SubmissionType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a submission type..." />
              </SelectTrigger>
              <SelectContent>
                {SUBMISSION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center justify-between">
              Your name
              <span className="text-xs text-muted-foreground font-normal">
                Optional
              </span>
            </Label>
            <Input
              name="name"
              placeholder="You can stay anonymous — we protect our sources."
              value={details.name}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="contact"
              className="flex items-center justify-between"
            >
              How to reach you
              <span className="text-xs text-muted-foreground font-normal">
                Optional
              </span>
            </Label>
            <Input
              name="contact"
              placeholder="WhatsApp or email — only if you want a follow-up."
              value={details.contact}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="summary">In one line, what's this about?</Label>
            <Input
              name="summary"
              placeholder="A short summary of your submission"
              value={details.summary}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="details">Tell us more</Label>
            <Textarea
              name="details"
              placeholder={
                submissionType
                  ? PLACEHOLDERS[submissionType as SubmissionType]
                  : "Tell us everything we need to know..."
              }
              value={details.details}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="attachment"
              className="flex items-center justify-between"
            >
              Attachment
              <span className="text-xs text-muted-foreground font-normal">
                Optional (Max 5MB)
              </span>
            </Label>
            <Input
              name="attachment"
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-gold text-white hover:bg-gold/90 rounded-full"
            onClick={submit}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaSubmission;
