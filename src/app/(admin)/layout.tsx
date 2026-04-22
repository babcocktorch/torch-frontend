"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ADMIN_PAGES } from "@/lib/constants";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Loader2, Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
      {/* Desktop Sidebar */}
      <AdminSidebar className="hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center h-14 px-4 border-b border-border bg-card sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <AdminSidebar className="w-full border-r-0" />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-sm ml-2">Admin Panel</span>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
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
