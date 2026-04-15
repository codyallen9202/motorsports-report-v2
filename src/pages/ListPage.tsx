// src/pages/ListPage.jsx
import { useEffect, useMemo, useState } from "react";

type FilterKey = "dlm" | "dsc" | "nascar" | "other" | "photos" | "latest";

interface ListItem {
    id: string;
    title: string;
    author: string;
    image: string;
    href: string;
    date: Date | null;
}
import Header from "../components/Header";
import Hero from "../components/Hero";
import Sponsors from "../components/Sponsors";
import Footer from "../components/Footer";
import Thumbnail from "../components/Thumbnail";
import { fetchDLM, fetchDSC, fetchNASCAR, fetchOther, fetchPhotos, fetchLatest } from "../lib/queries";

const PAGE_SIZE = 8;
const PLACEHOLDER = "https://placehold.co/800x450?text=Article";

const FETCHERS = {
    dlm: fetchDLM,
    dsc: fetchDSC,
    nascar: fetchNASCAR,
    other: fetchOther,
    photos: fetchPhotos,
    latest: fetchLatest,
};

export default function ListPage({ filter = "latest" }: { filter?: FilterKey }) {
    const [items, setItems] = useState<ListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const fetchFn = FETCHERS[filter] ?? fetchLatest;

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            setPage(1); // reset when filter changes
            try {
                const data = await fetchFn();
                if (!alive) return;

                const posts = Array.isArray(data) ? data : data ? [data] : [];
                const mapped = posts.map((p) => ({
                    id: p?._id || p?.slug?.current || Math.random().toString(36),
                    title: p?.title || "Untitled",
                    author: p?.author?.name || "Unknown",
                    image: p?.mainImage?.asset?.url || PLACEHOLDER,
                    href: `/article/${p?.slug?.current ?? ""}`,
                    date: p?.publishedAt ? new Date(p.publishedAt) : null,
                }));

                setItems(mapped);
            } catch (e) {
                console.error("List fetch error:", e);
                if (alive) setItems([]);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [fetchFn, filter]);

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const pageItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return items.slice(start, start + PAGE_SIZE);
    }, [items, page]);

    function prev() {
        setPage((p) => Math.max(1, p - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function next() {
        setPage((p) => Math.min(totalPages, p + 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const labelMap = {
        dlm: "Dirt Late Model",
        dsc: "Dirt Sprint Car",
        nascar: "NASCAR",
        other: "Other",
        photos: "Photos",
        latest: "Latest",
    };
    const heading = labelMap[filter] ?? "Articles";

    return (
        <div className="pt-0">
            <Header />
            <Hero />

            {/* Content */}
            <section className="max-w-screen-xl mx-auto px-4 py-10">
                <div className="flex items-end justify-between mb-6 border-b border-gray-200 pb-2">
                    <h2 className="text-2xl font-bold">{heading}</h2>
                    {!loading && (
                        <span className="text-sm text-gray-500">
                            {total} {total === 1 ? "article" : "articles"}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="text-gray-500 py-16">Loading…</div>
                ) : total === 0 ? (
                    <div className="text-gray-500 py-16">No articles found.</div>
                ) : (
                    <>
                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {pageItems.map((item) => (
                                <Thumbnail key={item.id} {...item} />
                            ))}
                        </div>

                        {/* Pager */}
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <button
                                onClick={prev}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={next}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </section>

            <Sponsors />
            <Footer />
        </div>
    );
}
