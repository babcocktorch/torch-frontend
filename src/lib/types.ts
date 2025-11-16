import { PortableTextBlock } from "next-sanity";

export type AuthorType = {
  _id: string;
  name: string;
  slug: string;
  image?: any;
  bio?: PortableTextBlock[];
};

export type PostType = {
  _id: string;
  title: string;
  slug: string;
  mainImage: any;
  description: string;
  date: string;
  isPublished: boolean;
  featured: boolean;
  isPost: boolean;
  author: {
    name: string;
    slug?: string;
    image?: any;
  };
  categories: {
    title: string;
  }[];
  body: PortableTextBlock[];
};

export type PostProps = {
  post: PostType;
};

export type ColorScheme = {
  backgroundColor: string;
  textColor: string;
};

export type SharePostProps = {
  title: string;
  slug: string;
  description: string;
  date: string;
};
