import { useEffect, useState } from "react";

export default function ObjectPanel({ canvas }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!canvas) return;

    const updateSelection = () => {
      setSelected(canvas.getActiveObject());
    };

    canvas.on("selection:created", updateSelection);
    canvas.on("selection:updated", updateSelection);
    canvas.on("selection:cleared", () => setSelected(null));

    return () => {
      canvas.off("selection:created", updateSelection);
      canvas.off("selection:updated", updateSelection);
      canvas.off("selection:cleared");
    };
  }, [canvas]);

  if (!selected) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p>No object selected</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Properties</h3>
      <p>Type: {selected.type}</p>
      {/* Add more controls here based on object type */}
    </div>
  );
}
