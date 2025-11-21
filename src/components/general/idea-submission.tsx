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
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitIdea } from "@/lib/requests";
import { isValidEmail } from "@/lib/utils";
import { Switch } from "../ui/switch";

const IdeaSubmission = () => {
  const [open, setOpen] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    idea: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 25 * 1024 * 1024) {
        toast.error("File size must not exceed 25MB.");
        setFile(null);
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!details.name.trim() || !details.email.trim() || !details.idea.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(details.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", details.name);
    formData.append("email", details.email);
    formData.append("idea", details.idea);
    if (file) {
      formData.append("attachment", file);
    }

    const { error } = await submitIdea(formData);

    setLoading(false);

    if (error) {
      toast.error("Failed to submit idea. Please try again.");
      return;
    }

    toast.success("Idea submitted successfully.");

    setDetails({
      name: "",
      email: "",
      idea: "",
    });
    setFile(null);

    if (fileInputRef.current) fileInputRef.current.value = "";

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          Talk to the Torch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Have an interesting story?</DialogTitle>
          <DialogDescription>Submit an article to the Torch.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex gap-3 items-center justify-start my-4">
            <Switch
              checked={isAnonymous}
              onCheckedChange={(e) => {
                setDetails((prev) => ({
                  ...prev,
                  name: e ? "Anonymous" : "",
                  email: e ? "anonymous@babcocktorch.com" : "",
                }));

                setIsAnonymous(e);
              }}
            />
            <Label htmlFor="isAnonymous">Send anonymously</Label>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              placeholder="John Doe"
              value={details.name}
              onChange={handleChange}
              disabled={isAnonymous}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email">Email address</Label>
            <Input
              name="email"
              placeholder="john.doe@email.com"
              type="email"
              value={details.email}
              onChange={handleChange}
              disabled={isAnonymous}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="idea">Your idea</Label>
            <Textarea
              name="idea"
              placeholder="Type your idea here. Be as descriptive as possible."
              value={details.idea}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="attachment">Attachment (Optional)</Label>
            <Input
              name="attachment"
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
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
