import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../lib/sanityClient";
import type { SanityPost } from "../types";
import Header from "../components/Header";
import Sponsors from "../components/Sponsors";
import Footer from "../components/Footer";
import { fetchPostBySlug } from "../lib/queries";

const PLACEHOLDER = "https://placehold.co/1200x630?text=Article";

const builder = imageUrlBuilder(client);

const portableTextComponents: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset) return null;
            const url = builder.image(value).width(900).auto("format").url();
            return (
                <figure className="my-6">
                    <img
                        src={url}
                        alt={value.alt ?? ""}
                        className="w-full rounded-lg object-cover"
                    />
                    {value.caption && (
                        <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
    },
    marks: {
        link: ({ children, value }) => (
            <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-red-600 underline hover:text-red-800">
                {children}
            </a>
        ),
    },
    block: {
        h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-3">{children}</h1>,
        h2: ({ children }) => <h2 className="text-3xl font-bold mt-7 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-2xl font-semibold mt-6 mb-2">{children}</h3>,
        h4: ({ children }) => <h4 className="text-xl font-semibold mt-5 mb-2">{children}</h4>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-red-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>
        ),
        normal: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc ml-6 my-4 space-y-1">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal ml-6 my-4 space-y-1">{children}</ol>,
    },
};

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
                                <PortableText value={post.body} components={portableTextComponents} />
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
