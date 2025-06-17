"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define Zod schema for validation
const formSchema = z.object({
  query: z.string().trim().min(1, "Search query is required"),
});

type SearchFormValues = z.infer<typeof formSchema>;

export const SearchInputSm = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const handleSearch = (values: SearchFormValues) => {
    const url = new URL("/search", process.env.NEXT_PUBLIC_URL);
    url.searchParams.set("query", values.query);
    router.push(url.toString());
    setIsSearchOpen(false);
    form.reset(); // optional: reset input
  };

  return (
    <>
      {/* Button to open search */}
      <div className="sm:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          className="cursor-pointer"
        >
          <SearchIcon />
        </Button>
      </div>

      {/* Slide-down mobile search */}
      <div
        className={`bg-background fixed top-0 left-0 z-50 h-16 w-full transition-transform duration-300 sm:hidden ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSearch)}
            className="flex h-full items-center px-4"
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Search"
                      autoFocus={isSearchOpen}
                      className="w-full rounded-l-full py-2 pr-12 pl-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={!form.watch("query")?.trim()}
              aria-label="Submit search"
              className="cursor-pointer rounded-r-full disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:text-inherit"
            >
              <SearchIcon />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
              className="cursor-pointer"
            >
              <XIcon />
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
