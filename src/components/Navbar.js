import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="font-bold text-xl">
          Dredd Apparel
        </Link>
        <div>
          <Link href="/shop" className="px-4">
            Shop
          </Link>
          <Link href="/designer" className="px-4">
            Designer
          </Link>
        </div>
      </div>
    </nav>
  );
}
