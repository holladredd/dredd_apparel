import { useEffect, useState } from "react";

export default function LayersPanel({ canvas }) {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      setObjects(canvas.getObjects());
    };

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    updateLayers();

    return () => {
      if (canvas.off) {
        canvas.off("object:added", updateLayers);
        canvas.off("object:removed", updateLayers);
      }
    };
  }, [canvas]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Layers</h3>
      {!canvas ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <ul>
          {objects.map((obj, i) => (
            <li key={i} className="p-2 mb-2 bg-white rounded shadow-sm">
              {obj.type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
