export interface Comment {
  productSlug: string;
  userId: string;
  content: string;
  rating: string;
  parentId: string | null;
  status: string;
}

export interface CommentDisplay {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  comment: string;
  timestamp: string;
  replies: ReplyDisplay[];
  userId?: string;
  status: string;
}

export interface ReplyDisplay {
  id: string;
  name: string;
  comment: string;
  timestamp: string;
  status: string;
}

export interface CommentApiResponse {
  _id: string;
  userId?: { _id: string; name: string };
  rating?: number;
  content: string;
  createdAt: string;
  replies?: ReplyApiResponse[];
  status: string;
}

export interface ReplyApiResponse {
  _id: string;
  userId?: { _id: string; name: string };
  content: string;
  createdAt: string;
  status: string;
}

export interface UpdateCommentData {
  id: string;
  content: string;
  userId: string;
  rating?: number;
  status: string;
}
