import { Stage, Layer } from "react-konva";
import { TOOLS } from "./toolbar/tools";
import TextNode from "./konvas/TextNode";
import RectNode from "./konvas/RectNode";
import LineNode from "./konvas/LineNode";

const CanvasEditor = ({
  objects,
  setObjects,
  activeTool,
  selectedId,
  setSelectedId,
}) => {
  const handleDragEnd = (e) => {
    const id = e.target.id();
    const newObjects = objects.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          x: e.target.x(),
          y: e.target.y(),
        };
      }
      return obj;
    });
    setObjects(newObjects);
  };

  const handleSelect = (e) => {
    const id = e.target.id();
    if (activeTool === TOOLS.MOVE || activeTool === TOOLS.TEXT) {
      setSelectedId(id);
    }
  };

  return (
    <div className="border rounded-lg p-2 bg-white shadow-inner">
      <Stage
        width={800}
        height={600}
        className="bg-gray-100"
        onClick={handleSelect}
      >
        <Layer>
          {objects.map((obj) => {
            switch (obj.type) {
              case "text":
                return (
                  <TextNode
                    key={obj.id}
                    shapeProps={obj}
                    isSelected={obj.id === selectedId}
                    onSelect={() => setSelectedId(obj.id)}
                    onChange={(newAttrs) => {
                      const newObjects = objects.map((o) =>
                        o.id === obj.id ? { ...o, ...newAttrs } : o
                      );
                      setObjects(newObjects);
                    }}
                    activeTool={activeTool}
                  />
                );
              case "rect":
                return (
                  <RectNode
                    key={obj.id}
                    shapeProps={obj}
                    isSelected={obj.id === selectedId}
                    onSelect={() => setSelectedId(obj.id)}
                    onChange={(newAttrs) => {
                      const newObjects = objects.map((o) =>
                        o.id === obj.id ? { ...o, ...newAttrs } : o
                      );
                      setObjects(newObjects);
                    }}
                    activeTool={activeTool}
                  />
                );
              case "line":
                return (
                  <LineNode
                    key={obj.id}
                    shapeProps={obj}
                    isSelected={obj.id === selectedId}
                    onSelect={() => setSelectedId(obj.id)}
                    onChange={(newAttrs) => {
                      const newObjects = objects.map((o) =>
                        o.id === obj.id ? { ...o, ...newAttrs } : o
                      );
                      setObjects(newObjects);
                    }}
                    activeTool={activeTool}
                  />
                );
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Hint: Drag objects, resize using corners, double-click text to edit.
      </p>
    </div>
  );
};

export default CanvasEditor;
