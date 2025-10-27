export type PostPreview = {
  _id: string;
  title: string;
  slug: string;
  mainImage: any;
  description: string;
  publishedAt: string;
  author: {
    name: string;
  };
};

export type ArticleProps = {
  post: PostPreview;
};
