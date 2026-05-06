import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";

export const GET: APIRoute = async () => {
  // 1. フォントと画像の読み込み
  const fontPath = path.resolve("src/assets/fonts/NotoSansJP-Regular.otf");
  const fontData = fs.readFileSync(fontPath);

  const kodeMonoPath = path.resolve("node_modules/@fontsource/kode-mono/files/kode-mono-latin-700-normal.woff");
  const kodeMonoData = fs.readFileSync(kodeMonoPath);

  const profilePath = path.resolve("src/assets/images/profile.png");
  const profileBase64 = fs.readFileSync(profilePath).toString("base64");
  const profileSrc = `data:image/png;base64,${profileBase64}`;

  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "img",
            props: {
              src: profileSrc,
              style: {
                width: 200,
                height: 200,
                borderRadius: "50%",
                marginBottom: 30,
              },
            },
          },
          {
            type: "div",
            props: {
              children: "lab.takeno.tech",
              style: {
                fontSize: 42,
                fontWeight: "bold",
                color: "#d1d5db", // --text-normal
                fontFamily: "Kode Mono",
                marginBottom: 24,
              },
            },
          },
          {
            type: "div",
            props: {
              children: "◆",
              style: {
                fontSize: 24,
                color: "#99a8ff", // text-accent
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
        {
          name: "Kode Mono",
          data: kodeMonoData,
          weight: 700,
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
