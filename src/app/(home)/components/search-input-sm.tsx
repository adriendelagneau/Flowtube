"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

export const SearchInputSm = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL("/search", process.env.NEXT_PUBLIC_URL); // Change this if needed
    const newQuery = value.trim();

    if (newQuery) {
      url.searchParams.set("query", newQuery);
    } else {
      url.searchParams.delete("query");
    }

    router.push(url.toString());
    setIsSearchOpen(false); // Optional: auto-close after search
  };

  return (
    <>
      {/* Search button for small screens */}
      <div className="sm:hidden">
        <Button
          variant="ghost"
          className="px-5 py-2.5"
          onClick={() => setIsSearchOpen(true)}
        >
          <SearchIcon className="size-5" />
        </Button>
      </div>

      {/* Full-width slide-down search bar */}
      <div
        className={`fixed top-0 left-0 z-50 h-16 w-full bg-background/95 shadow-md backdrop-blur-md transition-transform duration-300 sm:hidden ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <form
          onSubmit={handleSearch}
          className="flex h-full items-center gap-2 px-4"
        >
          <input
            type="text"
            placeholder="Search"
            className="flex-grow rounded-full border px-4 py-2 focus:border-blue-500 focus:outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus={isSearchOpen}
          />
          {value && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setValue("")}
              aria-label="Clear search"
            >
              <XIcon className="text-gray-500" />
            </Button>
          )}
          <Button
            type="submit"
            variant="ghost"
            className="px-4 py-2"
            disabled={!value.trim()}
            aria-label="Submit search"
          >
            <SearchIcon className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            <XIcon className="text-gray-500" />
          </Button>
        </form>
      </div>
    </>
  );
};
