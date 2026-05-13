import type { ArticleItem } from "../types";

interface ThumbnailProps extends ArticleItem {
    date?: Date | null;
}

export default function Thumbnail({ title, author, image, href, date }: ThumbnailProps) {
    return (
        <a href={href || "#"} className="group">
            <div className="bg-white rounded-xl transition hover:shadow-lg p-4 h-full flex flex-col">
                <img
                    src={image}
                    alt={title}
                    className="w-full aspect-[3/2] object-cover rounded-md mb-3 group-hover:opacity-90"
                    loading="lazy"
                />
                <h3 className="text-lg font-semibold group-hover:text-red-500 transition-colors line-clamp-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600">
                    {author}
                    {date && <> &bull; {date.toLocaleDateString()}</>}
                </p>
            </div>
        </a>
    );
}
