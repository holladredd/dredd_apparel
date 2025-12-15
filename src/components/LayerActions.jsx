import { FaPlus, FaClone } from "react-icons/fa";

export default function LayerActions({ objects, setObjects, selectedId }) {
  const addPaintLayer = () => {
    const newRect = {
      id: `rect-${Date.now()}`,
      type: "rect",
      x: 20,
      y: 20,
      width: 100,
      height: 100,
      fill: "rgba(0,0,0,0)",
      stroke: "black",
      strokeWidth: 1,
      draggable: true,
    };
    setObjects((prev) => [...prev, newRect]);
  };

  const duplicateLayer = () => {
    const selectedObject = objects.find((obj) => obj.id === selectedId);
    if (!selectedObject) return;

    const newObject = {
      ...selectedObject,
      id: `${selectedObject.type}-${Date.now()}`,
      x: selectedObject.x + 20,
      y: selectedObject.y + 20,
    };
    setObjects((prev) => [...prev, newObject]);
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
