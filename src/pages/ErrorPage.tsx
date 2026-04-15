import Header from "../components/Header";
import Hero from "../components/Hero";
import Sponsors from "../components/Sponsors";
import Footer from "../components/Footer";

export default function ErrorPage() {
    return (
        <div>
            <Header />
            <Hero />

            <main className="max-w-3xl mx-auto px-4 py-24 text-center">
                <p className="text-8xl font-bold text-red-600 mb-4">404</p>
                <p className="text-2xl font-semibold text-gray-800 mb-2">Page not found</p>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                <a
                    href="/home"
                    className="inline-block bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Return home
                </a>
            </main>

            <Sponsors />
            <Footer />
        </div>
    );
}
