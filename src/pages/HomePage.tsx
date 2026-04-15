// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import type { SanityPost, ArticleItem } from "../types";

import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedArticle from "../components/FeaturedArticle";
import Section from "../components/Section";
import Sponsors from "../components/Sponsors";
import Footer from "../components/Footer";

import { fetchDLM, fetchDSC, fetchNASCAR, fetchLatest } from "../lib/queries";

const PLACEHOLDER = "https://placehold.co/800x400?text=No+Image";

export default function HomePage() {
    const [latest, setLatest] = useState<SanityPost | null>(null);
    const [dlm, setDLM] = useState<ArticleItem[]>([]);
    const [dsc, setDSC] = useState<ArticleItem[]>([]);
    const [nascar, setNASCAR] = useState<ArticleItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [latestPost, a, b, c] = await Promise.all([
                    fetchLatest(),
                    fetchDLM(),
                    fetchDSC(),
                    fetchNASCAR()
                ]);

                const toItems = (arr: SanityPost[]): ArticleItem[] =>
                    (arr || []).slice(0, 4).map((p) => ({
                        title: p.title || "Untitled",
                        author: p?.author?.name || "Unknown",
                        image: p?.mainImage?.asset?.url || PLACEHOLDER,
                        href: `/article/${p?.slug?.current ?? ""}`,
                    }));

                setLatest(latestPost || null);
                setDLM(toItems(a));
                setDSC(toItems(b));
                setNASCAR(toItems(c));
            } catch (e) {
                console.error("Homepage fetch error:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="pt-0">
            <Header />
            <Hero />

            {loading ? (
                <div className="max-w-screen-xl mx-auto px-4 py-16 text-gray-500">Loading…</div>
            ) : (
                <>
                    {/* Featured goes here */}
                    <FeaturedArticle post={latest} />

                    {/* Sections */}
                    <Section title="Dirt Late Models" items={dlm} link="/DLM" />
                    <Section title="NASCAR" items={nascar} link="/NASCAR" />
                    <Section title="Dirt Sprint Cars" items={dsc} link="/DSC" />
                </>
            )}

            <Sponsors />
            <Footer />
        </div>
    );
}
