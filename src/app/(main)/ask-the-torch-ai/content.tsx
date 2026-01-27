"use client";

import { useState } from "react";
import TorchAISidebar from "@/components/torch-ai/sidebar";
import TorchAIMobileActionBar from "@/components/torch-ai/mobile-action-bar";
import TorchAIWelcomeModal from "@/components/torch-ai/welcome-modal";
import TorchAIFAQs from "@/components/torch-ai/faqs";
import TorchAIChatInterface from "@/components/torch-ai/chat-interface";

const TorchAIPageContent = () => {
  const [faqsOpen, setFaqsOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  const handleNewChat = () => {
    // Increment key to force re-render of chat interface, clearing its state
    setChatKey((prev) => prev + 1);
  };

  const handleOpenFAQs = () => {
    setFaqsOpen(true);
  };

  return (
    <main className="w-full flex flex-col overflow-hidden">
      {/* Welcome Modal */}
      <TorchAIWelcomeModal />

      {/* FAQs Modal */}
      <TorchAIFAQs open={faqsOpen} onOpenChange={setFaqsOpen} />

      {/* Mobile Action Bar - visible only on mobile */}
      <TorchAIMobileActionBar
        onNewChat={handleNewChat}
        onOpenFAQs={handleOpenFAQs}
      />

      {/* Main Content Area - max-width container */}
      <div className="w-full max-w-7xl mx-auto flex flex-1 md:p-4 md:gap-4 overflow-hidden items-stretch min-h-0 md:bg-muted/30">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:flex">
          <TorchAISidebar
            onNewChat={handleNewChat}
            onOpenFAQs={handleOpenFAQs}
          />
        </div>

        {/* Chat Interface */}
        <main className="flex-1 flex flex-col overflow-hidden md:border md:rounded-lg bg-background min-h-0">
          <TorchAIChatInterface key={chatKey} />
        </main>
      </div>
    </main>
  );
};

export default TorchAIPageContent;
