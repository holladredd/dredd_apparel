import { TOOLS } from "./tools";
import TextSettings from "../tool-settings/TextSettings";
import BrushSettings from "../tool-settings/BrushSettings";
import EraserSettings from "../tool-settings/EraserSettings";
import MoveSettings from "../tool-settings/MoveSettings";

export default function ToolSettings({ activeTool, canvas, fabric }) {
  if (!canvas) return null;

  switch (activeTool) {
    case TOOLS.MOVE:
      return <MoveSettings canvas={canvas} />;

    case TOOLS.TEXT:
      return <TextSettings canvas={canvas} fabric={fabric} />;

    case TOOLS.BRUSH:
      return <BrushSettings canvas={canvas} fabric={fabric} />;

    case TOOLS.ERASER:
      return <EraserSettings canvas={canvas} fabric={fabric} />;

    default:
      return null;
  }
}
