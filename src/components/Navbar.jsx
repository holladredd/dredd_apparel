import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">
                  Dredd Apparel
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/shop"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                Shop
              </Link>
              <Link
                href="/designer"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                Designer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
