export default function EditorToolbar({ canvas, fabric }) {
  const addText = () => {
    if (!canvas || !fabric) return;
    const text = new fabric.Textbox("Hello World", {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "#000",
    });
    canvas.add(text).setActiveObject(text);
    canvas.renderAll();
  };

  return (
    <div className="p-2 bg-gray-100 border-b">
      {canvas ? (
        <div className="flex items-center space-x-2">
          <button
            onClick={addText}
            className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50"
          >
            Add Text
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Initializing Canvas...</div>
      )}
    </div>
  );
}
