"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createChannel } from "@/actions/channel-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Channel {
  id: string;
  name: string;
}

interface ChannelSelectorProps {
  channels: Channel[];
  currentchannelId: string;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ChannelSelector({
  channels,
  currentchannelId,
}: ChannelSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentchannelId);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  const handleChange = (channelId: string) => {
    if (channelId === "new") {
      setOpen(true);
      return;
    }

    setSelected(channelId);
    startTransition(() => {
      router.push(`/studio/${channelId}`);
    });
  };

  const handleCreate = (data: FormData) => {
    startTransition(async () => {
      try {
        const newChannel = await createChannel(data);
        toast.success("Channel created");
        setOpen(false);
        form.reset();
        router.push(`/studio/${newChannel.id}`);
        router.refresh();
      } catch (error) {
        toast.error("Failed to create channel");
        console.error(error);
      }
    });
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Create a New Channel</DialogTitle>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-4"
          >
            <div>
              <Label>Name</Label>
              <Input {...form.register("name")} disabled={isPending} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                {...form.register("description")}
                disabled={isPending}
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
