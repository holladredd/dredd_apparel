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
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {templates.map((template) => (
          <div
            key={template.name}
            onClick={() => onSelectTemplate(template.path)}
            className="flex-shrink-0 w-24 h-24 p-2 bg-white rounded shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-500"
            title={template.name}
          >
            <div className="relative w-full h-full">
              <Image
                src={template.path}
                alt={template.name}
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
