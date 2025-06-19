"use client";

import { Loader2Icon, PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

import { createVideo } from "@/actions/video-actions";
import { Button } from "@/components/ui/button";

import { ResponsiveModal } from "./resposive-dialog";
import { StudioUploader } from "./studio-uploader";

const StudioUploadModal = () => {
  const router = useRouter();
  const params = useParams();
  const channelId = params?.channelId as string;
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreateVideo = async () => {
    startTransition(async () => {
      try {
        const { video, url } = await createVideo(channelId);
        setVideoId(video.id);
        setUploadUrl(url);
        toast.success("Video created");
      } catch (error) {
        console.log(error);
        toast.error("Failed to create video");
      }
    });
  };

  const onSuccess = () => {
    if (!videoId) return;
    router.replace(`/studio/video/${videoId}`);
  };

  return (
    <>
      <ResponsiveModal
        title="Upload video"
        open={!!uploadUrl}
        onOpenChange={() => setUploadUrl(null)}
      >
        {uploadUrl ? (
          <StudioUploader endpoint={uploadUrl} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsiveModal>

      <Button
        onClick={handleCreateVideo}
        disabled={isPending}
        asChild
        variant="ghost"
        className="sm:variant-outline cursor-pointer sm:border sm:px-4 sm:py-2"
        aria-label="Create New Content"
      >
        <span className="hidden items-center sm:flex">
          <PlusIcon strokeWidth={1} className="mr-1 h-4 w-4" />
          Create
        </span>
      </Button>
    </>
  );
};

export default StudioUploadModal;
