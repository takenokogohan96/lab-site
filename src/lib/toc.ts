export interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

export function renderToc(content: string) {
  const toc: TocItem[] = [];
  let hCount = 0;
  let currentH2: TocItem | null = null;
  let currentH3: TocItem | null = null;

  const contentWithIds = content.replace(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/g, (match, level, text) => {
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