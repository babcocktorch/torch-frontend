"use client";

import { BASE_URL, PAGES } from "@/lib/constants";
import { SharePostProps } from "@/lib/types";
import { getDayMonthYear } from "@/lib/utils";
import { BiLogoWhatsapp } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

const SharePost = ({ title, slug, description, date }: SharePostProps) => {
  const { day, month, year } = getDayMonthYear(date);

  const post = BASE_URL + PAGES.post(year, month, day, slug);

  const options = [
    {
      icon: FaXTwitter,
      name: "Twitter",
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out this post from @babcocktorch:\n\n"${title}"\n\n${post}`
      )}`,
    },
    // {
    //   icon: BiLogoLinkedinSquare,
    //   name: "LinkedIn",
    //   shareUrl: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    //     BASE_URL + PAGES.post(year, month, day, slug)
    //   )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
    //     `Check out this post from The Babcock Torch: ${description}`
    //   )}`,
    // },
    // {
    //   icon: BiLogoFacebookSquare,
    //   name: "Facebook",
    //   shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    //     BASE_URL + PAGES.post(year, month, day, slug)
    //   )}&quote=${encodeURIComponent(
    //     `Check out this post from The Babcock Torch:\n\n"${title}"\n\n${description}`
    //   )}`,
    // },
    {
      icon: BiLogoWhatsapp,
      name: "WhatsApp",
      shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Check out this post from The Babcock Torch:\n\n"${title}"\n${description}\n\n${post}`
      )}`,
    },
  ];

  const openPopup = (url: string) => {
    window.open(
      url,
      "Social Share",
      "width=600,height=600,resizable=yes,scrollbars=yes,status=yes"
    );
  };

  return (
    <section className="border-b pb-6">
      <h3 className="lg:text-lg font-semibold tracking-tight mb-4">
        Share this post
      </h3>

      <div className="flex flex-wrap items-center gap-2 tracking-tight">
        {options.map((data, id) => (
          <button
            key={id}
            onClick={() => openPopup(data.shareUrl)}
            title={`Share to ${data.name}`}
            aria-label={`Share to ${data.name}`}
            className="w-12 h-12 p-2 grid place-content-center text-2xl rounded-md border cursor-pointer"
          >
            <data.icon aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default SharePost;
