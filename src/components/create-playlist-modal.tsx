import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createPlaylist } from "@/actions/playlists-actions";
import { ResponsiveModal } from "@/components/resposive-dialog"; 
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


interface CreatePlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const CreatePlaylistModal = ({
  open,
  onOpenChange,
}: CreatePlaylistModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();
  const onsubmit = (values: z.infer<typeof formSchema>) => {
    try {
      handleCreatePlylist(values.name);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating thumbnail:", error);
    }
  };

  const handleCreatePlylist = (name: string) => {
    startTransition(async () => {
      try {
        await createPlaylist(name);
        toast.success("Playlist create successfully");
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.error("Failed to create playlist");
      }
    });
  };

  return (
    <ResponsiveModal
      title="Ceate a plylist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My favorite videos" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button disabled={form.formState.isSubmitting} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

