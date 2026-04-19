import { defineField, defineType } from "sanity";
import author from "./author";

export default defineType({
  name: "impactStory",
  title: "Impact Stories",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The headline of the impact story",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier — generated from the title",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "A short summary of the story (150–200 characters)",
      rows: 3,
    }),
    defineField({
      name: "communitySlug",
      title: "Community Slug",
      type: "string",
      description:
        "The slug of the community this story belongs to (must match the community slug from the backend). Leave blank for general stories.",
    }),
    defineField({
      name: "communityName",
      title: "Community Name",
      type: "string",
      description: "Display name of the community (e.g. GDG Babcock, BUCC)",
    }),
    defineField({
      name: "date",
      title: "Published Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "mainImage",
      title: "Cover Image",
      type: "image",
      description: "A cover photo for this story. Recommended size 1200 × 750",
      options: {
        hotspot: true,
        metadata: ["lqip"],
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: author.name }],
      description: "The author / contributor of this story",
    }),
    defineField({
      name: "body",
      title: "Story Body",
      type: "blockContent",
      description: "Full story content",
    }),
    defineField({
      name: "isPublished",
      title: "Publish Story",
      type: "boolean",
      description: "Tick to make this story publicly visible",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Feature this story at the top of the impact stories feed",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      isPublished: "isPublished",
      date: "date",
      media: "mainImage",
      communityName: "communityName",
    },
    prepare: (selection) => {
      const { isPublished, date, communityName } = selection;
      const community = communityName ? `• ${communityName}` : "";
      return {
        ...selection,
        subtitle: isPublished
          ? `${new Date(date).toDateString()} ${community}`
          : `Draft ${community}`,
      };
    },
  },
});
