"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const url = new URL("/search",process.env.NEXT_PUBLIC_URL);
    const newQuery = value.trim();

    if (newQuery) {
      url.searchParams.set("query", newQuery);
    } else {
      url.searchParams.delete("query");
    }

    setValue(newQuery);
    router.push(url.toString());
  };

  return (
    <>
      <form
        className="hidden w-full max-w-[600px] sm:flex"
        onSubmit={handleSearch}
      >
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-l-full border py-2 pr-12 pl-4 focus:border-blue-500 focus:outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setValue("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full"
              aria-label="Clear search"
            >
              <XIcon className="text-gray-500" />
            </Button>
          )}
        </div>
        <button
          type="submit"
          className="rounded-r-full border border-l-0 px-5 py-2.5 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          disabled={!value.trim()}
        >
          <SearchIcon className="size-5" />
        </button>
      </form>

    </>
  );
};
