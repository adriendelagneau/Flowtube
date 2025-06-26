import { CommentDislike, CommentLike, Prisma, User, Video } from "@/lib/generated/prisma";

export type VideoWithUser = Prisma.VideoGetPayload<{
  include: {
    channel: {
      include: {
        user: true;
      };
    };
    likes: true;
    dislikes: true;
    _count: true;
  };
}> & {
  subscription: boolean;
};


export interface VideoWithChannelAndCount extends Video {
  channel: User;
}
export type UploadFileResponse<TServerOutput> = {
  name: string;             // Name of the uploaded file
  size: number;             // Size of the file in bytes
  key: string;              // A unique key for the file
  ufsUrl: string;           // The updated URL to access the uploaded file (replacing `url` in newer versions)
  customId: string | null;  // Optional custom ID for your application
  serverData: TServerOutput; // Custom data returned from the `onUploadComplete` callback
};

export interface FullComment {
  id: string;
  userId: string;
  videoId: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean;
    image: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  commentLikes: CommentLike[];
  commentDislikes: CommentDislike[];
  replies: FullComment[]; // <-- recursive field for nested replies
  _count: {
    commentLikes: number;
    commentDislikes: number;
  };
}
