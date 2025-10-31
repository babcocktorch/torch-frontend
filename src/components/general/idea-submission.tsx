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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitIdea } from "@/lib/requests";
import { isValidEmail } from "@/lib/utils";

const IdeaSubmission = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    idea: "",
  });

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

    const { error } = await submitIdea(details);

    setLoading(false);

    if (error) {
      toast.error("Failed to submit idea. Please try again.");
      return;
    }

    toast.success("Idea submitted successfully.");

    setOpen(false);
    setDetails({
      name: "",
      email: "",
      idea: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 block lg:hidden w-full justify-start bg-gold text-white hover:bg-gold/90 rounded-full">
          Talk to the Torch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Have an interesting story?</DialogTitle>
          <DialogDescription>Submit an article to the Torch.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              placeholder="John Doe"
              value={details.name}
              onChange={handleChange}
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
