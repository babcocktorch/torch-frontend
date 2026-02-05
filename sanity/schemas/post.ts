import {defineField, defineType} from 'sanity'
import author from './author'
import category from './category'

export default defineType({
  name: 'Post',
  title: 'Posts',
  type: 'document',
  // icon: BiBookOpen,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Give your blog post a nice title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Add a slug to your post or generate it from the title',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Summarize your article in 150 - 160 characters',
      rows: 4,
      // validation: (Rule) => [
      //   Rule.required().min(100).error('A description of min 100 characters is required'),
      // ],
    }),
    defineField({
      name: 'isPost',
      title: 'Post or Opinion?',
      type: 'boolean',
      description: 'Tick this if this is an actual post and not an opinion',
    }),
    // defineField({
    //   name: "canonicalLink",
    //   title: "Canonical Link",
    //   type: "url",
    //   description:
    //     "If this post has been shared somewhere else, add a canonical url that links to it.",
    // }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      description: 'Upload an image for this blog post. Recommended size 1200 x 750',
      options: {
        hotspot: true,
        metadata: ['lqip'],
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Feature Post',
      type: 'boolean',
      description: 'Add this post to the list of featured posts',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: category.name}]}],
      // validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: author.name}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Post Body',
      type: 'blockContent',
      description: 'Write your post content here',
    }),
    defineField({
      name: 'isPublished',
      title: 'Publish Post',
      type: 'boolean',
      description: 'Tick this if you will like to publish this post',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isPublished: 'isPublished',
      date: 'date',
      media: 'mainImage',
      isPost: 'isPost',
    },
    prepare: (selection) => {
      const {isPublished, date, isPost} = selection

      const type = isPost ? 'Post' : 'Opinion'

      return {
        ...selection,
        ...date,
        subtitle: isPublished ? `${new Date(date).toDateString()} • ${type}` : `Draft • ${type}`,
      }
    },
  },
})
