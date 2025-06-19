"use client";

import { useRouter } from "next/navigation";
import { useState, startTransition } from "react";

// import { createChannel } from "@/actions/channel-actions"; // you must implement this
// import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Channel {
  id: string;
  name: string;
}

interface ChannelSelectorProps {
  channels: Channel[];
  currentChannelId: string;
}

export default function ChannelSelector({
  channels,
  currentChannelId,
}: ChannelSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentChannelId);

const handleChange = (channelId: string) => {
  if (channelId === "new") {
    handleCreate();
    return;
  }

  setSelected(channelId);
  startTransition(() => {
    router.push(`/studio?channel=${channelId}`);
  });
};


  const handleCreate = async () => {
    console.log("handle create channel modal");
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selected} onValueChange={handleChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a channel" />
        </SelectTrigger>
        <SelectContent>
          {channels.map((channel) => (
            <SelectItem key={channel.id} value={channel.id}>
              {channel.name}
            </SelectItem>
          ))}
        <SelectItem value="new">+ New</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
