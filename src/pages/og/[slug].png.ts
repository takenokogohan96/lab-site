import type { APIRoute } from "astro";
import { client, REPOSITORY_QUERY_FILTER } from "../../lib/microcms";
import type { Page } from "../../lib/microcms";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";

export async function getStaticPaths() {
  const response = await client.get({
    endpoint: "pages",
    queries: {
      limit: 100,
    },
  });

  return response.contents.map((page: Page) => ({
    params: { slug: page.slug },
    props: { title: page.title },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title } = props;

  // 1. フォントの読み込み (Regular と Bold)
  const fontRegularPath = path.resolve("src/assets/fonts/NotoSansJP-Regular.otf");
  const fontBoldPath = path.resolve("src/assets/fonts/NotoSansJP-Bold.otf");
  const fontRegularData = fs.readFileSync(fontRegularPath);
  const fontBoldData = fs.readFileSync(fontBoldPath);

  // 2. SVGの生成 (Satori)
  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              children: title,
              style: {
                fontSize: 60,
                fontWeight: 700, // Bold を指定
                color: "#d1d5db",
                fontFamily: "Noto Sans JP",
                lineHeight: 1.2,
                textAlign: "left",
              },
            },
          },
          {
            type: "div",
            props: {
              children: "lab.takeno.tech",
              style: {
                fontSize: 32,
                fontWeight: 400, // Regular
                color: "#d1d5db",
                fontFamily: "Noto Sans JP",
                alignSelf: "flex-end",
              },
            },
          },
        ],
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#13151a",
          padding: "80px",
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: fontRegularData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Noto Sans JP",
          data: fontBoldData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  // 3. PNGへの変換 (Resvg)
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
