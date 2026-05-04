import * as cheerio from 'cheerio';
import ogs from 'open-graph-scraper-lite';

// キャッシュ用の簡易的なMap
const ogCache = new Map<string, any>();

export async function processLinkCards(html: string) {
  const $ = cheerio.load(html);
  const linkElements: { url: string; element: any }[] = [];

  // pタグの中にaタグが1つだけあり、そのテキストがURL形式の場合を「生リンク」とみなす
  $('p').each((_, p) => {
    const pTag = $(p);
    const children = pTag.contents();

    // aタグ1つだけ、または前後に微細な空白のみの場合を許容
    const aTags = pTag.find('a');
    if (aTags.length === 1) {
      const a = aTags.first();
      const href = a.attr('href');
      const text = a.text().trim();

      // aタグ以外のテキストコンテンツがあるかチェック（空白以外）
      const otherText = pTag.clone().find('a').remove().end().text().trim();

      if (href && !otherText && (text === href || text.startsWith('http'))) {
        linkElements.push({ url: href, element: p });
      }
    }
  });

  for (const { url, element } of linkElements) {
    try {
      let result = ogCache.get(url);

      if (!result) {
        const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } });
        const htmlContent = await response.text();
        const ogData = await ogs({ html: htmlContent });
        result = ogData.result;
        ogCache.set(url, result);
      }

      if (result && result.success) {
        const cardHtml = renderLinkCard(result, url);
        $(element).replaceWith(cardHtml);
      }
    } catch (e) {
      console.warn(`[LinkCard] Failed to fetch OGP for ${url}:`, e);
      // 失敗した場合はそのまま（元のリンクのまま）
    }
  }

  // bodyの中身だけ返す（cheerio.loadするとhtml/bodyタグが付く場合があるため）
  return $('body').html() || $.html();
}

function renderLinkCard(og: any, url: string) {
  const title = og.ogTitle || url;
  const description = og.ogDescription || '';
  const image = og.ogImage?.[0]?.url || og.ogImage?.url || '';
  const domain = new URL(url).hostname;
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return `
    <div class="link-card-wrapper">
      <a href="${url}" class="link-card" target="_blank" rel="noopener noreferrer">
        <div class="link-card-content">
          <div class="link-card-title">${escapeHtml(title)}</div>
          <div class="link-card-description">${escapeHtml(description)}</div>
          <div class="link-card-meta">
            <img src="${favicon}" alt="" class="link-card-favicon" loading="lazy" />
            <span class="link-card-url">${url}</span>
          </div>
        </div>
        ${image ? `
          <div class="link-card-image">
            <img src="${image}" alt="" loading="lazy" />
          </div>
        ` : ''}
      </a>
    </div>
  `;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
