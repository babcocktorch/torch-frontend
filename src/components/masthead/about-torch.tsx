"use client";

import ReactMarkdown from "react-markdown";

const ABOUT_MARKDOWN = `
# THE BABCOCK TORCH
**Babcock University's First Independent Student Media Platform**

## WHAT IS THE TORCH
**The Torch, Explained**

The Babcock Torch is Babcock University's first independent student media platform. We report on campus news, publish student opinion and creative work, spotlight student communities and organisations, and document the intellectual and cultural life of this university.

We are not a university bulletin. We do not speak for administration. We speak for the record.

Our home is babcocktorch.com.

## BRIEF HISTORY
**How We Got Here**

Babcock University has a story worth telling. Its alumni founded Paystack. Its campus hosted NVIDIA, making it the first Nigerian university to do so. Its students are building companies, leading movements, and producing work that matters far beyond Ilishan-Remo.

Most of it went unrecorded.

The Babcock Torch was founded to fix that. We launched the platform in April 2026 with a founding team of editors, developers, designers, and writers committed to building a publication with the rigour and independence that Babcock's story deserves. From the start, editorial independence was written into the platform's constitution as a permanent, unamendable principle.

The Torch is the first student media organisation at this university built to outlast its founders.

## OUR MISSION
**What We Are Here to Do**

To document, amplify, and connect.

We report what happens at Babcock with accuracy and without interference. We give students, faculty, alumni, and communities a platform where their work, ideas, and voices are taken seriously. We keep the record.

## OUR VISION
**Where We Are Going**

A Babcock where excellence is never anonymous. Where the student who ships a product, writes a novel, or leads a movement at 20 is on the record. Where the history of this university is written by the people who lived it.

The Torch is the living archive of that history.

## WHAT WE COVER
**Our Coverage Areas**

Campus news and institutional affairs. Student innovation and entrepreneurship. Arts, culture, and creative expression. Opinion and commentary. Faith and community life. Student organisations and clubs. Sports. Alumni. If it happens at Babcock and it matters, we cover it.

## EDITORIAL INDEPENDENCE
**Our Independence Policy**

The Torch operates with full editorial independence. No university body, administrator, or sponsor directs our coverage. Our Staff Advisor holds a defined, limited advisory role. All editorial decisions rest with the editorial board.

This is not a policy we can waive. It is written into our founding constitution.

## CONTRIBUTE
**Write for The Torch**

The Torch publishes student reporters, essayists, columnists, and contributors across every section. If you have a story, a take, or a skill, we want to hear from you.

Send an email to [editor@babcocktorch.com](mailto:editor@babcocktorch.com)

## CONTACT
**Get in Touch**

For press inquiries, partnerships, and general correspondence:
[editor@babcocktorch.com](mailto:editor@babcocktorch.com)

---

© 2026 The Babcock Torch · Ilishan-Remo, Ogun State, Nigeria · babcocktorch.com
`;

export default function AboutTheTorch() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => (
            <h1
              className="text-3xl sm:text-4xl font-miller font-bold mb-2 text-foreground"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="text-xl sm:text-2xl font-miller font-bold mt-10 mb-2 text-gold tracking-wide uppercase"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="text-lg sm:text-xl font-semibold mt-6 mb-3 text-foreground"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p
              className="mb-6 text-foreground/85 leading-relaxed text-base sm:text-lg"
              {...props}
            />
          ),
          ul: ({ ...props }) => (
            <ul
              className="list-disc pl-6 mb-6 text-foreground/85 space-y-2"
              {...props}
            />
          ),
          li: ({ ...props }) => <li {...props} />,
          a: ({ ...props }) => (
            <a className="text-gold hover:underline font-medium" {...props} />
          ),
          strong: ({ ...props }) => (
            <strong
              className="font-semibold text-foreground block mb-2"
              {...props}
            />
          ),
          hr: ({ ...props }) => (
            <hr className="my-10 border-border" {...props} />
          ),
        }}
      >
        {ABOUT_MARKDOWN}
      </ReactMarkdown>
    </div>
  );
}
