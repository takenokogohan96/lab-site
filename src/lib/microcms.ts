/// <reference types="astro/client" />
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN as string,
  apiKey: import.meta.env.MICROCMS_API_KEY as string,
});

// 1. 記事用（Data / Report）の型
// src/library/microcms.ts (または適切な型定義ファイル)

// Repositoryとして扱うフィルタ条件
export const REPOSITORY_QUERY_FILTER = 'type[contains]data[or]type[contains]repo';

export type PageType = 'general' | 'data' | 'repo';

export type Category = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name?: string;
  slug: string;
  color?: string;
  sortOrder: number;
};

export type Page = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  slug: string;
  type: PageType[];
  category?: Category;
  content: string; // richEditorV2
  published?: string; // date
  image?: {
    url: string;
    height: number;
    width: number;
  };
  description?: string;
};

/**
 * カラーコードをCSSで使える形式（#あり）に整形する
 */
export function formatColor(color?: string) {
  if (!color) return undefined;
  return color.startsWith("#") ? color : `#${color}`;
}

/**
 * 記事リストをカテゴリごとにグループ化し、カテゴリのsortOrderでソートする
 */
export function groupPagesByCategory(pages: Page[]) {
  const grouped = pages.reduce((acc, page) => {
    const categoryName = page.category?.name || "未分類";
    if (!acc[categoryName]) {
      acc[categoryName] = {
        name: categoryName,
        sortOrder: page.category?.sortOrder ?? 999,
        color: formatColor(page.category?.color),
        items: [],
      };
    }
    acc[categoryName].items.push(page);
    return acc;
  }, {} as Record<string, { name: string; sortOrder: number; color?: string; items: Page[] }>);

  return Object.values(grouped).sort((a, b) => a.sortOrder - b.sortOrder);
}