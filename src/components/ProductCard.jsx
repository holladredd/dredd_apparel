import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      <div className="w-full h-48 relative mb-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-500">${product.price}</p>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add to Cart
      </button>
    </div>
  );
}
