"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MAJOR_CATEGORIES } from "@/lib/constants";
import { Menu, Search } from "lucide-react";
import { Input } from "../ui/input";
import IdeaSubmission from "./idea-submission";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Menu className="w-5 h-auto dark:text-white text-black cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader></SheetHeader>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search"
              className="w-full justify-start bg-muted dark:text-white text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={handleSearch}
              className="sm:hidden flex items-center gap-2"
              disabled={!searchTerm.trim()}
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>

          {MAJOR_CATEGORIES.map((c, i) => (
            <Link href={c.href} key={i}>
              <Button
                key={i}
                className="w-full justify-start bg-transparent hover:bg-muted text-black dark:text-white"
              >
                {c.name}
              </Button>
            </Link>
          ))}

          <IdeaSubmission />
        </div>
        {/* <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
