import { Prisma } from "@/lib/generated/prisma";

import {   } from  "@/lib/generated/prisma";

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
}>;

export type UploadFileResponse<TServerOutput> = {
  name: string;             // Name of the uploaded file
  size: number;             // Size of the file in bytes
  key: string;              // A unique key for the file
  ufsUrl: string;           // The updated URL to access the uploaded file (replacing `url` in newer versions)
  customId: string | null;  // Optional custom ID for your application
  serverData: TServerOutput; // Custom data returned from the `onUploadComplete` callback
};


