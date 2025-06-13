"use client";

import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

import { CreatePlaylistModal } from "@/components/create-playlist-modal";
import { Button } from "@/components/ui/button";

export const CreatePlaylistButton = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
      <CreatePlaylistModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Playlist</h1>
          <p className="text-sx text-muted-foreground">
            Collection you have created
          </p>
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          className="cursor-pointer rounded-lg"
          onClick={() => setCreateModalOpen(true)}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};
