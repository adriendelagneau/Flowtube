import {
  ListPlusIcon,
  MoreHorizontalIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";


import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { PlaylistAddModal } from "./playlist-add-modal";

interface VideoMenuProps {
  videoId: string;
  variant?: "ghost" | "outline";
  onRemove?: () => void;
}

const VideoMenu = ({
  videoId,
  variant = "ghost",
  onRemove,
}: VideoMenuProps) => {
  const onShare = () => {
    const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast("Successfull copied");
  };

  const [openPlaylistModal, setOpenPlaylistModal] = useState(false);
  console.log(openPlaylistModal, variant);

  return (
    <>
      {/* <PlaylistAddModal
        videoId={videoId}
        open={openPlaylistModal}
        onOpenChange={setOpenPlaylistModal}
      /> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="cursor-pointer">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={onShare}>
            <ShareIcon className="mr-2 size-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenPlaylistModal(true)}>
            <ListPlusIcon className="mr-2 size-4" />
            Add to playlist
          </DropdownMenuItem>
          {onRemove && (
            <DropdownMenuItem onClick={() => {}}>
              <Trash2Icon className="mr-2 size-4" />
              Remove
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default VideoMenu;
