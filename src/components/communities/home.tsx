"use client";

import { Community } from "@/lib/types";
import { domine } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PAGES } from "@/lib/constants";
import { Users, ArrowRight } from "lucide-react";

const CommunitiesHome = ({ communities }: { communities: Community[] }) => {
  return (
    <main className="w-full mb-8">
      {/* Hero Section */}
      <div className="bg-gold dark:bg-gold/10 px-8 mb-8">
        <div className="w-full py-12 max-w-7xl mx-auto relative overflow-hidden flex flex-col gap-4 items-center md:items-start justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl z-30 text-white font-semibold font-miller">
            Communities
          </h1>
          <p className="text-white/90 text-lg max-w-2xl z-30">
            Discover campus organizations, clubs, and groups. Stay updated with
            their latest news, events, and announcements.
          </p>
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto">
        {/* Communities Grid */}
        {communities.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">
              No communities available at the moment.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Check back later for campus organizations and groups.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={PAGES.community(community.slug)}
                className="group"
              >
                <article className="border rounded-lg p-6 h-full flex flex-col gap-4 hover:border-gold hover:shadow-md transition-all duration-200">
                  {/* Logo */}
                  <div className="flex items-center gap-4">
                    {community.logoUrl ? (
                      <Image
                        src={community.logoUrl}
                        alt={community.name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
                        <Users className="w-7 h-7 text-gold" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2
                        className={cn(
                          domine.className,
                          "text-lg font-semibold group-hover:text-gold transition-colors truncate"
                        )}
                      >
                        {community.name}
                      </h2>
                      {community._count && (
                        <p className="text-sm text-muted-foreground">
                          {community._count.submissions}{" "}
                          {community._count.submissions === 1
                            ? "post"
                            : "posts"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {community.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
                      {community.description}
                    </p>
                  )}

                  {/* View Link */}
                  <div className="flex items-center text-sm text-gold font-medium mt-auto">
                    View Community
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 border-t pt-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className={cn(domine.className, "text-2xl font-semibold mb-4")}>
              Want Your Community Featured?
            </h2>
            <p className="text-muted-foreground mb-6">
              If you&apos;re part of a campus organization, club, or group and
              want to share your news, events, and announcements with the
              Babcock community, reach out to The Torch team.
            </p>
            <a
              href="mailto:babcocktorch@gmail.com?subject=Community Feature Request"
              className="inline-flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-full font-medium hover:bg-gold/90 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CommunitiesHome;
