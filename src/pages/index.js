import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold mb-4">
            Design. Customize. Sewn for You.
          </h1>
          <p className="mb-6">
            Create custom outfits or buy ready‑made styles tailored to your
            taste.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/studio"
              className="bg-white text-black px-6 py-3 rounded"
            >
              Start Designing
            </Link>
            <Link href="/shop" className="border px-6 py-3 rounded">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
