export interface News {
    _id: string;
    title: string;
    content: string;
    author: string;
    publishTime: string;
    status: string;
    blocks: {
      text: string;
      image: string;
    }[];
    image: string;
    slug: string;
    createdAt: string;
}