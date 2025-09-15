export interface Comment {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  content: string;
  productId: {
    _id: string;
    title: string;
    slug: string;
  };
  rating?: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  isReply?: boolean;
  status?: string;
}
