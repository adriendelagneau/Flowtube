/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useTransition, useOptimistic } from "react";
import { toast } from "sonner";

import {
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylistsWithVideoStatus,
} from "@/actions/playlists-actions";
import { ResponsiveModal } from "@/components/resposive-dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

interface PlaylistItem {
  id: string;
  name: string;
  videoIncluded: boolean;
}

export const PlaylistAddModal = ({
  open,
  onOpenChange,
  videoId,
}: PlaylistAddModalProps) => {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticPlaylists, updateOptimistic] = useOptimistic<
    PlaylistItem[],
    { id: string; included: boolean }
  >(playlists, (prev, { id, included }) =>
    prev.map((p) => (p.id === id ? { ...p, videoIncluded: included } : p))
  );

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getPlaylistsWithVideoStatus(videoId)
      .then((data) => {
        setPlaylists(data);
      })
      .catch(() => toast.error("Failed to load playlists"))
      .finally(() => setLoading(false));
  }, [open, videoId]);

  const handleToggle = (playlist: PlaylistItem, newStatus: boolean) => {
    startTransition(() => {
      // Optimistic UI update
      updateOptimistic({ id: playlist.id, included: newStatus });

      // 🔥 Also update the actual source state so the next render matches
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlist.id ? { ...p, videoIncluded: newStatus } : p
        )
      );

      (async () => {
        try {
          if (newStatus) {
            await addVideoToPlaylist(playlist.id, videoId);
          } else {
            await removeVideoFromPlaylist(playlist.id, videoId);
          }
        } catch {
          toast.error("Failed to update playlist");

          // Optionally rollback source state
          setPlaylists((prev) =>
            prev.map((p) =>
              p.id === playlist.id ? { ...p, videoIncluded: !newStatus } : p
            )
          );
        }
      })();
    });
  };

  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4 p-4">
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : optimisticPlaylists.length === 0 ? (
          <p className="text-muted-foreground text-sm">No playlists found.</p>
        ) : (
          optimisticPlaylists.map((playlist) => (
            <label
              key={playlist.id}
              className="flex cursor-pointer items-center gap-3"
            >
              <Checkbox
                checked={playlist.videoIncluded}
                onCheckedChange={(checked) => handleToggle(playlist, !!checked)}
              />
              <span>{playlist.name}</span>
            </label>
          ))
        )}
      </div>
    </ResponsiveModal>
  );
};
