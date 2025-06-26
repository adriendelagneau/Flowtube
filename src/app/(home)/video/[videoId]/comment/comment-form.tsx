"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addComment } from "@/actions/comment-actions";
import { UserAvatar } from "@/app/studio/components/sidebar/user-avatar";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth/auth-client";
import { commentSchema } from "@/lib/zod";

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "comment" | "reply";
}

const CommentForm = ({
  videoId,
  parentId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSuccess,
  onCancel,
  variant = "reply",
}: CommentFormProps) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      parentId: parentId,
      videoId: videoId,
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof commentSchema>) => {
    try {
      addComment(values.videoId, values.content, parentId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="group flex gap-4"
      >
        <UserAvatar
          imageUrl={user?.image || "/user-sm.png"}
        />
        <div className="flex-1">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <Textarea
                {...field}
                className="min-h-0 resize-none overflow-hidden bg-transparent"
                placeholder={
                  variant === "reply"
                    ? "Reply to this comment..."
                    : "Add a comment..."
                }
              />
            )}
          />
          <div className="mt-2 flex justify-end gap-2">
            {onCancel && (
              <Button variant={"ghost"} type="button" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" size={"sm"}>
              {variant === "reply" ? "reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
