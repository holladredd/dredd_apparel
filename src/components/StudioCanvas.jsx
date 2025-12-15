import { useState, useCallback, useRef, useEffect } from "react";
import { Stage, Layer, Transformer, Rect, Line } from "react-konva";
import Navbar from "../components/Navbar";
import EditorToolbar from "../components/toolbar/EditorToolbar";
import LayersPanel from "../components/LayersPanel";
import ObjectPanel from "../components/ObjectPanel";
import TemplatePanel from "../components/TemplatePanel";
import LogoPanel from "../components/LogoPanel";
import ToolSettings from "../components/toolbar/ToolSettings";
import LayerActions from "@/components/LayerActions";
import LogoButton from "@/components/LogoButton";
import { FaThLarge } from "react-icons/fa";
import { TOOLS } from "../components/toolbar/tools";
import { v4 as uuid } from "uuid";
import useImage from "use-image";
import dynamic from "next/dynamic";

const TextNodeBrowser = dynamic(
  () => import("../components/konvas/TextNodeBrowser"),
  {
    ssr: false,
  }
);
const RectNode = dynamic(() => import("../components/konvas/RectNodeBrowser"), {
  ssr: false,
});

const DrawingLayer = dynamic(
  () => import("../components/konvas/DrawingLayerBrowser"),
  {
    ssr: false,
  }
);
const ImageNode = dynamic(
  () => import("../components/konvas/ImageNodeBrowser"),
  {
    ssr: false,
  }
);

