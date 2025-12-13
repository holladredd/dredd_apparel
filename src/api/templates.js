export default function handler(req, res) {
  // Simple list - ensure thumbnails and svgs exist in /public/templates
  const templates = [
    {
      id: 1,
      name: "T-Shirt",
      thumbnail: "/templates/tshirt.png",
      svg: "/templates/shirt.svg",
    },
    {
      id: 2,
      name: "Hoodie",
      thumbnail: "/templates/hoodie.png",
      svg: "/templates/hoodie.svg",
    },
  ];
  res.status(200).json(templates);
}
