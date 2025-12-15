import Image from "next/image";

export default function TemplatePanel({ onSelectTemplate }) {
  const templates = [
    {
      name: "Long Sleeve Hoodie",
      path: "/templates/vecteezy_long-sleeve-hoodie-technical-fashion-flat-sketch-vector_9649450.svg",
    },
    {
      name: "Long Sleeve Jacket",
      path: "/templates/vecteezy_long-sleeve-jacket-technical-fashion-flat-sketch-vector_7494901.svg",
    },
    {
      name: "Jacket with Pocket",
      path: "/templates/vecteezy_long-sleeve-jacket-with-pocket-and-zipper-technical-fashion_19849444.svg",
    },
    {
      name: "Jacket Sweatshirt",
      path: "/templates/vecteezy_long-sleeve-with-zipper-and-pocket-jacket-sweatshirt_11387650.svg",
    },
    {
      name: "Polo Shirt",
      path: "/templates/vecteezy_polo-shirt-vector-illustration-template-front-and-back_6896922.svg",
    },
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Templates</h3>
      <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[200px]">
        {templates.map((template) => (
          <div
            key={template.name}
            onClick={() => onSelectTemplate(template.path)}
            className="border rounded-lg p-2 cursor-pointer hover:bg-gray-200"
            title={template.name}
          >
            <img
              src={template.path}
              alt={template.name}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
