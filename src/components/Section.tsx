// src/components/Section.jsx
import type { ArticleItem } from "../types";
import Thumbnail from "./Thumbnail";

export default function Section({ title, items, link }: { title: string; items: ArticleItem[]; link?: string }) {
    return (
        <section className="max-w-screen-xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold">{title}</h2>
                {link && (
                    <a
                        href={link}
                        className="text-black hover:text-red-600 font-extrabold text-2xl md:text-3xl leading-none transition transform hover:translate-x-1"
                    >
                        {">>"}
                    </a>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {items.map((item, i) => (
                    <div key={i} className={i >= 2 ? "hidden md:block" : ""}>
                        <Thumbnail {...item} />
                    </div>
                ))}
            </div>
        </section>
    );
}
