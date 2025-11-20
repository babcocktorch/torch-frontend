"use client";

import { IMAGES, PAGES, SOCIAL_MEDIA } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { app_theme } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Footer = () => {
  const theme = useAtomValue(app_theme);
  const [email, setEmail] = useState("");

  const logo =
    theme === "dark"
      ? IMAGES.logos.engravers_old_eng_white
      : IMAGES.logos.big_moore_gold;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Subscribe:", email);
  };

  return (
    <footer className="w-full dark:bg-black bg-white py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-start mb-8">
          <Link href={PAGES.home}>
            <Image
              src={logo.src}
              alt="The Babcock Torch"
              width={logo.width}
              height={logo.height}
              className={cn("w-96 h-auto", theme === "dark" ? "mb-0" : "mb-3")}
            />
          </Link>
          <p className="text-sm text-muted-foreground font-miller italic">
            To Illuminate is To Imagine
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-12" />

        {/* Four Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Sections Column */}
          <div>
            <h3 className="font-semibold text-base mb-6">Sections</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href={PAGES.home} className="hover:opacity-70 transition">
                  News
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.opinions}
                  className="hover:opacity-70 transition"
                >
                  Opinions
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.communities}
                  className="hover:opacity-70 transition"
                >
                  Communities
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.business}
                  className="hover:opacity-70 transition"
                >
                  Business
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.vendors}
                  className="hover:opacity-70 transition"
                >
                  Vendors
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.masthead}
                  className="hover:opacity-70 transition"
                >
                  Masthead
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="hover:opacity-70 transition">
                  Ask the Torch AI
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-base mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="mailto:advertising@babcocktorch.com"
                  className="hover:opacity-70 transition"
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-70 transition">
                  Donate to The Torch
                </Link>
              </li>
              <li>
                <Link href={PAGES.tips} className="hover:opacity-70 transition">
                  Send an Anonymous News Tip
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:editorial@babcocktorch.com"
                  className="hover:opacity-70 transition"
                >
                  Contact the Newsroom
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:opinions@babcocktorch.com"
                  className="hover:opacity-70 transition"
                >
                  Contact the Opinions Team
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:dev@babcocktorch.com"
                  className="hover:opacity-70 transition"
                >
                  Report a Vulnerability
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Policy Column */}
          <div>
            <h3 className="font-semibold text-base mb-6">Editorial Policy</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href={PAGES.policy + "#corrections"}
                  className="hover:opacity-70 transition"
                >
                  Request a Correction
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.policy + "#ethics"}
                  className="hover:opacity-70 transition"
                >
                  Ethics Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.policy + "#licensing"}
                  className="hover:opacity-70 transition"
                >
                  Licensing
                </Link>
              </li>
              <li>
                <Link
                  href={PAGES.policy + "#legal"}
                  className="hover:opacity-70 transition"
                >
                  Legal & Copyright
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-base mb-6">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground mb-6">
              <li>Babcock University, Ilishan-Remo, Ogun</li>
              <li>
                <a
                  href="mailto:editor@babcocktorch.com"
                  className="hover:opacity-70 transition"
                >
                  editor@babcocktorch.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+2349164554748"
                  className="hover:opacity-70 transition"
                >
                  +234 916 455 4748
                </a>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 mb-6">
              {SOCIAL_MEDIA.map((item) => (
                <a
                  href={item.url}
                  key={item.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition"
                >
                  <item.icon size={20} />
                </a>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button className="bg-gold text-white hover:bg-gold/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            babcocktorch.com © {new Date().getFullYear()} The Babcock Torch
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
