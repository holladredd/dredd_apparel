import {
  FaMousePointer,
  FaHandPaper,
  FaPaintBrush,
  FaEraser,
  FaFont,
} from "react-icons/fa";
import { TOOLS } from "./tools";

export default function EditorToolbar({
  activeTool,
  setActiveTool,
  canvas,
  fabric,
}) {
  if (!canvas || !fabric) return null;

  const setTool = (tool) => {
    resetCanvas();
    setActiveTool(tool);

    switch (tool) {
      case TOOLS.SELECT:
      case TOOLS.MOVE:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.forEachObject((o) => {
          o.selectable = true;
          o.evented = true;
        });
        break;

      case TOOLS.TEXT:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        const text = new fabric.Textbox("Edit text", {
          left: 100,
          top: 100,
          fontSize: 24,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.hiddenTextarea?.focus();
        break;

      case TOOLS.BRUSH:
        canvas.isDrawingMode = true;
        canvas.selection = false;
        canvas.forEachObject((o) => {
          o.selectable = false;
          o.evented = false;
        });
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = 10;
        canvas.freeDrawingBrush.color = "#000";
        break;

      case TOOLS.ERASER:
        canvas.isDrawingMode = true;
        canvas.selection = false;
        canvas.forEachObject((o) => {
          o.selectable = false;
          o.evented = false;
        });
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = 20;
        canvas.freeDrawingBrush.color = "rgba(0,0,0,1)";
        canvas.freeDrawingBrush.globalCompositeOperation = "destination-out";
        break;

      default:
        break;
    }

    canvas.renderAll();
  };

  const resetCanvas = () => {
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.forEachObject((o) => {
      o.selectable = true;
      o.evented = true;
    });
  };

  const toolBtn = (tool, Icon) => (
    <button
      onClick={() => setTool(tool)}
      className={`p-3 rounded ${
        activeTool === tool ? "bg-blue-500 text-white" : "bg-white"
      }`}
    >
      <Icon />
    </button>
  );

  return (
    <div className="flex flex-col gap-2 p-2 bg-gray-200 rounded">
      {toolBtn(TOOLS.SELECT, FaMousePointer)}
      {toolBtn(TOOLS.MOVE, FaHandPaper)}
      {toolBtn(TOOLS.TEXT, FaFont)}
      {toolBtn(TOOLS.BRUSH, FaPaintBrush)}
      {toolBtn(TOOLS.ERASER, FaEraser)}
    </div>
  );
}
