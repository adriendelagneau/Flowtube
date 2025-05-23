import React from "react";

import { getUserVideos } from "@/actions/video-actions";

import { StudioSection } from "./components/studio-section";

const StudioPage = async () => {
  const videos = await getUserVideos();
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Channel content</h1>
        <p className="text-muted-foreground text-xs">
          Manage your channel content and videos
        </p>
      </div>
      <StudioSection videos={videos} />
    </div>
  );
};

export default StudioPage;
