import React from "react";

import { getCategories } from "@/actions/category-actions"; 
import { getVideoById } from "@/actions/video-actions";

import { StudioSingleView } from "./studio-single-section";

interface SingleVideoProps {
  params: Promise<{ videoId: string }>;
}

const SingleVideoPage = async ({ params }: SingleVideoProps) => {
  const { videoId } = await params;

  const video = await getVideoById(videoId);
  const categories = await getCategories();

  if (!video) {
    return <p>Video not found</p>;
  }

  return (
    <div className="p-3">
      <StudioSingleView video={video} categories={categories} />
    </div>
  );
};

export default SingleVideoPage;
