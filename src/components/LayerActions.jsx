import { FaPlus, FaClone } from "react-icons/fa";

export default function LayerActions({ canvas, fabric }) {
  if (!canvas || !fabric) return null;

  /* ---------------- ADD PAINT LAYER ---------------- */
  const addPaintLayer = () => {
    const layerCount = canvas.getObjects().length + 1;

    const paintLayer = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      fill: "rgba(0,0,0,0)", // transparent
      selectable: true,
      evented: true,
      hasBorders: false,
      hasControls: false,
      name: `Paint Layer ${layerCount}`,
    });

    canvas.add(paintLayer);
    canvas.setActiveObject(paintLayer);
    canvas.renderAll();
  };

  /* ---------------- DUPLICATE LAYER ---------------- */
  const duplicateLayer = () => {
    const active = canvas.getActiveObject();
    if (!active) return;

    active.clone((cloned) => {
      cloned.set({
        left: active.left + 20,
        top: active.top + 20,
        name: `${active.name || "Layer"} copy`,
      });

      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  return (
    <div className="border-t mt-4 pt-3 space-y-2 ">
      <h3 className="text-sm font-semibold text-gray-700">Layer Actions</h3>
      <div className="flex gap-2">
        <button
          onClick={addPaintLayer}
          className="w-fit flex items-center gap-2 px-3 py-2 bg-gray-200  rounded"
        >
          <FaPlus />
        </button>

        <button
          onClick={duplicateLayer}
          className="w-fit flex items-center gap-2 px-3 py-2 bg-gray-200 rounded"
        >
          <FaClone />
        </button>
      </div>
    </div>
  );
}
