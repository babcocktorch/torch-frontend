import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = "community-assets";

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_BANNER_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

/**
 * Upload a community image (logo or banner) to Supabase Storage.
 * Returns the public URL on success or throws an error.
 */
export async function uploadCommunityImage(
  file: File,
  type: "logo" | "banner",
): Promise<string> {
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload a JPEG, PNG, WebP, SVG, or GIF image.",
    );
  }

  // Validate file size
  const maxSize = type === "logo" ? MAX_LOGO_SIZE : MAX_BANNER_SIZE;
  const maxLabel = type === "logo" ? "2MB" : "5MB";
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size for ${type} is ${maxLabel}.`);
  }

  // Generate a unique path: logos/1234567890-filename.png
  const ext = file.name.split(".").pop() || "png";
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 40);
  const path = `${type}s/${Date.now()}-${safeName}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return publicUrl;
}

/**
 * Delete a community image from Supabase Storage by its public URL.
 * Silently fails — deletion is best-effort.
 */
export async function deleteCommunityImage(publicUrl: string): Promise<void> {
  try {
    // Extract the path from the public URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/community-assets/<path>
    const url = new URL(publicUrl);
    const pathPrefix = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const idx = url.pathname.indexOf(pathPrefix);
    if (idx === -1) return;

    const filePath = url.pathname.slice(idx + pathPrefix.length);
    await supabase.storage.from(BUCKET_NAME).remove([filePath]);
  } catch {
    // Best-effort deletion
  }
}
