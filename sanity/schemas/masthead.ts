import { defineField, defineType } from "sanity";

const BOARD_CATEGORIES = [
  { title: "Advisory Board", value: "advisory-board" },
  { title: "Editorial Board", value: "editorial-board" },
  { title: "Technology & Product", value: "technology-product" },
  { title: "Business Board", value: "business-board" },
  { title: "Operations & Administration", value: "operations-administration" },
  {
    title: "Media, Marketing & Communications",
    value: "media-marketing-communications",
  },
];

export default defineType({
  name: "Masthead",
  title: "Masthead Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      description: "e.g. Editor-in-Chief, Managing Editor, etc.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "board",
      title: "Board Category",
      type: "string",
      options: {
        list: BOARD_CATEGORIES,
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "guard",
      title: "Guard",
      type: "reference",
      to: [{ type: "mastheadGuard" }],
      description: "Which guard/era this member belongs to",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first within the same board",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "position",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Board, then Order",
      name: "boardOrder",
      by: [
        { field: "board", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
