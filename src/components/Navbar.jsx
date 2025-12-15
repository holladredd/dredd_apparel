import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-2">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="font-bold text-xl flex items-center">
          <Image
            src="/logo/dredd-branding.png"
            alt="Dredd Apparel"
            width={50}
            height={50}
          />{" "}
          Dredd Apparel
        </Link>
        <div>
          <Link href="/shop" className="px-4">
            Shop
          </Link>
          <Link href="/studio" className="px-4">
            Studio
          </Link>
        </div>
      </div>
    </nav>
  );
}
