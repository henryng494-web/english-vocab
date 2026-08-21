import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "English Vocab",
    short_name: "Vocab",
    description: "English vocabulary flashcards and review",
    start_url: "/discover",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#e8eef4",
    theme_color: "#182030",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
