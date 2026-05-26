import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryAlbum",
  title: "Gallery Albums",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Events", value: "Events" },
          { title: "Campus Life", value: "Campus Life" },
          { title: "Sports", value: "Sports" },
          { title: "Communities", value: "Communities" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photoCount",
      title: "Photo Count",
      type: "number",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Link to Google Drive or Google Photos",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "coverImage",
    },
    prepare(selection) {
      const { title, category, media } = selection;
      return {
        title,
        subtitle: category,
        media,
      };
    },
  },
});
