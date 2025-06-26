import { HeartPlusIcon, ListPlusIcon, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
// import { toast } from "sonner";

// import { PlaylistAddModal } from "@/components/playlist-add-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoMenuProps {
  videoId: string;
  // variant?: "ghost" | "outline";
  onRemove?: () => void;
}

const VideoMenu = ({
  videoId,

  onRemove,
}: VideoMenuProps) => {
  const [openPlaylistModal, setOpenPlaylistModal] = useState(false);

  console.log(videoId, openPlaylistModal);
  return (
    <>
      {/* <PlaylistAddModal
        videoId={videoId}
        open={openPlaylistModal}
        onOpenChange={setOpenPlaylistModal}
      /> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="cursor-pointer">
            <span>Save</span>
            <HeartPlusIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
