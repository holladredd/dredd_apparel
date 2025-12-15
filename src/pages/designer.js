import { useState, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import EditorToolbar from "../components/toolbar/EditorToolbar";
import CanvasEditor from "../components/CanvasEditor";
import LayersPanel from "../components/LayersPanel";
import ObjectPanel from "../components/ObjectPanel";
import TemplatePanel from "../components/TemplatePanel";
import { FaThLarge } from "react-icons/fa";
import ToolSettings from "../components/toolbar/ToolSettings";
import { TOOLS } from "../components/toolbar/tools";
import LayerActions from "@/components/LayerActions";
import LogoButton from "@/components/LogoButton";
import LogoPanel from "@/components/LogoPanel";

export default function Designer() {
  const [canvas, setCanvas] = useState(null);
  const [fabric, setFabric] = useState(null);
  const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
  const [isLogoPanelOpen, setIsLogoPanelOpen] = useState(false);
  const [activeTool, setActiveTool] = useState(TOOLS.MOVE);

  // Sync Move tool and other modes
  useEffect(() => {
    if (!canvas) return;
    switch (activeTool) {
      case TOOLS.MOVE:
      case TOOLS.SELECT:
      case TOOLS.TEXT:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.forEachObject((o) => {
          o.selectable = true;
          o.evented = true;
        });
        break;
      case TOOLS.BRUSH:
      case TOOLS.ERASER:
        canvas.isDrawingMode = true;
        canvas.selection = false;
        canvas.forEachObject((o) => {
          o.selectable = false;
          o.evented = false;
        });
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.selection = true;
    }
  }, [activeTool, canvas]);

  const handleCanvasReady = useCallback((canvasInstance, fabricInstance) => {
    setCanvas(canvasInstance);
    setFabric(fabricInstance);
  }, []);

  const handleSelectTemplate = useCallback(
    (svgPath) => {
      if (!canvas || !fabric) return;
      canvas.clear();

      fabric.loadSVGFromURL(svgPath, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        const scale = Math.min(
          canvas.getWidth() / obj.width,
          canvas.getHeight() / obj.height
        );
        obj.scale(scale);
        canvas.add(obj).centerObject(obj).renderAll();
      });
    },
    [canvas, fabric]
  );

  const toggleTemplatePanel = () => {
    setIsTemplatePanelOpen((prev) => !prev);
  };
  const handleSelectLogo = useCallback(
    (svgPath) => {
      if (!canvas || !fabric) return;
      fabric.loadSVGFromURL(svgPath, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        obj.scaleToWidth(100);
        canvas.add(obj).centerObject(obj).renderAll();
      });
    },
    [canvas, fabric]
  );

  const toggleLogoPanel = () => {
    setIsLogoPanelOpen((prev) => !prev);
  };
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        {/* Left Section */}
        <div className="flex">
          {/* Icon Bar & Tools */}
          <div className="flex flex-col bg-gray-100 p-2 border-r w-auto">
            <button
              onClick={toggleTemplatePanel}
              className={`p-3 rounded-lg mb-4 ${
                isTemplatePanelOpen
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              title="Templates"
            >
              <FaThLarge size={24} />
            </button>
            <EditorToolbar
              canvas={canvas}
              fabric={fabric}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
            />
          </div>

          {/* Collapsible Template Panel */}
          <div
            className={`transition-all duration-300 ease-in-out bg-gray-100 overflow-y-auto border-r ${
              isTemplatePanelOpen ? "w-80 p-4" : "w-0"
            }`}
          >
            {isTemplatePanelOpen && (
              <TemplatePanel onSelectTemplate={handleSelectTemplate} />
            )}
            <LogoButton onClick={toggleLogoPanel} isOpen={isLogoPanelOpen} />
            {isLogoPanelOpen && <LogoPanel onSelectLogo={handleSelectLogo} />}
          </div>
        </div>

        {/* Center Column (Canvas) */}
        <div className="flex-grow flex items-center justify-center bg-gray-200 p-4">
          <CanvasEditor onReady={handleCanvasReady} />
        </div>

        {/* Right Column */}
        <div className="w-80 bg-gray-100 p-4 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <ToolSettings
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              canvas={canvas}
              fabric={fabric}
            />
            <ObjectPanel />
            <LayersPanel canvas={canvas} />
          </div>
          {/* Bottom Actions */}
          <div className="mt-auto">
            <LayerActions canvas={canvas} fabric={fabric} />
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
