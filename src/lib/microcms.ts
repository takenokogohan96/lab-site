/// <reference types="astro/client" />
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN as string,
  apiKey: import.meta.env.MICROCMS_API_KEY as string,
});

// 1. 記事用（Report / Showcase）の型
export interface Article {
  id: string;
  title: string;
  slug: string;
  type: "repo" | "exp"; // 複数選択ではないため、配列ではなく単一の文字列
  category: Category;
  content: string;
  publishedAt: string;
  image?: {
    url: string;
  };
  description?: string;
}

// 2. カテゴリ用の型
export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

// 3. 固定ページ用（About / Links 等）の型
export interface IndependentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
}