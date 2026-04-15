import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { SanityPost } from "../types";
import Header from "../components/Header";
import Sponsors from "../components/Sponsors";
import Footer from "../components/Footer";
import { fetchPostBySlug } from "../lib/queries";

const PLACEHOLDER = "https://placehold.co/1200x630?text=Article";

// ---------------------------------------------------------------------------
// Lightweight Portable Text renderer — handles the common Sanity block types
// without requiring an extra dependency.
// ---------------------------------------------------------------------------
type PTSpan = { _type: "span"; text: string; marks?: string[] };
type PTBlock = {
    _type: "block";
    style?: string;
    listItem?: string;
    children?: PTSpan[];
    markDefs?: { _key: string; _type: string; href?: string }[];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PTNode = PTBlock | { _type: string; [key: string]: any };

function renderSpan(
    span: PTSpan,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    markDefs: { _key: string; _type: string; href?: string }[],
    key: number
): React.ReactNode {
    const { text, marks = [] } = span;
    let node: React.ReactNode = text;

    for (const mark of marks) {
        const def = markDefs.find((d) => d._key === mark);
        if (def?.href) {
            node = (
                <a key={key} href={def.href} target="_blank" rel="noopener noreferrer" className="text-red-600 underline hover:text-red-800">
                    {node}
                </a>
            );
        } else if (mark === "strong") {
            node = <strong key={key}>{node}</strong>;
        } else if (mark === "em") {
            node = <em key={key}>{node}</em>;
        } else if (mark === "underline") {
            node = <u key={key}>{node}</u>;
        } else if (mark === "code") {
            node = <code key={key} className="bg-gray-100 px-1 rounded text-sm font-mono">{node}</code>;
        }
    }
    return node;
}

function renderBlock(block: PTBlock, index: number): React.ReactNode {
    const children = (block.children ?? []).map((span, i) =>
        renderSpan(span, block.markDefs ?? [], i)
    );

    const style = block.style ?? "normal";

    if (block.listItem === "bullet") {
        return <li key={index} className="ml-6 list-disc">{children}</li>;
    }
    if (block.listItem === "number") {
        return <li key={index} className="ml-6 list-decimal">{children}</li>;
    }

    switch (style) {
        case "h1": return <h1 key={index} className="text-4xl font-bold mt-8 mb-3">{children}</h1>;
        case "h2": return <h2 key={index} className="text-3xl font-bold mt-7 mb-3">{children}</h2>;
        case "h3": return <h3 key={index} className="text-2xl font-semibold mt-6 mb-2">{children}</h3>;
        case "h4": return <h4 key={index} className="text-xl font-semibold mt-5 mb-2">{children}</h4>;
        case "blockquote":
            return (
                <blockquote key={index} className="border-l-4 border-red-500 pl-4 italic text-gray-600 my-4">
                    {children}
                </blockquote>
            );
        default:
            return <p key={index} className="my-3 leading-relaxed">{children}</p>;
    }
}

// Wrap consecutive list items in <ul> / <ol>
function groupBlocks(nodes: PTNode[]): React.ReactNode[] {
    const result: React.ReactNode[] = [];
    let i = 0;
    while (i < nodes.length) {
        const node = nodes[i] as PTBlock;
        if (node._type === "block" && node.listItem) {
            const tag = node.listItem === "number" ? "number" : "bullet";
            const items: React.ReactNode[] = [];
            while (i < nodes.length) {
                const cur = nodes[i] as PTBlock;
                if (cur._type === "block" && cur.listItem === tag) {
                    items.push(renderBlock(cur, i));
                    i++;
                } else break;
            }
            result.push(
                tag === "number"
                    ? <ol key={`list-${i}`} className="list-decimal my-4 space-y-1">{items}</ol>
                    : <ul key={`list-${i}`} className="list-disc my-4 space-y-1">{items}</ul>
            );
        } else if (node._type === "block") {
            result.push(renderBlock(node, i));
            i++;
        } else {
            // Unknown block types (images embedded in body, etc.) — skip silently
            i++;
        }
    }
    return result;
}

// ---------------------------------------------------------------------------

const CATEGORY_ROUTES: Record<string, string> = {
    "Dirt Late Models": "/DLM",
    "Dirt Sprint Cars": "/DSC",
    "NASCAR": "/NASCAR",
    "Photos": "/photos",
    "Other": "/other",
};

export default function ArticlePage() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<SanityPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) { setNotFound(true); setLoading(false); return; }
        let alive = true;
        (async () => {
            try {
                const data = await fetchPostBySlug(slug);
                if (!alive) return;
                if (!data) setNotFound(true);
                else setPost(data);
            } catch (e) {
                console.error("Article fetch error:", e);
                if (alive) setNotFound(true);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [slug]);

    const formattedDate = post?.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <div>
            <Header />

            <main className="max-w-3xl mx-auto px-4 py-10">
                {loading && (
                    <div className="text-gray-500 py-24 text-center">Loading…</div>
                )}

                {!loading && notFound && (
                    <div className="text-gray-500 py-24 text-center">
                        <p className="text-2xl font-semibold mb-2">Article not found</p>
                        <a href="/home" className="text-red-600 hover:underline">← Back to home</a>
                    </div>
                )}

                {!loading && post && (
                    <>
                        {/* Back link */}
                        <a
                            href={post.category ? (CATEGORY_ROUTES[post.category] ?? "/home") : "/home"}
                            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 mb-6"
                        >
                            ← Back
                        </a>

                        {/* Category badge */}
                        {post.category && (
                            <span className="block text-xs font-semibold uppercase tracking-widest text-red-600 mb-2">
                                {post.category}
                            </span>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                            {post.title ?? "Untitled"}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-6">
                            {post.author?.name && (
                                <span className="font-medium text-gray-700">{post.author.name}</span>
                            )}
                            {post.author?.name && formattedDate && (
                                <span aria-hidden="true">·</span>
                            )}
                            {formattedDate && <time dateTime={post.publishedAt}>{formattedDate}</time>}
                        </div>

                        {/* Hero image */}
                        <img
                            src={post.mainImage?.asset?.url ?? PLACEHOLDER}
                            alt={post.title ?? "Article image"}
                            className="w-full rounded-xl object-cover aspect-[16/9] mb-8"
                        />

                        {/* Body */}
                        {post.body && post.body.length > 0 ? (
                            <article className="prose prose-gray max-w-none text-gray-800 text-base">
                                {groupBlocks(post.body)}
                            </article>
                        ) : (
                            <p className="text-gray-400 italic">No content available for this article.</p>
                        )}
                    </>
                )}
            </main>

            <Sponsors />
            <Footer />
        </div>
    );
}
