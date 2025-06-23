"use client";

import { useEffect } from "react";

export default function ScrollToTopOnRouteChange() {
 // in your _app.tsx or top-level layout client component
useEffect(() => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}, []);


  return null;
}
