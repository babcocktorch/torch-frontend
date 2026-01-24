"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp, Loader2 } from "lucide-react";
import { sendTorchAIMessage } from "@/lib/requests";
import ReactMarkdown from "react-markdown";
import slugify from "slugify";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const TorchAIChatInterface = () => {
  const [message, setMessage] = useState("");
  const [greeting, setGreeting] = useState("Good evening");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const uniqueId = slugify(window.navigator.userAgent) + Date.now()

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");

    // Add user message to chat
    const userChatMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userChatMessage]);

    setIsLoading(true);

    const response = await sendTorchAIMessage(userMessage, uniqueId);

    if (response.error) {
      // Add error message as assistant response
      const errorMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.error,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } else if (response.data) {
      // Add AI response to chat
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col flex-1 w-full h-full min-h-0 overflow-hidden">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!hasMessages ? (
          // Welcome screen when no messages
          <div className="flex flex-col items-center justify-center h-full px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl mb-3 font-miller">
                {greeting}
              </h1>
              <p className="text-muted-foreground text-lg">
                Ask me about Babcock news, clubs, and events.
              </p>
            </div>
          </div>
        ) : (
          // Chat messages
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl",
                    msg.role === "user"
                      ? "bg-gold text-white rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  )}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm sm:text-base whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  ) : (
                    <div className="text-sm sm:text-base prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-2 prose-strong:font-semibold">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Section - Fixed at bottom */}
      <div className="border-t bg-background px-4 py-4">
        <div className="max-w-3xl mx-auto">
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
                disabled={isLoading}
              />

              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || isLoading}
                className={cn(
                  "rounded-lg w-9 h-9 shrink-0 transition-colors",
                  message.trim() && !isLoading
                    ? "bg-gold hover:bg-gold/90 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5" />
                )}
              </Button>
            </div>
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-3">
            The Torch&apos;s AI is in beta and can make mistakes, as time goes
            on it&apos;ll get better. But for now, verify information by
            referencing provided sources for each answer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TorchAIChatInterface;
