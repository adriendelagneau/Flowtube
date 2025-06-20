"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Category } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";

export const FilterCarousel = ({ categories }: { categories: Category[] }) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const onSelect = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`?${params.toString()}`, { scroll: false });
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
    <div className="relative my-4 w-full px-5">
      {/* Left Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 bottom-0 left-12 z-10 w-12 bg-gradient-to-r to-transparent",
          current === 1 && "hidden"
        )}
      ></div>

      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-2">
          {/* "All" Option */}
          <CarouselItem
            onClick={() => onSelect(null)}
            className="basis-auto cursor-pointer pl-2"
          >
            <Badge
              variant={!categorySlug ? "default" : "secondary"}
              className="rounded-lg px-3 py-1 text-sm"
            >
              All
            </Badge>
          </CarouselItem>

          {categories.map((category) => (
            <CarouselItem
              onClick={() => onSelect(category.slug)}
              key={category.id}
              className="basis-auto cursor-pointer pl-3"
            >
              <Badge
                variant={
                  categorySlug === category.slug ? "default" : "secondary"
                }
                className="rounded-lg px-3 py-1 text-sm"
              >
                {category.name}
              </Badge>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20 cursor-pointer" />
        <CarouselNext className="right-0 z-20 cursor-pointer" />
      </Carousel>

      {/* Right Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 right-12 bottom-0 z-10 w-12 bg-gradient-to-l to-transparent",
          current === count && "hidden"
        )}
      ></div>
    </div>
  );
};
