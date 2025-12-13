"use client";
import { useEffect, useState } from "react";

export default function LayersPanel({ canvas }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!canvas) return;
    const update = () => {
      setItems(
        canvas.getObjects().map((o, i) => ({
          name: o.type || o.id || "item",
          idx: i,
          id: o.id || o.name || i,
        }))
      );
    };
    canvas.on("object:added", update);
    canvas.on("object:removed", update);
    canvas.on("object:modified", update);
    update();

    return () => {
      canvas.off("object:added", update);
      canvas.off("object:removed", update);
      canvas.off("object:modified", update);
    };
  }, [canvas]);

  const select = (idx) => {
    const obj = canvas.item(idx);
    if (obj) canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  return (
    <div>
      <h4 className="font-semibold">Layers</h4>
      <div className="mt-2 space-y-2">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="text-sm">{it.name}</div>
            <button
              onClick={() => select(i)}
              className="text-xs px-2 py-1 border rounded"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
