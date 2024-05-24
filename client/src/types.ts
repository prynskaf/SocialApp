export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  imageUrls?: string[];
  emailAddress: string;
}

export interface Post {
  _id: string;
  user: User;
  content: string;
  imageUrls: string[];
  comments: Comment[];
  likes: Array<{ _id: string }>;
  timestamp: string;
  __v: number;
}

export interface Comment {
  _id: string;
  user: string;
  post: string;
  content: string;
  timestamp: string;
  __v: number;
}
