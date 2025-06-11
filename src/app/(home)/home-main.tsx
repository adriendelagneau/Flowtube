import React from "react";

import VideoCard from "@/components/cards/video-card";
import { VideoWithUser } from "@/types";

type HomeMainProps = {
  videos: VideoWithUser[];
};

const HomeMain = ({ videos }: HomeMainProps) => {
  return (
    <div>
      {videos.map((video) => (
        <div key={video.id}>
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
};

export default HomeMain;
