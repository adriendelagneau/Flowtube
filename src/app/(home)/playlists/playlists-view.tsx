import React from "react";

// import { getUserPlaylists } from "@/actions/playlists-actions";

import { CreatePlaylistButton } from "./create-playlist-button";

const PlaylistsView = async () => {
  // const userPlaylists = await getUserPlaylists();
  return (
    <div>
      <CreatePlaylistButton />
    </div>
  );
};

export default PlaylistsView;
