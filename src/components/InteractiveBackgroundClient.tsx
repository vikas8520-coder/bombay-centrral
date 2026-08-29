"use client";

import dynamic from "next/dynamic";

const InteractiveBackground = dynamic(() => import("./InteractiveBackground"), {
  ssr: false,
  loading: () => null,
});

export default function InteractiveBackgroundClient() {
  return <InteractiveBackground />;
}
