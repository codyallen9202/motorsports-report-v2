// src/components/FeaturedArticle.jsx
import type { SanityPost } from "../types";

const PLACEHOLDER = "https://placehold.co/1200x630?text=Featured";

export default function FeaturedArticle({ post }: { post: SanityPost | null }) {
    if (!post) return null;

    const href = `/article/${post?.slug?.current ?? ""}`;
    const img = post?.mainImage?.asset?.url || PLACEHOLDER;
    const date = post?.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString()
        : "";

    return (
        <section className="max-w-screen-xl mx-auto px-4 py-10">
            <a href={href} className="group block">
                <article className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl bg-white hover:shadow-lg transition">
                    {/* Image */}
                    <div className="relative">
                        <img
                            src={img}
                            alt={post.title}
                            className="w-full aspect-[3/2] object-cover"
                            loading="eager"
                        />
                        {/* category badge */}
                        {post.category && (
                            <span className="absolute left-3 top-3 rounded-md bg-black/60 text-white text-xs font-medium px-2 py-1">
                                {post.category}
                            </span>
                        )}
                    </div>

                    {/* Text */}
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                        <h2 className="text-2xl md:text-4xl font-extrabold leading-tight group-hover:text-red-600 transition-colors">
                            {post.title || "Untitled"}
                        </h2>
                        <p className="mt-3 text-sm text-stone-600">
                            {post?.author?.name ? post.author.name : "Unknown"}{date ? ` • ${date}` : ""}
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 text-red-600 font-semibold">
                            Read Article <span className="text-2xl leading-none">{">>"}</span>
                        </div>
                    </div>
                </article>
            </a>
        </section>
    );
}
