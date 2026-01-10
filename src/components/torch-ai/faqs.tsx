"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { domine } from "@/lib/fonts";

interface TorchAIFAQsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FAQS = [
  {
    question: "What is the Torch AI?",
    answer:
      "The Torch AI is an intelligent assistant powered by the Babcock University Knowledge Graph (BUKG). It helps you find information about campus news, events, clubs, and university-related topics.",
  },
  {
    question: "What can the Torch AI help me with?",
    answer:
      "You can ask about campus news, BUSA elections, Vice Chancellor announcements, university policies, curfew times, community events, academic schedules, and more.",
  },
  {
    question: "Are my conversations saved?",
    answer:
      "No, your conversations are not saved. Since there is no authentication, each session starts fresh. When you close the browser or start a new chat, previous conversations are cleared.",
  },
  {
    question: "How accurate is the information?",
    answer:
      "The Torch AI is in beta and may make mistakes. We recommend verifying important information by checking the provided sources or contacting relevant university departments directly.",
  },
  {
    question: "Can I submit story ideas through the Torch AI?",
    answer:
      "While the Torch AI can answer questions, to submit story ideas or tips, please use the 'Talk to the Torch' button in the header to reach our editorial team.",
  },
  {
    question: "What can't the Torch AI do?",
    answer:
      "The Torch AI cannot access personal student records, process official university transactions, or provide legally binding advice. It's designed for informational purposes only.",
  },
];

const TorchAIFAQs = ({ open, onOpenChange }: TorchAIFAQsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={cn("text-2xl", domine.className)}>
            Frequently Asked Questions
          </DialogTitle>
          <DialogDescription>
            Learn more about what the Torch AI can and cannot do.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {FAQS.map((faq, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TorchAIFAQs;

