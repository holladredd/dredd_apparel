import { useState, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import EditorToolbar from "../components/toolbar/EditorToolbar";
import LayersPanel from "../components/LayersPanel";
import ObjectPanel from "../components/ObjectPanel";
import TemplatePanel from "../components/TemplatePanel";
import { FaThLarge } from "react-icons/fa";
import ToolSettings from "../components/toolbar/ToolSettings";
import { TOOLS } from "../components/toolbar/tools";
import LayerActions from "@/components/LayerActions";
import LogoButton from "@/components/LogoButton";
import LogoPanel from "@/components/LogoPanel";
import dynamic from "next/dynamic";

const CanvasEditor = dynamic(() => import("../components/CanvasEditor"), {
  ssr: false,
});

export default function Designer() {
  const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
  const [isLogoPanelOpen, setIsLogoPanelOpen] = useState(false);
  const [activeTool, setActiveTool] = useState(TOOLS.MOVE);
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectTemplate = useCallback((svgPath) => {
    // TODO: Implement SVG loading with Konva
    console.log("Load template:", svgPath);
  }, []);

  const toggleTemplatePanel = () => {
    setIsTemplatePanelOpen((prev) => !prev);
    if (isLogoPanelOpen) setIsLogoPanelOpen(false);
  };

  const handleSelectLogo = useCallback((svgPath) => {
    // TODO: Implement SVG loading with Konva
    console.log("Load logo:", svgPath);
  }, []);

  const toggleLogoPanel = () => {
    setIsLogoPanelOpen((prev) => !prev);
    if (isTemplatePanelOpen) setIsTemplatePanelOpen(false);
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
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              setObjects={setObjects}
            />
            <LogoButton onClick={toggleLogoPanel} isOpen={isLogoPanelOpen} />
          </div>

          {/* Collapsible Panels */}
          <div
            className={`transition-all duration-300 ease-in-out bg-gray-100 overflow-y-auto border-r ${
              isTemplatePanelOpen || isLogoPanelOpen ? "w-80 p-4" : "w-0"
            }`}
          >
            {isTemplatePanelOpen && (
              <TemplatePanel onSelectTemplate={handleSelectTemplate} />
            )}
            {isLogoPanelOpen && <LogoPanel onSelectLogo={handleSelectLogo} />}
          </div>
        </div>

        {/* Center Column (Canvas) */}
        <div className="flex-grow flex items-center justify-center bg-gray-200 p-4">
          <CanvasEditor
            objects={objects}
            setObjects={setObjects}
            activeTool={activeTool}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>

        {/* Right Column */}
        <div className="w-80 bg-gray-100 p-4 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <ToolSettings
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              selectedId={selectedId}
              objects={objects}
              setObjects={setObjects}
            />
            <ObjectPanel />
            <LayersPanel
              objects={objects}
              setObjects={setObjects}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>
          {/* Bottom Actions */}
          <div className="mt-auto">
            <LayerActions />
          </div>
        </div>
      </div>
    </div>
  );
}
