import React from "react";

import { getUser } from "@/lib/auth/auth-session";

const StudioPage = async () => {
  const user = await getUser();
  console.log(user);
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Channel content</h1>
        <p className="text-muted-foreground text-xs">
          Manage your channel content and videos
        </p>
      </div>
    </div>
  );
};

export default StudioPage;
