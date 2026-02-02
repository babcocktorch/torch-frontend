"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { ADMIN_PAGES, IMAGES, PAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Home,
  Users,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: ADMIN_PAGES.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: "Articles",
    href: ADMIN_PAGES.articles,
    icon: FileText,
  },
  {
    title: "Communities",
    href: ADMIN_PAGES.communities,
    icon: Users,
  },
  {
    title: "Submissions",
    href: ADMIN_PAGES.submissions,
    icon: Inbox,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <Link href={ADMIN_PAGES.dashboard} className="flex items-center gap-3">
          <Image
            src={IMAGES.logos.logo.src}
            alt="The Babcock Torch"
            width={40}
            height={40}
          />
          <div>
            <p className="font-semibold text-sm">The Babcock Torch</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 space-y-3">
        {/* Back to site */}
        <Link
          href={PAGES.home}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Site
        </Link>

        <Separator />

        {/* User info */}
        {admin && (
          <div className="px-3 py-2">
            <p className="text-sm font-medium truncate">{admin.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {admin.email}
            </p>
          </div>
        )}

        {/* Logout button */}
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
