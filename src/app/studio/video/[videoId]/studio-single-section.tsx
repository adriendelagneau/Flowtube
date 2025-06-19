"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CopyCheckIcon,
  CopyIcon,
  GlobeIcon,
  ImagePlusIcon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  removeVideo,
  restoreThumbnail,
  // revlidateVideo,
  updateVideo,
} from "@/actions/video-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from "@/components/video-player";
import { THUMBNAIL_FALLBACK } from "@/constants";
import { Category, Video } from "@/lib/generated/prisma";
import { snakeCaseToTitle } from "@/lib/utils";
import { videoUpdateSchema } from "@/lib/zod";

import ThumbnailCreateModal from "./thumbnail-generate-modal";
import ThumbnailUploadModal from "./thumbnail-upload-modal";

interface VideoViewProps {
  video: Video;
  categories: Category[];
}

export const StudioSingleView = ({ video, categories }: VideoViewProps) => {
  const router = useRouter();

  // TODO: Change if not deployed on Vercell
  const fullUrl = `${process.env.NEXT_PUBLIC_URL || "https://flowtube.online"}/video/${video.id}`;
  const [isCopied, setIsCopied] = useState(false);
  const [thumbnailOpen, setThumbnailOpen] = useState(false);
  const [thumbnailGenerateOpen, setThumbnailGenerateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: {
      ...video,
      description: video.description ?? undefined,
      thumbnailUrl: video.thumbnailUrl ?? undefined,
      categoryId: video.categoryId ?? undefined,
    },
  });

  const onCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    startTransition(async () => {
      try {
        await updateVideo(video.id, {
          ...data,
          description: data.description || "",
          categoryId: data.categoryId || "",
        });
        toast("Video updated");
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
      }
    });
  };

  // ✅ Handle video deletion
  const onDelete = () => {
    startTransition(async () => {
      try {
        await removeVideo(video.id);
        toast.success("Video deleted");
        router.push("/studio");
      } catch (err) {
        console.log(err);
        toast("Something went wrong");
      }
    });
  };

  const onRestoreThumbnail = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", video.id);

        await restoreThumbnail(formData);
        toast.success("Thumbnail restored");

        // Optional: You might want to refresh router to update UI
      } catch (err) {
        console.error(err);
        toast.error("Failed to restore thumbnail");
      }
    });
  };

  // const handleGenerateTitle = () => {
  //   startTransition(async () => {
  //     try {
  //       await generateTitle(video.id, "a beautifull video of montains");
  //       toast.success("Thumbnail generation started! It can take few second");
  //       router.refresh();
  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Failed to trigger AI thumbnail generation");
  //     }
  //   });
  // };

  // ✅ Handle video deletion
  const onRevalidate = () => {
    console.log("revalidate");

    // startTransition(async () => {
    //   try {
    //     await revlidateVideo(video.id);
    //     toast.success("Video revaledated");
    //     router.push("/studio");
    //   } catch (err) {
    //     console.log(err);
    //     toast("Something went wrong");
    //   }
    // });
  };

  return (
    <>
      <ThumbnailUploadModal
        open={thumbnailOpen}
        onOpenChange={setThumbnailOpen}
        videoId={video.id}
      />
      <ThumbnailCreateModal
        open={thumbnailGenerateOpen}
        onOpenChange={setThumbnailGenerateOpen}
        videoId={video.id}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Videos details</h1>
              <p className="text-muted-foreground text-xs">
                Mange your video details
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isPending}>
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onRevalidate()}>
                    <RotateCcwIcon className="mr-2 size-4" />
                    Revaledate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete()}>
                    <Trash2Icon className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid-col-1 grid gap-6 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a title to your video"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={6} //  row => no effect ?
                        className="h-56 resize-none pr-10"
                        placeholder="Add a description to your video"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <div className="group relative h-[84px] w-[135px] border p-0.5">
                        <Image
                          src={video.thumbnailUrl || THUMBNAIL_FALLBACK}
                          className="object-cover"
                          fill
                          alt="Thumbnail"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size={"icon"}
                              className="absolute top-1 right-1 size-7 cursor-pointer rounded-full bg-black/50 opacity-100 duration-300 group-hover:opacity-100 hover:bg-black/60"
                            >
                              <MoreVerticalIcon
                                className="text-white"
                                strokeWidth={0.8}
                                size={12}
                              />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem
                              onClick={() => setThumbnailOpen(true)}
                              className="cursor-pointer"
                            >
                              <ImagePlusIcon className="mr-1 size-4" />
                              Change
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => setThumbnailGenerateOpen(true)}
                              className="cursor-pointer"
                            >
                              <SparklesIcon className="mr-1 size-4" />
                              AI-generate
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={onRestoreThumbnail}
                              className="cursor-pointer"
                            >
                              <RotateCcwIcon className="mr-1 size-4" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <Suspense
                fallback={
                  <div className="h-10 w-24 animate-pulse rounded-md bg-blue-500"></div>
                }
              >
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </Suspense>
            </div>
            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex h-fit flex-col gap-4 overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                    autoPlay={false}
                  />
                </div>
                <div className="flex flex-col gap-y-6 p-4">
                  <div className="flex items-center justify-between gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-sm">
                        Video link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link href={`/video/${video.id}`}>
                          <p className="line-clamp-1 text-sm text-blue-500">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"icon"}
                          className="shrink-0"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(video.muxStatus || "preparing")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Subtitle status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(
                          video.muxTrackStatus || "no_subtitles"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex">
                            <GlobeIcon className="mr-2 size-4" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex">
                            <LockIcon className="mr-2 size-4" />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
