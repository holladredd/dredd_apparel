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
  return (
    <div className="bg-white rounded p-4 shadow mb-4 space-y-4">
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
