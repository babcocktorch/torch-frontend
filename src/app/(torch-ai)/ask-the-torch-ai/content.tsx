"use client";

import { useState } from "react";
import TorchAIHeader from "@/components/torch-ai/header";
import TorchAISidebar from "@/components/torch-ai/sidebar";
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
    <div className="w-full min-h-screen flex flex-col bg-muted/30">
      {/* Welcome Modal */}
      <TorchAIWelcomeModal />

      {/* FAQs Modal */}
      <TorchAIFAQs open={faqsOpen} onOpenChange={setFaqsOpen} />

      {/* Header */}
      <TorchAIHeader />

      {/* Main Content Area with padding */}
      <div className="flex flex-1 p-4 gap-4 overflow-hidden">
        {/* Sidebar */}
        <TorchAISidebar onNewChat={handleNewChat} onOpenFAQs={handleOpenFAQs} />

        {/* Chat Interface */}
        <main className="flex-1 flex flex-col overflow-y-auto border rounded-lg bg-background">
          <TorchAIChatInterface key={chatKey} />
        </main>
      </div>
    </div>
  );
};

export default TorchAIPageContent;
