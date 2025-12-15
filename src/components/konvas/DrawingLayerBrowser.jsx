import { Line, Rect } from "react-konva";
import { useState, useRef } from "react";

export default function DrawingLayerBrowser({ tool, color, strokeWidth }) {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines((l) => [
      ...l,
      { tool, color, strokeWidth, points: [pos.x, pos.y] },
    ]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setLines((l) => {
      const last = { ...l[l.length - 1] };
      last.points = last.points.concat([point.x, point.y]);
      return l.slice(0, -1).concat(last);
    });
  };

  const handleMouseUp = () => (isDrawing.current = false);

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          stroke={line.color}
          strokeWidth={line.strokeWidth}
          globalCompositeOperation={
            line.tool === "eraser" ? "destination-out" : "source-over"
          }
          lineCap="round"
          lineJoin="round"
        />
      ))}
      <Rect
        x={0}
        y={0}
        width={800}
        height={600}
        fill=""
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}
