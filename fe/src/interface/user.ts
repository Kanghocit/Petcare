export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  phone: string;
  address: string;
  createdAt: string;
  status: string;
  isVerified?: boolean;
  rank: string;
  total_spend?: number;
  userLevel?: string;
  note: string;
}