/* ---------- main page component ---------- */
export default function Studio() {
  /* ---------- state ---------- */
  const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
  const [isLogoPanelOpen, setIsLogoPanelOpen] = useState(false);
  const [activeTool, setActiveTool] = useState(TOOLS.MOVE);
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(5);

  const stageRef = useRef();

  /* ---------- helpers inside StudioCanvas ---------- */
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const executeExtendedAction = (obj, id) => {
    switch (obj.type) {
      case "text":
        window.dispatchEvent(new CustomEvent("textDblClick", { detail: id }));
        break;
      case "image":
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          setObjects((o) =>
            o.map((x) => (x.id === id ? { ...x, imageUrl: url } : x))
          );
        };
        input.click();
        break;
      default:
      /* no-op */
    }
  };
  /* ---------- helpers ---------- */
  const handleSelectTemplate = useCallback((svgPath) => {
    const img = new Image();
    img.src = svgPath;
    img.onload = () => {
      setObjects((o) => [
        ...o,
        {
          id: uuid(),
          type: "image",
          imageUrl: svgPath,
          x: 200,
          y: 200,
          width: 300,
          height: 300,
          draggable: true,
        },
      ]);
    };
  }, []);

  const handleSelectLogo = useCallback(
    (svgPath) => {
      handleSelectTemplate(svgPath);
    },
    [handleSelectTemplate]
  );

  const toggleTemplatePanel = () => {
    setIsTemplatePanelOpen((p) => !p);
    if (isLogoPanelOpen) setIsLogoPanelOpen(false);
  };
  const toggleLogoPanel = () => {
    setIsLogoPanelOpen((p) => !p);
    if (isTemplatePanelOpen) setIsTemplatePanelOpen(false);
  };

  /* ---------- undo / redo ---------- */
  const history = useRef([]);
  const [step, setStep] = useState(-1);
  const saveHistory = () => {
    history.current = history.current.slice(0, step + 1);
    history.current.push(JSON.stringify(objects));
    setStep(history.current.length - 1);
  };

  useEffect(() => {
    if (objects.length) saveHistory();
  }, [objects]);

  const undo = () => {
    if (step <= 0) return;
    const prev = JSON.parse(history.current[step - 1]);
    setObjects(prev);
    setStep(step - 1);
  };
  const redo = () => {
    if (step >= history.current.length - 1) return;
    const next = JSON.parse(history.current[step + 1]);
    setObjects(next);
    setStep(step + 1);
  };

  /* ---------- shortcuts (Delete / Backspace / Escape) ---------- */
  useEffect(() => {
    const onKey = (e) => {
      /* >>>  BLOCK  if any text editor is open  <<< */
      if (document.querySelector("foreignObject textarea")) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        setObjects((o) => o.filter((obj) => obj.id !== selectedId));
        setSelectedId(null);
      }
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT */}
        <div className="flex">
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
              undo={undo}
              redo={redo}
            />
            <LogoButton onClick={toggleLogoPanel} isOpen={isLogoPanelOpen} />
          </div>

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

        {/* CENTER – CANVAS */}
        <div className="flex-grow flex items-center justify-center bg-gray-200 p-4">
          <div className="border rounded-lg p-2 bg-white shadow-inner">
            <Stage
              width={800}
              height={600}
              className="bg-gray-100"
              onClick={(e) => {
                const clicked = e.target;
                if (clicked === e.target.getStage()) {
                  setSelectedId(null);
                  return;
                }
                const id = clicked.id();
                if (!id) return;

                /* 1. SELECT */
                setSelectedId(id);

                /* 2. ACTIVATE TOOL MODE */
                const obj = objects.find((o) => o.id === id);
                if (obj) setActiveTool(capitalize(obj.type)); // "text" → "TEXT"
              }}
              onDblClick={(e) => {
                e.cancelBubble = true; // stop stage eating it
                const id = e.target.id();
                if (!id) return;
                const obj = objects.find((o) => o.id === id);
                if (obj) executeExtendedAction(obj, id); // see below
              }}
              ref={stageRef}
              style={{ pointerEvents: "auto" }}
            >
              <Layer>
                {objects.map((obj) => {
                  if (obj.type === "text")
                    return (
                      <TextNodeBrowser
                        key={obj.id}
                        shapeProps={obj}
                        isSelected={obj.id === selectedId}
                        onChange={(newAttrs) =>
                          setObjects((o) =>
                            o.map((x) =>
                              x.id === obj.id ? { ...x, ...newAttrs } : x
                            )
                          )
                        }
                      />
                    );
                  if (obj.type === "rect")
                    return (
                      <RectNode
                        key={obj.id}
                        shapeProps={obj}
                        isSelected={obj.id === selectedId}
                        onChange={(newAttrs) =>
                          setObjects((o) =>
                            o.map((x) =>
                              x.id === obj.id ? { ...x, ...newAttrs } : x
                            )
                          )
                        }
                      />
                    );
                  if (obj.type === "image")
                    return (
                      <ImageNode
                        key={obj.id}
                        shapeProps={obj}
                        isSelected={obj.id === selectedId}
                        onChange={(newAttrs) =>
                          setObjects((o) =>
                            o.map((x) =>
                              x.id === obj.id ? { ...x, ...newAttrs } : x
                            )
                          )
                        }
                      />
                    );
                  return null;
                })}
                {(activeTool === TOOLS.BRUSH ||
                  activeTool === TOOLS.ERASER) && (
                  <DrawingLayer
                    tool={activeTool.toLowerCase()}
                    color={brushColor}
                    strokeWidth={brushWidth}
                  />
                )}
              </Layer>
            </Stage>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Hint: Drag objects, resize using corners, double-click text to
              edit.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-80 bg-gray-100 text-gray-600 p-4 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <ToolSettings
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              selectedId={selectedId}
              objects={objects}
              setObjects={setObjects}
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              brushWidth={brushWidth}
              setBrushWidth={setBrushWidth}
              setSelectedId={setSelectedId}
            />
            <ObjectPanel selectedId={selectedId} objects={objects} />
            <LayersPanel
              objects={objects}
              setObjects={setObjects}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>
          <div className="mt-auto">
            <LayerActions
              objects={objects}
              setObjects={setObjects}
              selectedId={selectedId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
