import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";

export default function CheckoutPage() {
  const { items, totalPrice, placeOrder } = useCart();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder(
      { shippingAddress, paymentMethod },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  const shipping = totalPrice > 0 ? 1500 : 0; // Assuming a flat shipping rate
  const total = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-4xl font-bold tracking-widest mb-8 text-center">
          Checkout
        </h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold tracking-widest mb-6">
              Shipping Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300"
                required
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300"
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300"
                required
              />

              <h2 className="text-2xl font-bold tracking-widest mb-4 pt-8">
                Payment Method
              </h2>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  Credit Card
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  PayPal
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 mt-8 tracking-widest hover:bg-gray-800 transition"
              >
                Place Order
              </button>
            </form>
          </div>

          <div className="bg-gray-50 p-8 h-fit">
            <h2 className="text-2xl font-bold tracking-widest mb-6">
              Order Summary
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    ₦{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-4 text-md tracking-wider mt-6 pt-6 border-t">
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
          </div>
        </div>
      </section>
    </div>
  );
}
