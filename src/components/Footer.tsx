import fb from "../assets/social/facebook.png";
import tw from "../assets/social/x.png";
import yt from "../assets/social/youtube.png";
import ig from "../assets/social/instagram.png";

export default function Footer() {
    const year = new Date().getFullYear();
    const socials = [
        { href: "https://www.facebook.com/people/Motorsports-Report/61553590751076/", label: "Facebook", src: fb },
        { href: "https://x.com/MtrsportsReport", label: "Twitter/X", src: tw },
        { href: "https://www.youtube.com/channel/UCAsojScNEyJPF3e7uxW6boQ", label: "YouTube", src: yt },
        { href: "https://www.instagram.com/mtrsportsreport/", label: "Instagram", src: ig },
    ];

    return (
        <footer className="w-full bg-stone-900/95 text-white">
            <div className="mx-auto max-w-screen-xl px-4 py-10">
                <div className="flex items-center justify-center gap-6">
                    {socials.map(({ href, label, src }) => (
                        <a
                            key={label}
                            href={href}
                            aria-label={label}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        >
                            <img src={src} alt={label} className="h-6 w-6 md:h-7 md:w-7" />
                        </a>
                    ))}
                </div>

                <div className="mt-6 border-t border-stone-800" />

                <p className="mt-6 text-center text-sm text-gray-300">
                    © {year} MotorsportsReport.net
                    <span className="mx-2 text-gray-500">||</span>
                    Created and maintained by Cody Allen
                </p>
            </div>
        </footer>
    );
}
