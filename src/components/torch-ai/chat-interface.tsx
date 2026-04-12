"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowUp, Loader2 } from "lucide-react";
import {
  streamTorchAIMessage,
  type TorchAIPersona,
} from "@/lib/requests";
import ReactMarkdown from "react-markdown";

type ThinkingMode = "thinking" | "fast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  thinking?: string;
  thinkingComplete?: boolean;
}

const TorchAIChatInterface = () => {
  const [message, setMessage] = useState("");
  const [greeting, setGreeting] = useState("Good evening");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [webSearch, setWebSearch] = useState(false);
  const [thinkingMode, setThinkingMode] = useState<ThinkingMode>("thinking");
  const [persona, setPersona] = useState<TorchAIPersona>("default");
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingId, scrollToBottom]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning.");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon.");
    } else {
      setGreeting("Good evening.");
    }
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");

    const userChatMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    const assistantId = `assistant-${Date.now()}`;
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      thinkingComplete: false,
    };

    setMessages((prev) => [...prev, userChatMessage, assistantPlaceholder]);
    setIsLoading(true);
    setStreamingId(assistantId);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const { error } = await streamTorchAIMessage({
      message: userMessage,
      webSearch,
      fastMode: thinkingMode === "fast",
      persona,
      signal: abortRef.current.signal,
      onEvent: (ev) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== assistantId) return m;
            if (ev.type === "thinking") {
              return {
                ...m,
                thinking: (m.thinking ?? "") + ev.text,
              };
            }
            if (ev.type === "thought_end") {
              return { ...m, thinkingComplete: true };
            }
            if (ev.type === "content") {
              return { ...m, content: m.content + ev.text };
            }
            return m;
          }),
        );
      },
    });

    if (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: error, thinkingComplete: true }
            : m,
        ),
      );
    }

    setIsLoading(false);
    setStreamingId(null);
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
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-36">
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
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg) => {
              const isStreamingThis = streamingId === msg.id;
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl",
                      msg.role === "user"
                        ? "bg-gold text-white rounded-br-md"
                        : "bg-muted rounded-bl-md",
                    )}
                  >
                    {msg.role === "user" ? (
                      <p className="text-sm sm:text-base whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {msg.thinking ? (
                          <details
                            className="rounded-md bg-background/60 border border-border/60 px-3 py-2 text-left"
                            open={
                              isStreamingThis &&
                              !msg.thinkingComplete &&
                              !msg.content
                            }
                          >
                            <summary className="cursor-pointer text-xs font-medium text-muted-foreground select-none">
                              Thinking
                            </summary>
                            <p className="mt-2 text-xs italic text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {msg.thinking}
                            </p>
                          </details>
                        ) : null}
                        {msg.content ? (
                          <div className="text-sm sm:text-base prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-2 prose-strong:font-semibold">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : isStreamingThis ? (
                          <div className="flex items-center gap-2 py-1">
                            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {msg.thinking ? "Writing answer…" : "Thinking…"}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Section - Fixed at bottom */}
      <div className="border-t bg-background px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Switch
                  id="torch-web-search"
                  checked={webSearch}
                  onCheckedChange={setWebSearch}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="torch-web-search"
                  className="text-muted-foreground font-normal cursor-pointer"
                >
                  Web search
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="torch-thinking-mode" className="text-muted-foreground font-normal shrink-0">
                  Mode
                </Label>
                <Select
                  value={thinkingMode}
                  onValueChange={(v) => setThinkingMode(v as ThinkingMode)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="torch-thinking-mode" className="h-9 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thinking">Thinking</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="torch-persona" className="text-muted-foreground font-normal shrink-0">
                  Tone
                </Label>
                <Select
                  value={persona}
                  onValueChange={(v) => setPersona(v as TorchAIPersona)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="torch-persona" className="h-9 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Friendly</SelectItem>
                    <SelectItem value="authoritative">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                    : "bg-muted text-muted-foreground",
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
