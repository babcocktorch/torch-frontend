"use client";

import { IMAGES, PAGES, SOCIAL_MEDIA } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { app_theme } from "@/lib/atoms";
import { useAtomValue } from "jotai";

const Footer = () => {
  const theme = useAtomValue(app_theme);

  const logo =
    theme === "dark" ? IMAGES.logos.logo_white : IMAGES.logos.logo_gold;

  return (
    <footer className="w-full py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Socials */}
          <div className="flex flex-col items-start gap-4">
            <Link href={PAGES.home}>
              <Image
                src={logo.src}
                alt="The Babcock Torch"
                width={logo.width}
                height={logo.height}
                className="w-32 h-auto"
              />
            </Link>
            <p className="font-miller text-2xl font-semibold">
              The Babcock Torch
            </p>
            <p className="text-sm text-muted-foreground italic font-miller">
              To Illuminate is To Imagine
            </p>
            <div className="flex items-center gap-4 mt-2">
              {SOCIAL_MEDIA.map((item) => (
                <a href={item.url} key={item.name} target="_blank">
                  <item.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Details</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Babcock University, Ilishan-Remo, Ogun State.</li>
              <li>
                <a
                  href="mailto:editor@babcocktorch.com"
                  className="hover:text-primary"
                >
                  editor@babcocktorch.com
                </a>
              </li>
              <li>
                <a href="tel:+2349164554748" className="hover:text-primary">
                  +234 916 455 4748
                </a>
              </li>

              <li className="mt-12">
                <a href="#" className="hover:text-primary font-medium">
                  Ask The Torch AI
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-primary font-medium">
                  Masthead
                </a>
              </li>
            </ul>
          </div>

          {/* Sections */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Sections</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "News",
                "Breaking",
                "Opinions",
                "Blogs",
                "Communities",
                "Business",
                "Vendors",
                "Alumni",
                "Calendar",
                "Maps",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                // "Ask The Torch AI",
                // "Masthead",
                "Advertise",
                "Donate to The Torch",
                "Send a News Tip",
                "Contact the Newsroom",
                "Contact the Opinions Team",
                "Request a Correction",
                "Report a Vulnerability",
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-muted pt-8 text-center text-sm text-muted-foreground">
          <p>
            babcocktorch.com © {new Date().getFullYear()} The Babcock Torch
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
