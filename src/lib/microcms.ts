/// <reference types="astro/client" />
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN as string,
  apiKey: import.meta.env.MICROCMS_API_KEY as string,
});

// 1. 記事用（Database / Report）の型
// src/library/microcms.ts (または適切な型定義ファイル)

export type PageType = 'general' | 'data' | 'repo';

export type Category = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name?: string;
  slug: string;
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