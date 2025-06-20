import { notFound } from "next/navigation";
import React from "react";

import { getChannelVideosPage } from "@/actions/video-actions";

import VideosClient from "./video-client";

interface PageProps {
  params: Promise<{ channelSlug: string }>;
}

export default async function VideosPage({ params }: PageProps) {
  const channel = await params;
  const videos = await getChannelVideosPage(channel.channelSlug, 1);
  if (!videos) notFound();

  return <VideosClient initialPage={videos} slug={channel.channelSlug} />;
}
