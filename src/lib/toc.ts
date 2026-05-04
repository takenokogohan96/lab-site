import { processLinkCards } from "./linkCard";

export type TocItem = {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

export async function renderToc(content: string) {
  const toc: TocItem[] = [];
  let hCount = 0;
  let currentH2: TocItem | null = null;
  let currentH3: TocItem | null = null;

  // 1. リンクカードの処理 (生リンクをリッチな表示に変換)
  const contentWithCards = await processLinkCards(content);

  // 2. 画像URLに最適化パラメータを付与 (WebP変換 + 自動圧縮)
  const processedContent = contentWithCards.replace(
    /<img\s+[^>]*src="([^"]+)"/g,
    (match, src) => match.includes('?') ? match : match.replace(src, `${src}?auto=format,compress`)
  );

  // 3. h2-h4タグを抽出してIDを付与
  const contentWithIds = processedContent.replace(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/g, (match, level, text) => {
    const id = `h-${hCount++}`;
    const plainText = text.replace(/<[^>]*>/g, '');
    const item: TocItem = { id, text: plainText, level: Number(level), children: [] };

    if (level === "2") {
      toc.push(item);
      currentH2 = item;
      currentH3 = null;
    } else if (level === "3") {
      if (currentH2) {
        currentH2.children.push(item);
      } else {
        toc.push(item);
      }
      currentH3 = item;
    } else if (level === "4") {
      if (currentH3) {
        currentH3.children.push(item);
      } else if (currentH2) {
        currentH2.children.push(item);
      } else {
        toc.push(item);
      }
    }
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  return { toc, contentWithIds };
}
