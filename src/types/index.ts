import { Dislike, Like, User, Video } from "@/generated";


export interface VideoWithUser extends Video {
    user: User;
    likes: Like[];
    dislikes: Dislike[];
    _count: {
      likes: number;
      dislikes: number;
    };
  }

export type UploadFileResponse<TServerOutput> = {
  name: string;             // Name of the uploaded file
  size: number;             // Size of the file in bytes
  key: string;              // A unique key for the file
  ufsUrl: string;           // The updated URL to access the uploaded file (replacing `url` in newer versions)
  customId: string | null;  // Optional custom ID for your application
  serverData: TServerOutput; // Custom data returned from the `onUploadComplete` callback
};



