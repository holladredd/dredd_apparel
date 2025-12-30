import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

export default function CartPage() {
  const {
    items: cartItems,
    loading,
    updateItem,
    removeItem,
    isRemovingItem,
    totalPrice,
    clearCart,
    isClearingCart,
  } = useCart();

  const handleQuantityChange = (productId, currentQuantity, amount, size) => {
    const newQuantity = currentQuantity + amount;
    if (newQuantity >= 1) {
      updateItem({ productId, quantity: newQuantity, size });
    }
  };

  const handleRemoveItem = (cartItemId) => {
    removeItem(cartItemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const shipping = totalPrice > 0 ? 1500 : 0; // Assuming a flat shipping rate
  const total = totalPrice + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold tracking-widest">
            Loading Cart...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-16">
        <div className="flex justify-center items-center mb-8">
          <h1 className="text-4xl font-bold tracking-widest">My Cart</h1>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={isClearingCart}
              className="ml-auto bg-red-500 text-white py-2 px-4 tracking-widest hover:bg-red-600 transition disabled:bg-gray-400"
            >
              {isClearingCart ? "Clearing..." : "Clear Cart"}
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-lg tracking-widest mb-6">Your cart is empty.</p>
            <Link
              href="/shop"
              className="bg-black text-white py-3 px-8 tracking-widest hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-6 border-b border-gray-200 pb-6"
                >
                  <Image
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold tracking-widest">
                      {item.product.name}
                    </h2>
                    <p className="text-md tracking-widest opacity-70">
                      ₦{item.product.price.toFixed(2)}
                    </p>
                    {item.size && (
                      <p className="text-sm tracking-widest opacity-60">
                        Size: {item.size}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity,
                          -1,
                          item.size
                        )
                      }
                    >
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity,
                          1,
                          item.size
                        )
                      }
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    disabled={isRemovingItem}
                    className="text-red-500 hover:text-red-700 mr-2 disabled:opacity-50"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-gray-50 p-8 h-fit">
              <h2 className="text-2xl font-bold tracking-widest mb-6">
                Summary
              </h2>
              <div className="space-y-4 text-md tracking-wider">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₦{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-300">
                  <span>Total</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block text-center w-full bg-black text-white py-3 mt-8 tracking-widest hover:bg-gray-800 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
