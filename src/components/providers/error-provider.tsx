"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

// Whitelist of friendly error messages
const errorMessages: Record<string, string> = {
  INVALID_TOKEN: "This magic link is invalid or has already been used.",
  EXPIRED_LINK: "This link has expired. Please request a new one.",
  UNAUTHORIZED: "You need to sign in to access this page.",
};

export default function ErrorFromURL() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorKey = searchParams.get("error");

  const message = useMemo(() => {
    if (!errorKey) return null;
    return errorMessages[errorKey] || "An unknown error occurred.";
  }, [errorKey]);

  useEffect(() => {
    if (errorKey) {
      console.warn("Error from URL:", errorKey);
    }
  }, [errorKey]);

  if (!message) return null;

  return (
    <div className="mx-auto mt-10 max-w-md rounded-md bg-red-100 p-4 text-red-800 shadow">
      <h2 className="mb-2 text-lg font-semibold">Oops!</h2>
      <p>{message}</p>
      <button
        className="mt-4 rounded bg-black px-4 py-2 text-white transition hover:bg-gray-800"
        onClick={() => router.push("/")}
      >
        Go back home
      </button>
    </div>
  );
}
