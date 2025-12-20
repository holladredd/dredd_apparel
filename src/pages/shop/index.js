import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useProducts } from "@/contexts/ProductContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ShopPage() {
  const { products, pagination, isLoading, isError, filters, setFilters } =
    useProducts();

  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Debounce search input to avoid making too many API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, setFilters]);

  const categories = ["All", "Tees", "Hoodies", "Pants", "Accessories"];

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: category === "All" ? "" : category,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-widest mb-8 text-center">
          Shop Collection
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-12">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-black px-4 py-2 w-full md:w-1/3 text-sm tracking-widest focus:outline-none"
          />

          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-xs sm:text-sm tracking-widest border ${
                  filters.category === cat ||
                  (cat === "All" && !filters.category)
                    ? "bg-black text-white"
                    : "border-black"
                } hover:bg-black hover:text-white transition`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Failed to load products.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product._id} className="group relative">
                  <Link href={`/shop/${product.slug}`}>
                    <div className="cursor-pointer">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="mt-4 flex flex-col items-start">
                        <h2 className="text-lg font-semibold tracking-widest">
                          {product.name}
                        </h2>
                        <p className="text-sm tracking-widest opacity-70">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  <FiChevronLeft />
                </button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
