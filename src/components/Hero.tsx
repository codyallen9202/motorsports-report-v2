// src/components/Hero.jsx
import hero from "../assets/hero.jpg"

export default function Hero() {
    return (
        <section className="relative w-full h-[22rem] md:h-[30rem] lg:h-[36rem]">
            {/* Background image */}
            <img
                src={hero}
                alt="Dirt track paddock"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/60" />

            {/* Centered content */}
            <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
                <div className="max-w-4xl">
                    <h1 className="text-white font-extrabold tracking-tight drop-shadow-xl
                         text-5xl md:text-6xl lg:text-7xl">
                        Motorsports Report
                    </h1>
                    <p className="mt-3 text-gray-100 font-medium drop-shadow-md
                        text-xl md:text-2xl lg:text-3xl">
                        Your #1 spot for racing news in and around the southeast!
                    </p>
                </div>
            </div>
        </section>
    );
}