import Navbar from "../components/Navbar";
import { useCart } from "../store/cartStore";

export default function Cart() {
  const { items, remove } = useCart();

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {items.length === 0 && <p>No items yet</p>}
        {items.map((i) => (
          <div key={i.id} className="flex justify-between border p-4 mb-2">
            <span>{i.name}</span>
            <button onClick={() => remove(i.id)} className="text-red-600">
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
