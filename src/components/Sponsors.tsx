// src/components/Sponsors.jsx
import sponsor1 from "../assets/hf-logo.jpg";
import sponsor2 from "../assets/flo-logo.jpg";

export default function Sponsors() {
    return (
        <section className="max-w-screen-xl mx-auto px-4 py-12 text-center">
            <h2 className="text-xl font-bold uppercase mb-6">Our Sponsors</h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                <a
                    href="https://www.huckfinnsrestaurant.com/"
                    target="_blank"
                >
                    <img
                        src={sponsor1}
                        alt="Huck Finn's Catfish"
                        className="h-24 w-auto rounded-lg"
                        loading="lazy"
                    />
                </a>
                <a
                    href="https://www.floracing.com/"
                    target="_blank"
                >
                    <img
                        src={sponsor2}
                        alt="FloRacing"
                        className="h-24 w-auto rounded-lg"
                        loading="lazy"
                    />
                </a>
            </div>
        </section>
    );
}
