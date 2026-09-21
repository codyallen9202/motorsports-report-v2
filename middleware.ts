// Vercel Edge Middleware.
//
// Social/link-preview crawlers (Twitterbot, facebookexternalhit, Slackbot, ...) do not
// execute JavaScript, so the client-rendered SPA in index.html never reaches them with
// real per-article title/description/image. For requests from those user agents on
// /article/:slug, this returns a small server-rendered HTML document with the correct
// Open Graph / Twitter Card tags instead of the SPA shell. Everyone else (real browsers,
// general search bots) passes straight through to the normal SPA.
import { next } from "@vercel/edge";
import imageUrlBuilder from "@sanity/image-url";

export const config = {
  matcher: ["/article/:slug*"],
};

const CRAWLER_UA =
  /facebookexternalhit|Facebot|Twitterbot|Slackbot|Slack-ImgProxy|LinkedInBot|Discordbot|WhatsApp|TelegramBot|Pinterest|redditbot|Applebot|SkypeUriPreview|vkShare|W3C_Validator|Embedly|Quora Link Preview|Iframely/i;

const PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID;
const DATASET = process.env.VITE_SANITY_DATASET;
const API_VERSION = "2025-01-01";

const SITE_URL = "https://motorsportsreport.net";
const SITE_NAME = "Motorsports Report";
const DEFAULT_DESCRIPTION =
  "Motorsports Report brings you news, results, and photos from Dirt Late Model, Dirt Sprint Car, and NASCAR racing.";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

const imageBuilder =
  PROJECT_ID && DATASET ? imageUrlBuilder({ projectId: PROJECT_ID, dataset: DATASET }) : null;

interface PostMeta {
  title?: string;
  plainBody?: string;
  mainImage?: unknown;
}

async function fetchPostMeta(slug: string): Promise<PostMeta | null> {
  if (!PROJECT_ID || !DATASET) return null;

  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    "plainBody": pt::text(body),
    mainImage
  }`;
  const url = new URL(
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`
  );
  url.searchParams.set("query", query);
  url.searchParams.set("$slug", JSON.stringify(slug));

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const { result } = (await res.json()) as { result: PostMeta | null };
    return result ?? null;
  } catch {
    return null;
  }
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

function ogImageUrl(mainImage: unknown): string {
  if (!imageBuilder || !mainImage) return DEFAULT_IMAGE;
  try {
    const url = imageBuilder
      .image(mainImage as Parameters<typeof imageBuilder.image>[0])
      .width(1200)
      .height(630)
      .fit("crop")
      .auto("format")
      .url();
    return url || DEFAULT_IMAGE;
  } catch {
    return DEFAULT_IMAGE;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHtml(
  pageUrl: string,
  meta: { title: string; description: string; image: string }
): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = escapeHtml(meta.image);
  const url = escapeHtml(pageUrl);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${url}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
</body>
</html>`;
}

export default async function middleware(request: Request) {
  const ua = request.headers.get("user-agent") || "";
  if (!CRAWLER_UA.test(ua)) {
    return next();
  }

  const url = new URL(request.url);
  const slug = decodeURIComponent(
    url.pathname.replace(/^\/article\//, "").split("/")[0] || ""
  );
  if (!slug) {
    return next();
  }

  const post = await fetchPostMeta(slug);
  if (!post) {
    // Unknown/unpublished slug or a Sanity error: fall back to the static
    // site-wide defaults baked into index.html rather than serving a blank page.
    return next();
  }

  const meta = {
    title: post.title ? `${post.title} | ${SITE_NAME}` : SITE_NAME,
    description: post.plainBody ? truncate(post.plainBody, 160) : DEFAULT_DESCRIPTION,
    image: ogImageUrl(post.mainImage),
  };

  return new Response(renderHtml(url.toString(), meta), {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
