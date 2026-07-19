import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "宇航员 ASTRONAUTS",
    short_name: "宇航员",
    description:
      "一支由学生组成的未来科技团队，探索 AI、数字技术与人的关系。",
    start_url: "/",
    display: "standalone",
    background_color: "#05050a",
    theme_color: "#05050a",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
