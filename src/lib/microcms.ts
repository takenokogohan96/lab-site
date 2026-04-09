/// <reference types="astro/client" />
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN as string,
  apiKey: import.meta.env.MICROCMS_API_KEY as string,
});

// 1. 記事用（Database / Report）の型
export interface Article {
  id: string;
  title: string; // スキーマ[3]と一致
  slug: string;  // スキーマ[3]と一致
  type: string[]; // 実レスポンスが配列形式 ["repo"] のため
  category: Category; // スキーマ[2][3]のリレーション
  content: string; // スキーマ[3]のリッチエディタ
  published: string; // スキーマ[3]の「公開日」フィールド
  image: {        // スキーマ[3]のメディア
    url: string;
    height: number;
    width: number;
  };
  description: string; // スキーマ[3]の概要
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
  title: string; // スキーマ[1]のページ名
  slug: string;  // スキーマ[1]のスラッグ
  content: string; // スキーマ[1]の本文
}