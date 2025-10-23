import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MAJOR_CATEGORIES } from "@/lib/constants";
import { Menu } from "lucide-react";
import { Input } from "../ui/input";

const Sidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="w-5 h-auto dark:text-white text-black cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader></SheetHeader>
        <div className="flex flex-col gap-2 p-4">
          <Input
            placeholder="Search"
            className="w-full justify-start bg-muted dark:text-white text-black"
          />

          {MAJOR_CATEGORIES.map((c, i) => (
            <Button
              key={i}
              className="w-full justify-start bg-transparent hover:bg-muted text-black dark:text-white"
            >
              {c}
            </Button>
          ))}

          <Button className="mt-4 block lg:hidden w-full justify-start dark:bg-white dark:text-black text-white bg-black">
            Talk to the Torch
          </Button>
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
