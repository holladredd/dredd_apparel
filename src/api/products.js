export default function handler(req, res) {
  res.json([
    {
      id: "1",
      name: "Classic Shirt",
      price: 15000,
      image: "/products/shirt.png",
    },
    {
      id: "2",
      name: "Urban Hoodie",
      price: 22000,
      image: "/products/hoodie.png",
    },
    {
      id: "3",
      name: "Elegant Gown",
      price: 35000,
      image: "/products/gown.png",
    },
  ]);
}
