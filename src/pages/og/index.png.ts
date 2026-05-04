import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";

export const GET: APIRoute = async () => {
  // 1. フォントの読み込み (Noto Sans JP のみ)
  const fontPath = path.resolve("src/assets/fonts/NotoSansJP-Regular.otf");
  const fontData = fs.readFileSync(fontPath);

  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              children: "lab.takeno.tech",
              style: {
                fontSize: 80,
                color: "#d1d5db", // --text-normal
                fontFamily: "Noto Sans JP",
              },
            },
          },
          {
            type: "div",
            props: {
              children: "書き置きたいあれやこれなど",
              style: {
                fontSize: 32,
                marginTop: 20,
                color: "#6b7280", // --ui-muted
                fontFamily: "Noto Sans JP",
              },
            },
          },
        ],
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#13151a", // --background-primary
          padding: "40px",
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg);
  const pngBuffer = resvg.render().asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
