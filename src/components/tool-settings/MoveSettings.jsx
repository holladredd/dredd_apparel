import { FaArrowUp, FaArrowDown, FaTrash } from "react-icons/fa";

export default function MoveSettings({ canvas }) {
  const bringForward = () => {
    const obj = canvas.getActiveObject();
    if (obj) {
      canvas.bringForward(obj);
      canvas.renderAll();
    }
  };

  const sendBackwards = () => {
    const obj = canvas.getActiveObject();
    if (obj) {
      canvas.sendBackwards(obj);
      canvas.renderAll();
    }
  };

  const deleteObject = () => {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Arrange</h3>
      <div className="flex space-x-2">
        <button
          onClick={bringForward}
          className="p-2 border rounded-lg shadow-sm bg-white hover:bg-gray-50"
          title="Bring Forward"
        >
          <FaArrowUp />
        </button>
        <button
          onClick={sendBackwards}
          className="p-2 border rounded-lg shadow-sm bg-white hover:bg-gray-50"
          title="Send Backward"
        >
          <FaArrowDown />
        </button>
        <button
          onClick={deleteObject}
          className="p-2 border rounded-lg shadow-sm bg-white hover:bg-red-50 text-red-500"
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
