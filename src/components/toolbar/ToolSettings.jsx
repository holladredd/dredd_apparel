import BrushSettingsBrowser from "../tool-settings/BrushSettingsBrowser";
import EraserSettingsBrowser from "../tool-settings/EraserSettingsBrowser";
import MoveSettingsBrowser from "../tool-settings/MoveSettingsBrowser";
import TextSettingsBrowser from "../tool-settings/TextSettingsBrowser";
import { TOOLS } from "./tools";

export default function ToolSettings({
  activeTool,
  setActiveTool,
  selectedId,
  objects,
  setObjects,
  brushColor,
  setBrushColor,
  brushWidth,
  setBrushWidth,
  finishDrawing,
  setSelectedId,
}) {
  const selectedObject = objects.find((o) => o.id === selectedId);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setObjects((prevObjects) =>
      prevObjects.map((o) => {
        if (o.id === selectedId) {
          const newProps = {};
          // Prioritize fill, then stroke for which property to change
          if (o.hasOwnProperty("fill")) {
            newProps.fill = newColor;
          } else if (o.hasOwnProperty("stroke")) {
            newProps.stroke = newColor;
          }
          return { ...o, ...newProps };
        }
        return o;
      })
    );
  };

  let colorProperty;
  let colorValue = "#000000"; // Default color
  if (selectedObject) {
    if (selectedObject.hasOwnProperty("fill")) {
      colorProperty = "Fill";
      colorValue = selectedObject.fill;
    } else if (selectedObject.hasOwnProperty("stroke")) {
      colorProperty = "Stroke";
      colorValue = selectedObject.stroke;
    }
  }

  return (
    <div className="bg-white rounded p-4 shadow mb-4 space-y-4">
      {/* Colour setting for selected object */}
      {selectedObject && colorProperty && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {colorProperty} Colour
          </h3>
          <input
            type="color"
            value={colorValue}
            onChange={handleColorChange}
            className="w-full h-8 rounded cursor-pointer border-none"
          />
        </div>
      )}

      {activeTool === TOOLS.TEXT && (
        <TextSettingsBrowser
          selectedId={selectedId}
          objects={objects}
          setObjects={setObjects}
          setActiveTool={setActiveTool}
          setSelectedId={setSelectedId}
        />
      )}

      {activeTool === TOOLS.BRUSH && (
        <BrushSettingsBrowser
          color={brushColor}
          setColor={setBrushColor}
          width={brushWidth}
          setWidth={setBrushWidth}
          finishDrawing={finishDrawing}
        />
      )}

      {activeTool === TOOLS.ERASER && (
        <EraserSettingsBrowser width={brushWidth} setWidth={setBrushWidth} />
      )}

      {activeTool === TOOLS.MOVE && (
        <MoveSettingsBrowser selectedId={selectedId} setObjects={setObjects} />
      )}
    </div>
  );
}
