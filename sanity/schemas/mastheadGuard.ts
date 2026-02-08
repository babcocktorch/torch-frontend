import { defineField, defineType } from "sanity";

export default defineType({
  name: "mastheadGuard",
  title: "Masthead Guard",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        'Display title, e.g. "Masthead of The Founding Vanguard"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description: "Unique identifier used in URLs and tab selection",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Tab Label",
      type: "string",
      description:
        'Short label shown on the tab button, e.g. "Founding Vanguard"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "administration",
      title: "Administration Period",
      type: "string",
      description: 'e.g. "2025–2026"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tenure",
      title: "Tenure",
      type: "string",
      description: 'e.g. "Dec 1, 2025—"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorNote",
      title: "Notes From the Editor",
      type: "text",
      description: "Editor's note displayed below the administration info",
    }),
    defineField({
      name: "editorImage",
      title: "Editor Image",
      type: "image",
      description:
        "Image displayed alongside the editor's note",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first in the tabs",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "administration",
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
