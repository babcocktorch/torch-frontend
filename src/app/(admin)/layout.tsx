"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ADMIN_PAGES } from "@/lib/constants";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage =
    pathname === ADMIN_PAGES.login || pathname === ADMIN_PAGES.setup;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthPage) {
      router.push(ADMIN_PAGES.login);
    }
  }, [isLoading, isAuthenticated, isAuthPage, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Auth pages don't need sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Protected pages need authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Dashboard layout with sidebar
  return (
    <div className="min-h-screen flex bg-background w-full">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-center" />
      <AuthProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AuthProvider>
    </>
  );
}
