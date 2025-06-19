"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// import { generateThumnailJob } from "@/actions/video-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { ResponsiveModal } from "../../components/navbar/resposive-dialog"; 

interface ThumbnailCreateModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10, "Minimum 10 words"),
});

const ThumbnailCreateModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailCreateModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const router = useRouter();
  const onsubmit = (values: z.infer<typeof formSchema>) => {
    try {
      handleGenerateTumbnail(videoId, values.prompt);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating thumbnail:", error);
    }
  };

  const handleGenerateTumbnail = (videoId: string, prompt: string) => {
    console.log(videoId, prompt);
    startTransition(async () => {
      try {
        // await generateThumnailJob(videoId, prompt);
        toast.success("Thumbnail generation started! It can take few second");
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.error("Failed to trigger AI thumbnail generation");
      }
    });
  };

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
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
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none"
                    placeholder="Describe the thumbnail you want to generate"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Generate</Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

export default ThumbnailCreateModal;
