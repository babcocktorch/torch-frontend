"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp } from "lucide-react";

const TorchAIChatInterface = () => {
  const [message, setMessage] = useState("");
  const [greeting, setGreeting] = useState("Good evening");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // TODO: Implement API call when ready
    console.log("Message submitted:", message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl mx-auto px-4 py-8">
      {/* Greeting Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl mb-3 font-miller">{greeting}</h1>
        <p className="text-muted-foreground text-lg">
          Ask me about Babcock news, clubs, and events.
        </p>
      </div>

      {/* Chat Input Section */}
      <div className="w-full">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl border">
            <Plus className="w-5 h-5 text-muted-foreground shrink-0" />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to know?"
              className="flex-1 bg-transparent border-none outline-none resize-none text-base placeholder:text-muted-foreground min-h-[24px] max-h-[200px] leading-6"
              rows={1}
            />

            <Button
              type="submit"
              size="icon"
              disabled={!message.trim()}
              className={cn(
                "rounded-lg w-9 h-9 shrink-0 transition-colors",
                message.trim()
                  ? "bg-gold hover:bg-gold/90 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
        </form>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center mt-4 max-w-xl mx-auto">
          The Torch&apos;s AI is in beta and can make mistakes, as time goes on
          it&apos;ll get better. But for now, verify information by referencing
          provided sources for each answer.
        </p>
      </div>
    </div>
  );
};

export default TorchAIChatInterface;
