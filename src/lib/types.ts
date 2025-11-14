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
  categories: {
    title: string;
  }[];
};

export type ArticleProps = {
  post: PostPreview;
};

export type OpinionPreview = {
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

export type OpinionProps = {
  opinion: OpinionPreview;
};
