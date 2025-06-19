"use client";

import { useRouter } from "next/navigation";

import { updateVideoThumbnail } from "@/actions/video-actions";
import { UploadDropzone } from "@/lib/uploadThing";
import { UploadFileResponse } from "@/types";

import { ResponsiveModal } from "../../components/navbar/resposive-dialog";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUploadComplete = async (res: UploadFileResponse<any>[]) => {
    console.log(res);
    try {
      await updateVideoThumbnail(videoId, res[0].ufsUrl);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating thumbnail:", error);
    }
  };

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};

export default ThumbnailUploadModal;
