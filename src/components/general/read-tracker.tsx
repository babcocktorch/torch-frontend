"use client";

import { useEffect } from "react";
import { trackArticleRead } from "@/lib/requests";

interface ReadTrackerProps {
  slug: string;
}

/**
 * Silent component that tracks article reads on mount.
 * Renders nothing — fire-and-forget.
 */
const ReadTracker = ({ slug }: ReadTrackerProps) => {
  useEffect(() => {
    trackArticleRead(slug);
  }, [slug]);

  return null;
};

export default ReadTracker;
