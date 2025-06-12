"use client";

import { CopyIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  WhatsappShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailShareButton,
  RedditShareButton,
  TelegramShareButton,
  PocketShareButton,
  ThreadsShareButton,
  TumblrShareButton,
  ViberShareButton,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  EmailIcon,
  PocketIcon,
  ThreadsIcon,
  TumblrIcon,
  ViberIcon,
} from "react-share";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const socials = [
  {
    Component: TwitterShareButton,
    Icon: TwitterIcon,
    name: "Twitter",
  },
  {
    Component: WhatsappShareButton,
    Icon: WhatsappIcon,
    name: "WhatsApp",
  },
  {
    Component: LinkedinShareButton,
    Icon: LinkedinIcon,
    name: "LinkedIn",
  },
  {
    Component: RedditShareButton,
    Icon: RedditIcon,
    name: "Reddit",
  },
  {
    Component: TelegramShareButton,
    Icon: TelegramIcon,
    name: "Telegram",
  },
  {
    Component: EmailShareButton,
    Icon: EmailIcon,
    name: "Email",
  },
  {
    Component: PocketShareButton,
    Icon: PocketIcon,
    name: "Pocket",
  },
  {
    Component: ThreadsShareButton,
    Icon: ThreadsIcon,
    name: "Threads",
  },
  {
    Component: TumblrShareButton,
    Icon: TumblrIcon,
    name: "Tumblr",
  },
  {
    Component: ViberShareButton,
    Icon: ViberIcon,
    name: "Viber",
  },
];

export const ShareButton = ({ url }: { url: string }) => {
  const [open, setOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <span className="font-md">Share</span>
          <Share2 className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle>Share this video</DialogTitle>
        </DialogHeader>

        <div className="relative my-4 w-full overflow-hidden z-10">
          {/* Left Gradient */}
          <div
            className={cn(
              "from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent",
              current === 1 && "hidden"
            )}
          />

          <Carousel
            setApi={setApi}
            opts={{ align: "start", dragFree: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {socials.map(({ Component, Icon, name }, i) => (
                <CarouselItem
                  key={i}
                  className="mx-2 cursor-pointer flex-col items-center basis-auto pl-3"
                >
                  <Component url={url}>
                    <Icon size={48} round />
                    <span className="mt-1 text-sm text-center">{name}</span>
                  </Component>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Right Gradient */}
          <div
            className={cn(
              "from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l to-transparent",
              current === count && "hidden"
            )}
          />
        </div>

        <div className="bg-muted mt-4 flex items-center justify-between rounded-md px-3 py-2 overflow-hidden">
          <span className="truncate text-sm max-w-[calc(100%-40px)]">{url}</span>
          <Button size="icon" onClick={handleCopy}>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
