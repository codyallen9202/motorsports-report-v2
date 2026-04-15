export interface SanityPost {
    _id?: string;
    title?: string;
    slug?: { current?: string };
    mainImage?: { asset?: { url?: string } };
    publishedAt?: string;
    author?: { name?: string };
    category?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any[];
}

export interface ArticleItem {
    title: string;
    author: string;
    image: string;
    href: string;
}
