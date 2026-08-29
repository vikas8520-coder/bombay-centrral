"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    // Disable browser scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Clear any hash (#reviews, #menu, etc.) from the URL that causes auto-scroll
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    // Scroll to top once on load
    window.scrollTo(0, 0);
  }, []);

  return null;
}
