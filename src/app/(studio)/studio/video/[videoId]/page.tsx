import React from "react";

import { getVideoById } from "@/actions/video-actions"; 
import { StudioSingleView } from "../../components/studio-single-section"; 
import { getCategories } from "@/actions/category-actions";

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
