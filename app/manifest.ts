import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "대구신현교회",
    short_name: "신현교회",
    description: "대한예수교장로회 합동 동대구노회 대구신현교회",
    start_url: "/",
    display: "standalone",
    background_color: "#584632",
    theme_color: "#3d3023",
    lang: "ko",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
