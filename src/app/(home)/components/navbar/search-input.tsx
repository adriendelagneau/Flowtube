"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Zod schema for validation (optional but recommended)
const formSchema = z.object({
  query: z.string().trim().min(1, "Please enter a search term"),
});

type SearchFormValues = z.infer<typeof formSchema>;

export const SearchInput = () => {
  const router = useRouter();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const handleSearch = (values: SearchFormValues) => {
    const url = new URL("/search", process.env.NEXT_PUBLIC_URL);
    const trimmed = values.query.trim();

    if (trimmed) {
      url.searchParams.set("query", trimmed);
    } else {
      url.searchParams.delete("query");
    }

    router.push(url.toString());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSearch)}
        className="hidden w-full max-w-[600px] sm:flex"
      >
        <div className="relative w-full">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Search"
                    className="w-full rounded-l-full py-2 pr-12 pl-4"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!!form.watch("query") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => form.setValue("query", "")}
              className="absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2 cursor-pointer rounded-full"
              aria-label="Clear search"
            >
              <XIcon />
            </Button>
          )}
        </div>

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
      </form>
    </Form>
  );
};
