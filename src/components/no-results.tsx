// components/icons/NoResults.tsx
import React from "react";

export const NoResults = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-40 w-40 text-muted-foreground" // You can customize size and color here
    >
      <circle
        cx="30"
        cy="30"
        r="16"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="44"
        y1="44"
        x2="60"
        y2="60"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="24"
        y1="26"
        x2="36"
        y2="26"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="24"
        y1="34"
        x2="36"
        y2="34"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};


